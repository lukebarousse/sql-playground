<template>
  <button
    id="theme-toggle"
    type="button"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <!-- Sun (shown in dark mode, click to go light) -->
    <svg
      v-if="isDark"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
    <!-- Moon (shown in light mode, click to go dark) -->
    <svg
      v-else
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<script>
import { getActiveTheme, toggleTheme } from '@/lib/theme'

export default {
  name: 'ThemeToggle',
  data() {
    return {
      theme: getActiveTheme()
    }
  },
  computed: {
    isDark() {
      return this.theme === 'dark'
    }
  },
  methods: {
    toggle() {
      this.theme = toggleTheme()
    }
  }
}
</script>

<style scoped>
#theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-left: 16px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-medium);
  background-color: var(--color-bg-light-3);
  color: var(--color-text-base);
  cursor: pointer;
}
#theme-toggle:hover {
  border-color: var(--color-border-dark);
  color: var(--color-accent);
}
</style>
