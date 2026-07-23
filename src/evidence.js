(() => {
  const page = document.body;
  const controls = document.querySelectorAll('[data-density]');
  const storageKey = 'evidence-content-density';
  const jumpTo = (top) => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top, behavior: 'auto' });
    root.style.scrollBehavior = previousScrollBehavior;
  };

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  const setDensity = (density, resetScroll = false) => {
    page.classList.toggle('evidence-page--min', density === 'min');
    controls.forEach((control) => {
      control.setAttribute('aria-pressed', String(control.dataset.density === density));
    });

    try {
      localStorage.setItem(storageKey, density);
    } catch {
      // The preference is optional; the page remains fully usable without storage.
    }

    if (resetScroll) {
      requestAnimationFrame(() => {
        const resetTop = density === 'max'
          ? storyStart() + storySticky.clientHeight * storyInitialStage
          : 0;
        jumpTo(resetTop);
      });
    }
  };

  try {
    const savedDensity = localStorage.getItem(storageKey);
    if (savedDensity === 'min' || savedDensity === 'max') setDensity(savedDensity);
  } catch {
    // Keep the default MAX mode when storage is unavailable.
  }

  controls.forEach((control) => {
    control.addEventListener('click', () => setDensity(control.dataset.density, true));
  });

  const header = document.querySelector('.concept-header');
  const story = document.querySelector('.evidence-scroll-story');
  const storySticky = document.querySelector('.evidence-scroll-story__sticky');
  const storyTrack = document.querySelector('.evidence-scroll-story__track');
  const storySnaps = document.querySelector('.evidence-story-snaps');
  const engagement = document.querySelector('#engagement');
  const storyLinks = [...document.querySelectorAll('a[href="#content"], a[href="#frontend"], a[href="#ai"], a[href="#engagement"]')];
  const headerLinks = [...document.querySelectorAll('.evidence-nav a[href^="#"]')];
  const storyRoutes = ['#content', '#engagement', '#ai', '#frontend'];
  const sceneNavigations = {
    content: [...document.querySelectorAll('.evidence-story-panel--hero .evidence-scene-nav--content')],
    frontend: [...document.querySelectorAll('#frontend .evidence-scene-nav--frontend')],
    ai: [...document.querySelectorAll('#ai .evidence-scene-nav--ai')],
    engagement: [...document.querySelectorAll('#engagement .evidence-scene-nav--engagement')],
  };
  const desktopStory = window.matchMedia('(min-width: 901px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const storyCycleLength = 4;
  const storyInitialStage = 8;
  const storyStageCount = 16;

  const storyStart = () => story.offsetTop - header.offsetHeight;
  const storyPosition = (stage) => storyStart() + storySticky.clientHeight * stage;
  const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;
  const storyProgress = () => (window.scrollY - storyStart()) / storySticky.clientHeight;
  const currentStoryStage = () => Math.round(Math.max(0, Math.min(storyStageCount, storyProgress())));

  const populateStorySnaps = () => {
    const fragment = document.createDocumentFragment();
    const stageHeight = storySticky.clientHeight;

    for (let stage = 0; stage <= storyStageCount; stage += 1) {
      const snap = document.createElement('span');
      snap.className = 'evidence-story-snap';
      snap.style.top = stageHeight * stage + 'px';
      fragment.append(snap);
    }

    storySnaps.replaceChildren(fragment);
  };

  const setActiveStoryLink = (activeHash) => {
    headerLinks.forEach((link) => {
      if (link.hash === activeHash) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  const setStoryRoute = (hash) => {
    if (!storyTransitioning && window.location.hash !== hash) history.replaceState(null, '', hash);
  };

  const setStoryState = (hash) => {
    setActiveStoryLink(hash);
    setStoryRoute(hash);
  };

  const setSceneNavigationOpacity = (navigations, opacity) => {
    navigations.forEach((navigation) => {
      const visible = opacity > 0.01;
      navigation.style.setProperty('--evidence-scene-nav-opacity', opacity.toFixed(3));
      navigation.style.pointerEvents = visible ? 'auto' : 'none';
      navigation.tabIndex = visible ? 0 : -1;
      navigation.setAttribute('aria-hidden', String(!visible));
    });
  };

  const updateSceneNavigations = (sceneIndex) => {
    if (!desktopStory.matches) {
      Object.values(sceneNavigations).flat().forEach((navigation) => {
        navigation.style.removeProperty('--evidence-scene-nav-opacity');
        navigation.style.removeProperty('pointer-events');
        navigation.removeAttribute('tabindex');
        navigation.removeAttribute('aria-hidden');
      });
      return;
    }

    setSceneNavigationOpacity(sceneNavigations.content, sceneIndex === 0 ? 1 : 0);
    setSceneNavigationOpacity(sceneNavigations.frontend, sceneIndex === 3 ? 1 : 0);
    setSceneNavigationOpacity(sceneNavigations.ai, sceneIndex === 2 ? 1 : 0);
    setSceneNavigationOpacity(sceneNavigations.engagement, sceneIndex === 1 ? 1 : 0);
  };

  const updateStory = () => {
    if (!desktopStory.matches) {
      storyTrack.style.transform = '';
      const scrollTop = window.scrollY + header.offsetHeight + 1;
      const mobileScenes = [
        ['#content', story],
        ['#engagement', engagement],
        ['#ai', document.querySelector('#ai')],
        ['#frontend', document.querySelector('#frontend')],
      ];
      const activeScene = mobileScenes.reduce((current, scene) => (
        scene[1].offsetTop <= scrollTop ? scene : current
      ), mobileScenes[0]);
      setStoryState(activeScene[0]);
      updateSceneNavigations(0);
      return;
    }

    const stageHeight = storySticky.clientHeight;
    const progress = Math.max(0, Math.min(storyStageCount, storyProgress()));
    const cycleProgress = modulo(progress, storyCycleLength);
    const segment = Math.floor(cycleProgress);
    const segmentProgress = cycleProgress - segment;
    const squarePath = [[0, 0], [-1, 0], [-1, -1], [0, -1], [0, 0]];
    const currentPoint = squarePath[segment];
    const nextPoint = squarePath[segment + 1];
    const horizontalPosition = (currentPoint[0] + (nextPoint[0] - currentPoint[0]) * segmentProgress) * storySticky.clientWidth;
    const verticalPosition = (currentPoint[1] + (nextPoint[1] - currentPoint[1]) * segmentProgress) * stageHeight;
    const sceneIndex = modulo(Math.round(cycleProgress), storyCycleLength);

    storyTrack.style.transform = 'translate3d(' + horizontalPosition + 'px, ' + verticalPosition + 'px, 0)';
    setStoryState(storyRoutes[sceneIndex]);
    updateSceneNavigations(sceneIndex);
  };

  const storyPositions = () => [
    storyPosition(storyInitialStage),
    storyPosition(storyInitialStage + 1),
    storyPosition(storyInitialStage + 2),
    storyPosition(storyInitialStage + 3),
  ];

  const nearestStoryPosition = (routeIndex) => {
    let nearest = storyPositions()[routeIndex];

    for (let stage = routeIndex; stage <= storyStageCount; stage += storyCycleLength) {
      const position = storyPosition(stage);
      if (Math.abs(position - window.scrollY) < Math.abs(nearest - window.scrollY)) nearest = position;
    }

    return nearest;
  };

  let storyTransitioning = false;

  const scrollToStoryPosition = (target) => {
    window.scrollTo({
      top: target,
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
    });
  };

  const transitionToStoryPosition = (target) => {
    if (!desktopStory.matches || page.classList.contains('evidence-page--min') || storyTransitioning) return false;
    if (Math.abs(window.scrollY - target) < 2) return false;

    storyTransitioning = true;
    scrollToStoryPosition(target);

    const startedAt = performance.now();
    const settle = () => {
      const reachedTarget = Math.abs(window.scrollY - target) < 2 || performance.now() - startedAt > 1200;
      if (!reachedTarget) {
        requestAnimationFrame(settle);
        return;
      }

      storyTransitioning = false;
    };
    requestAnimationFrame(settle);
    return true;
  };

  const goToStoryRoute = (hash, writeHistory = false) => {
    const routeIndex = storyRoutes.indexOf(hash);
    if (routeIndex === -1) return false;

    if (writeHistory && window.location.hash !== hash) history.pushState(null, '', hash);
    return transitionToStoryPosition(nearestStoryPosition(routeIndex));
  };

  window.addEventListener('keydown', (event) => {
    const isEditableTarget = event.target instanceof Element && event.target.matches('input, textarea, select, [contenteditable="true"]');
    if (
      !desktopStory.matches ||
      page.classList.contains('evidence-page--min') ||
      event.altKey || event.ctrlKey || event.metaKey ||
      document.querySelector('.evidence-detail[open]') ||
      isEditableTarget
    ) return;

    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
    if (direction === 0) return;

    const targetStage = currentStoryStage() + direction;
    if (targetStage < 0 || targetStage > storyStageCount) return;

    event.preventDefault();
    const targetRoute = storyRoutes[modulo(targetStage, storyCycleLength)];
    if (window.location.hash !== targetRoute) history.pushState(null, '', targetRoute);
    transitionToStoryPosition(storyPosition(targetStage));
  });

  storyLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!desktopStory.matches) return;
      event.preventDefault();
      goToStoryRoute(link.hash, true);
    });
  });

  let animationFrame;
  const requestStoryUpdate = () => {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(updateStory);
  };

  const normalizeInfiniteStory = () => {
    if (
      !desktopStory.matches ||
      page.classList.contains('evidence-page--min') ||
      storyTransitioning
    ) return;

    const stage = currentStoryStage();
    const completedCycle = stage !== storyInitialStage && modulo(stage, storyCycleLength) === 0;
    if (!completedCycle) return;

    jumpTo(storyPosition(storyInitialStage));
    requestStoryUpdate();
  };

  const resizeStory = () => {
    populateStorySnaps();
    requestStoryUpdate();
  };

  window.addEventListener('scroll', requestStoryUpdate, { passive: true });
  window.addEventListener('scrollend', normalizeInfiniteStory);
  window.addEventListener('resize', resizeStory);
  desktopStory.addEventListener('change', resizeStory);
  window.addEventListener('popstate', () => {
    if (desktopStory.matches && storyRoutes.includes(window.location.hash)) goToStoryRoute(window.location.hash);
  });
  const initialStoryHash = window.location.hash;
  populateStorySnaps();

  if (desktopStory.matches && !page.classList.contains('evidence-page--min')) {
    const initialRoute = Math.max(0, storyRoutes.indexOf(initialStoryHash));
    requestAnimationFrame(() => {
      jumpTo(storyPosition(storyInitialStage + initialRoute));
      requestStoryUpdate();
    });
  } else {
    requestStoryUpdate();
  }

  document.querySelectorAll('[data-open-detail]').forEach((control) => {
    control.addEventListener('click', () => {
      const detail = document.getElementById(control.dataset.openDetail);
      if (typeof detail.showModal === 'function') detail.showModal();
      else detail.setAttribute('open', '');
    });
  });

  document.querySelectorAll('[data-close-detail]').forEach((control) => {
    control.addEventListener('click', () => control.closest('dialog').close());
  });
})();
