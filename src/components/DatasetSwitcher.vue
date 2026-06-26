<template>
  <div v-if="datasets.length" id="dataset-switcher">
    <label for="dataset-select">Dataset</label>
    <select
      id="dataset-select"
      :value="currentId"
      title="Switch the active dataset"
      @change="onChange"
    >
      <option
        v-for="dataset in datasets"
        :key="dataset.id"
        :value="dataset.id"
      >
        {{ dataset.label || dataset.id }}
      </option>
    </select>
  </div>
</template>

<script>
import {
  loadConfig,
  loadQueryFor,
  getRememberedLoad,
  rememberLoad
} from '@/lib/datasets'

export default {
  name: 'DatasetSwitcher',
  data() {
    return {
      datasets: [],
      currentId: null
    }
  },
  async created() {
    const config = await loadConfig()
    this.datasets = config.datasets
    this.currentId = this.detectCurrentId(config)
  },
  methods: {
    // Match the remembered data_url against the configured datasets so the
    // dropdown reflects what is actually loaded.
    detectCurrentId(config) {
      const remembered = getRememberedLoad()
      if (remembered && remembered.data_url) {
        const match = config.datasets.find(
          d => d.data_url === remembered.data_url
        )
        if (match) {
          return match.id
        }
      }
      return config.default
    },
    onChange(event) {
      const dataset = this.datasets.find(d => d.id === event.target.value)
      const query = loadQueryFor(dataset)
      if (!query) {
        return
      }
      this.currentId = dataset.id
      // Persist immediately, then load. LoadView also persists, but doing it
      // here keeps the dropdown in sync even if the user navigates away early.
      rememberLoad(query)
      this.$router.push({ path: '/load', query })
    }
  }
}
</script>

<style scoped>
#dataset-switcher {
  display: flex;
  align-items: center;
  margin-left: 28px;
}
#dataset-switcher label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-light-2);
  margin-right: 8px;
}
#dataset-select {
  font-size: 15px;
  color: var(--color-text-base);
  background-color: var(--color-bg-light-3);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-medium);
  padding: 5px 8px;
  max-width: 260px;
  cursor: pointer;
}
#dataset-select:hover {
  border-color: var(--color-border-dark);
}
</style>
