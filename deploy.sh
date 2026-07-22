#!/usr/bin/env bash

set -Eeuo pipefail

readonly DEPLOY_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly DEPLOY_SOURCE="$DEPLOY_ROOT/src"
readonly DEPLOY_HOST="macmini"
readonly DEPLOY_REMOTE_LIVE="/Users/evgen/sites/eugenekvach"
readonly DEPLOY_REMOTE_BACKUPS="/Users/evgen/sites/backups"
readonly DEPLOY_URL="https://eugenekvach.ru"

deploy_log() {
    printf '\n[%s] %s\n' "$1" "$2"
}

deploy_fail() {
    printf '\nDeploy failed: %s\n' "$1" >&2
    exit 1
}

deploy_require_command() {
    command -v "$1" >/dev/null 2>&1 || deploy_fail "required command is missing: $1"
}

deploy_assert_status() {
    local expected_status="$1"
    local checked_url="$2"
    local actual_status

    actual_status="$(curl --silent --show-error --max-time 20 --output /dev/null --write-out '%{http_code}' "$checked_url")"
    [[ "$actual_status" == "$expected_status" ]] || {
        printf 'Expected %s from %s, received %s\n' "$expected_status" "$checked_url" "$actual_status" >&2
        return 1
    }
}

deploy_assert_redirect() {
    local checked_url="$1"
    local expected_target="$2"
    local redirect_result

    redirect_result="$(curl --silent --show-error --max-time 20 --output /dev/null --write-out '%{http_code}|%{redirect_url}' "$checked_url")"
    [[ "$redirect_result" == "301|$expected_target" ]] || {
        printf 'Expected 301 to %s from %s, received %s\n' "$expected_target" "$checked_url" "$redirect_result" >&2
        return 1
    }
}

deploy_assert_hash() {
    local relative_path="$1"
    local revision="$2"
    local local_hash
    local live_hash

    local_hash="$(shasum -a 256 "$DEPLOY_SOURCE/$relative_path" | awk '{print $1}')"
    live_hash="$(curl --silent --show-error --fail --max-time 20 "$DEPLOY_URL/$relative_path?revision=$revision" | shasum -a 256 | awk '{print $1}')"

    [[ "$local_hash" == "$live_hash" ]] || {
        printf 'Checksum mismatch for %s\n' "$relative_path" >&2
        return 1
    }
}

deploy_verify_live() {
    local revision="$1"

    deploy_assert_redirect "http://eugenekvach.ru/" "$DEPLOY_URL/" || return 1
    deploy_assert_redirect "http://www.eugenekvach.ru/" "$DEPLOY_URL/" || return 1
    deploy_assert_redirect "https://www.eugenekvach.ru/" "$DEPLOY_URL/" || return 1

    deploy_assert_status "200" "$DEPLOY_URL/?revision=$revision" || return 1
    deploy_assert_status "200" "$DEPLOY_URL/ai/?revision=$revision" || return 1
    deploy_assert_status "200" "$DEPLOY_URL/helper/?revision=$revision" || return 1
    deploy_assert_status "200" "$DEPLOY_URL/styles.css?revision=$revision" || return 1
    deploy_assert_status "200" "$DEPLOY_URL/assets/eugene-kvach.jpg?revision=$revision" || return 1
    deploy_assert_status "404" "$DEPLOY_URL/deploy-smoke-not-found?revision=$revision" || return 1

    deploy_assert_hash "index.html" "$revision" || return 1
    deploy_assert_hash "ai/index.html" "$revision" || return 1
    deploy_assert_hash "helper/index.html" "$revision" || return 1
    deploy_assert_hash "styles.css" "$revision" || return 1
    deploy_assert_hash "assets/eugene-kvach.jpg" "$revision" || return 1
}

deploy_rollback() {
    local backup_path="$1"

    deploy_log "rollback" "Restoring the previous static release"
    ssh "$DEPLOY_HOST" "/usr/bin/rsync -a --delete '$backup_path/' '$DEPLOY_REMOTE_LIVE/'"
}

