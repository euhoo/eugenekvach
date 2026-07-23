(() => {
  const page = document.body;
  const controls = document.querySelectorAll('[data-density]');
  const storageKey = 'evidence-content-density';

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
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
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
  const engagement = document.querySelector('#engagement');
  const storyLinks = [...document.querySelectorAll('a[href="#content"], a[href="#frontend"], a[href="#ai"], a[href="#engagement"]')];
  const headerLinks = [...document.querySelectorAll('.evidence-nav a[href^="#"]')];
  const storyRoutes = ['#content', '#frontend', '#ai', '#engagement'];
  const sceneNavigations = {
    frontend: [document.querySelector('#frontend .evidence-scene-nav--back')],
    ai: [document.querySelector('#ai .evidence-scene-nav--back')],
    engagement: [document.querySelector('#engagement .evidence-scene-nav--up')],
  };
  const desktopStory = window.matchMedia('(min-width: 901px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const storyStart = () => story.offsetTop - header.offsetHeight;
  const storyRange = () => story.offsetHeight - storySticky.offsetHeight;

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

  const updateSceneNavigations = (progress, isEngagement = false) => {
    if (!desktopStory.matches) {
      Object.values(sceneNavigations).flat().forEach((navigation) => {
        navigation.style.removeProperty('--evidence-scene-nav-opacity');
        navigation.style.removeProperty('pointer-events');
        navigation.removeAttribute('tabindex');
        navigation.removeAttribute('aria-hidden');
      });
      return;
    }

    const frontendOpacity = isEngagement ? 0 : Math.max(0, 1 - Math.abs(progress - 0.5) * 2);
    const aiOpacity = isEngagement ? 0 : Math.max(0, (progress - 0.5) * 2);
    setSceneNavigationOpacity(sceneNavigations.frontend, frontendOpacity);
    setSceneNavigationOpacity(sceneNavigations.ai, aiOpacity);
    setSceneNavigationOpacity(sceneNavigations.engagement, isEngagement ? 1 : 0);
  };

  const updateStory = () => {
    if (!desktopStory.matches) {
      storyTrack.style.transform = '';
      const scrollTop = window.scrollY + header.offsetHeight + 1;
      const mobileScenes = [
        ['#content', story],
        ['#frontend', document.querySelector('#frontend')],
        ['#ai', document.querySelector('#ai')],
        ['#engagement', engagement],
      ];
      const activeScene = mobileScenes.reduce((current, scene) => (
        scene[1].offsetTop <= scrollTop ? scene : current
      ), mobileScenes[0]);
      setStoryState(activeScene[0]);
      updateSceneNavigations(0);
      return;
    }

    if (window.scrollY >= engagement.offsetTop - header.offsetHeight) {
      storyTrack.style.transform = 'translate3d(' + (-(storyTrack.scrollWidth - storySticky.clientWidth)) + 'px, 0, 0)';
      setStoryState('#engagement');
      updateSceneNavigations(1, true);
      return;
    }

    const progress = Math.max(0, Math.min(1, (window.scrollY - storyStart()) / storyRange()));
    const horizontalTravel = storyTrack.scrollWidth - storySticky.clientWidth;
    storyTrack.style.transform = 'translate3d(' + (-progress * horizontalTravel) + 'px, 0, 0)';
    setStoryState(progress < 0.25 ? '#content' : progress < 0.75 ? '#frontend' : '#ai');
    updateSceneNavigations(progress);
  };

  const storyPositions = () => [
    storyStart(),
    storyStart() + storyRange() * 0.5,
    storyStart() + storyRange(),
    engagement.offsetTop - header.offsetHeight,
  ];

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
    return transitionToStoryPosition(storyPositions()[routeIndex]);
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

    const positions = storyPositions();
    const currentIndex = positions.reduce((closestIndex, position, index) => (
      Math.abs(position - window.scrollY) < Math.abs(positions[closestIndex] - window.scrollY) ? index : closestIndex
    ), 0);
    const targetIndex = Math.max(0, Math.min(positions.length - 1, currentIndex + direction));
    if (targetIndex === currentIndex) return;

    event.preventDefault();
    goToStoryRoute(storyRoutes[targetIndex], true);
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

  window.addEventListener('scroll', requestStoryUpdate, { passive: true });
  window.addEventListener('resize', requestStoryUpdate);
  desktopStory.addEventListener('change', requestStoryUpdate);
  window.addEventListener('popstate', () => {
    if (desktopStory.matches && storyRoutes.includes(window.location.hash)) goToStoryRoute(window.location.hash);
  });
  requestStoryUpdate();

  if (desktopStory.matches && storyRoutes.includes(window.location.hash) && window.location.hash !== '#content') {
    requestAnimationFrame(() => goToStoryRoute(window.location.hash));
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
