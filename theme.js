const THEMES = {
  dark: {
    background: '#101827',
    surface: '#1b2638',
    text: '#ffffff',
    muted: '#aab7ca',
    primary: '#39d98a',
    border: '#2b3a50'
  },

  light: {
    background: '#f3f6fb',
    surface: '#ffffff',
    text: '#172033',
    muted: '#637086',
    primary: '#087f5b',
    border: '#dce3ed'
  }
};

export function getTheme(name = 'dark') {
  const theme = THEMES[name];

  if (!theme) {
    throw new Error('Unknown theme.');
  }

  return { ...theme };
}

export function applyTheme(name = 'dark') {
  const theme = getTheme(name);
  const root = document.documentElement;

  root.style.setProperty(
    '--app-background',
    theme.background
  );

  root.style.setProperty(
    '--app-surface',
    theme.surface
  );

  root.style.setProperty(
    '--app-text',
    theme.text
  );

  root.style.setProperty(
    '--app-muted',
    theme.muted
  );

  root.style.setProperty(
    '--app-primary',
    theme.primary
  );

  root.style.setProperty(
    '--app-border',
    theme.border
  );

  root.style.colorScheme = name;

  return theme;
}

export function getAvailableThemes() {
  return Object.keys(THEMES);
}