deploy_validate_source() {
    deploy_log "1/5" "Validating local source"

    [[ -f "$DEPLOY_SOURCE/index.html" ]] || deploy_fail "src/index.html is missing"
    [[ -f "$DEPLOY_SOURCE/ai/index.html" ]] || deploy_fail "src/ai/index.html is missing"
    [[ -f "$DEPLOY_SOURCE/helper/index.html" ]] || deploy_fail "src/helper/index.html is missing"
    [[ -f "$DEPLOY_SOURCE/styles.css" ]] || deploy_fail "src/styles.css is missing"
    [[ -f "$DEPLOY_SOURCE/assets/eugene-kvach.jpg" ]] || deploy_fail "Hero image is missing"

    if grep -Eiq 'noindex|nofollow' "$DEPLOY_SOURCE/index.html" "$DEPLOY_SOURCE/ai/index.html" "$DEPLOY_SOURCE/helper/index.html"; then
        deploy_fail "production HTML contains noindex or nofollow"
    fi

    local css_hash
    local html_file
    css_hash="$(shasum -a 256 "$DEPLOY_SOURCE/styles.css" | awk '{print substr($1, 1, 12)}')"
    while IFS= read -r html_file; do
        if ! grep -Fq "styles.css?v=$css_hash\"" "$html_file"; then
            deploy_fail "stylesheet cache-buster is stale in ${html_file#"$DEPLOY_ROOT/"}; expected styles.css?v=$css_hash"
        fi
    done < <(find "$DEPLOY_SOURCE" -type f -name '*.html' -print)

    git -C "$DEPLOY_ROOT" diff --check

    if [[ -n "$(git -C "$DEPLOY_ROOT" status --porcelain --untracked-files=normal)" ]]; then
        deploy_fail "working tree is not clean; commit or stash changes first"
    fi

    local current_branch
    current_branch="$(git -C "$DEPLOY_ROOT" branch --show-current)"
    [[ "$current_branch" == "master" ]] || deploy_fail "deploy is allowed only from master, current branch: $current_branch"
}

main() {
    deploy_require_command git
    deploy_require_command rsync
    deploy_require_command ssh
    deploy_require_command curl
    deploy_require_command find
    deploy_require_command shasum

    deploy_validate_source

    local deploy_revision
    local remote_backup
    deploy_revision="$(git -C "$DEPLOY_ROOT" rev-parse --short=12 HEAD)"
    remote_backup="$DEPLOY_REMOTE_BACKUPS/eugenekvach-before-$deploy_revision"

    if [[ "${1:-}" == "--dry-run" ]]; then
        deploy_log "dry-run" "Showing files that would be synchronized"
        rsync -avn --delete \
            --exclude '.DS_Store' \
            --exclude '.well-known/' \
            "$DEPLOY_SOURCE/" \
            "$DEPLOY_HOST:$DEPLOY_REMOTE_LIVE/"
        exit 0
    fi

    [[ $# -eq 0 ]] || deploy_fail "unknown argument: $1"

    deploy_log "2/5" "Pushing master to origin"
    git -C "$DEPLOY_ROOT" push origin master

    deploy_log "3/5" "Backing up the current static release"
    ssh "$DEPLOY_HOST" "mkdir -p '$remote_backup' && /usr/bin/rsync -a --delete '$DEPLOY_REMOTE_LIVE/' '$remote_backup/'"

    deploy_log "4/5" "Synchronizing src/ to production"
    if ! rsync -av --delete \
        --exclude '.DS_Store' \
        --exclude '.well-known/' \
        "$DEPLOY_SOURCE/" \
        "$DEPLOY_HOST:$DEPLOY_REMOTE_LIVE/"; then
        deploy_rollback "$remote_backup"
        deploy_fail "rsync failed; previous release restored"
    fi

    deploy_log "5/5" "Running external HTTPS smoke tests"
    if ! deploy_verify_live "$deploy_revision"; then
        deploy_rollback "$remote_backup"
        deploy_fail "smoke test failed; previous release restored"
    fi

    printf '\nDeploy successful\nRevision: %s\nURL: %s\nBackup: %s:%s\n' \
        "$deploy_revision" \
        "$DEPLOY_URL" \
        "$DEPLOY_HOST" \
        "$remote_backup"
}

main "$@"
