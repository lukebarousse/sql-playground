/*
 * Course dataset management for the SQL playground.
 *
 * Two responsibilities:
 *   1. Load the runtime, config-driven list of datasets (public/datasets.json)
 *      so new datasets can be added without rebuilding the app.
 *   2. Remember the last dataset the user loaded (localStorage) so a page
 *      refresh restores it instead of falling back to the bundled demo DB.
 */

const LAST_LOAD_KEY = 'sqliteviz.lastLoad'

let configPromise = null

// Fetch and cache public/datasets.json. Resolves to a normalised config or a
// safe empty default if the file is missing/unreachable (never rejects).
export function loadConfig() {
  if (!configPromise) {
    const url = `${import.meta.env.BASE_URL}datasets.json`
    // 'no-cache' forces the browser to revalidate with the server every time,
    // so editing datasets.json on the host shows up on the next load (a cheap
    // 304 when unchanged) instead of being served stale from cache.
    configPromise = fetch(url, { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) {
          throw new Error(`datasets.json HTTP ${res.status}`)
        }
        return res.json()
      })
      .then(cfg => ({
        default: cfg.default || (cfg.datasets && cfg.datasets[0]?.id) || null,
        datasets: Array.isArray(cfg.datasets) ? cfg.datasets : []
      }))
      .catch(error => {
        console.warn('Could not load datasets.json:', error)
        return { default: null, datasets: [] }
      })
  }
  return configPromise
}

// Build the /load route query for a dataset config entry.
export function loadQueryFor(dataset) {
  if (!dataset || !dataset.data_url) {
    return null
  }
  const query = {
    data_url: dataset.data_url,
    data_format: dataset.data_format || 'sqlite'
  }
  if (dataset.inquiry_url) {
    query.inquiry_url = dataset.inquiry_url
  }
  return query
}

// Persist the most recently loaded dataset so refreshes can restore it.
export function rememberLoad(query) {
  if (!query || !query.data_url) {
    return
  }
  try {
    localStorage.setItem(
      LAST_LOAD_KEY,
      JSON.stringify({
        data_url: query.data_url,
        data_format: query.data_format || 'sqlite',
        inquiry_url: query.inquiry_url || undefined
      })
    )
  } catch (error) {
    console.warn('Could not remember last dataset:', error)
  }
}

export function getRememberedLoad() {
  try {
    const raw = localStorage.getItem(LAST_LOAD_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    return null
  }
}

export function clearRememberedLoad() {
  try {
    localStorage.removeItem(LAST_LOAD_KEY)
  } catch (error) {
    /* ignore */
  }
}

// Decide what (if anything) to load when the app starts with no database in
// memory (fresh load or refresh). Returns a vue-router location for the /load
// route, or null to fall back to the bundled demo database.
export async function getStartupLoadRoute() {
  const remembered = getRememberedLoad()
  if (remembered && remembered.data_url) {
    return { path: '/load', query: remembered }
  }

  // First-time visitor: load the configured default dataset if there is one.
  const config = await loadConfig()
  if (config.default) {
    const dataset = config.datasets.find(d => d.id === config.default)
    const query = loadQueryFor(dataset)
    if (query) {
      return { path: '/load', query }
    }
  }
  return null
}
