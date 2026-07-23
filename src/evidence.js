(() => {
  const page = document.body;
  const controls = document.querySelectorAll('[data-density]');
  const storageKey = 'evidence-content-density';

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
  const storyLinks = [...document.querySelectorAll('a[href="#frontend"], a[href="#ai"], a[href="#engagement"]')];
  const headerLinks = [...document.querySelectorAll('.evidence-nav a[href^="#"]')];
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

  const updateStory = () => {
    if (!desktopStory.matches) {
      storyTrack.style.transform = '';
      setActiveStoryLink('');
      return;
    }

    if (window.scrollY >= engagement.offsetTop - header.offsetHeight) {
      storyTrack.style.transform = 'translate3d(' + (-(storyTrack.scrollWidth - storySticky.clientWidth)) + 'px, 0, 0)';
      setActiveStoryLink('#engagement');
      return;
    }

    const progress = Math.max(0, Math.min(1, (window.scrollY - storyStart()) / storyRange()));
    const horizontalTravel = storyTrack.scrollWidth - storySticky.clientWidth;
    storyTrack.style.transform = 'translate3d(' + (-progress * horizontalTravel) + 'px, 0, 0)';
    setActiveStoryLink(progress < 0.25 ? '' : progress < 0.75 ? '#frontend' : '#ai');
  };

  const goToStoryPosition = (progress) => {
    window.scrollTo({
      top: storyStart() + storyRange() * progress,
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
    });
  };

  storyLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!desktopStory.matches) return;
      event.preventDefault();
      if (link.hash === '#engagement') {
        window.scrollTo({
          top: engagement.offsetTop - header.offsetHeight,
          behavior: reduceMotion.matches ? 'auto' : 'smooth',
        });
      } else {
        goToStoryPosition(link.hash === '#frontend' ? 0.5 : 1);
      }
      history.replaceState(null, '', link.hash);
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
  requestStoryUpdate();

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
