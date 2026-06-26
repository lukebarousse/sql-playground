/*
 * Light/dark theme management.
 *
 * The active theme is stored on <html data-theme="..."> which drives the CSS
 * variable overrides in assets/styles/variables.css. CodeMirror editors can't
 * read CSS variables for their syntax theme, so we expose a matching
 * CodeMirror theme name and broadcast a 'themechange' event they listen to.
 */

const THEME_KEY = 'sqliteviz.theme'

// CodeMirror theme names (CSS imported in the editor components).
const CM_THEME = {
  light: 'neo',
  dark: 'material-darker'
}

export function getActiveTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light'
}

export function cmThemeFor(theme = getActiveTheme()) {
  return theme === 'dark' ? CM_THEME.dark : CM_THEME.light
}

function store(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (error) {
    /* ignore storage failures (private mode, etc.) */
  }
}

function read() {
  try {
    return localStorage.getItem(THEME_KEY)
  } catch (error) {
    return null
  }
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  store(theme)
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }))
}

// Set the initial theme before the app mounts: stored preference wins,
// otherwise follow the OS setting. No event needed (nothing is listening yet).
export function initTheme() {
  const stored = read()
  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = stored || (prefersDark ? 'dark' : 'light')
  document.documentElement.setAttribute('data-theme', theme)
  return theme
}

export function toggleTheme() {
  const next = getActiveTheme() === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  return next
}
