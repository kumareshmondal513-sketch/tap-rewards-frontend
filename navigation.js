const ALLOWED_SECTIONS = [
  'home',
  'tasks',
  'referrals',
  'profile',
  'withdrawal',
  'support'
];

export function getAllowedSections() {
  return [...ALLOWED_SECTIONS];
}

export function navigateTo(section) {
  if (!ALLOWED_SECTIONS.includes(section)) {
    return false;
  }

  const target = document.querySelector(
    `[data-section="${section}"]`
  );

  if (!target) {
    return false;
  }

  document.querySelectorAll('[data-section]').forEach(
    (element) => {
      element.hidden = element !== target;
    }
  );

  document.querySelectorAll('[data-nav]').forEach(
    (element) => {
      const active = element.dataset.nav === section;

      element.classList.toggle('active', active);

      if (active) {
        element.setAttribute('aria-current', 'page');
      } else {
        element.removeAttribute('aria-current');
      }
    }
  );

  return true;
}

export function initializeNavigation() {
  document.querySelectorAll('[data-nav]').forEach(
    (element) => {
      element.addEventListener('click', () => {
        navigateTo(element.dataset.nav);
      });
    }
  );
}