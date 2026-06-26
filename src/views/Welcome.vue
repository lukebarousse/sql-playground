<template>
  <div id="dbloader-container">
    <db-uploader type="illustrated" />
    <div id="note">
      This SQL playground runs entirely in your browser — your database never
      leaves your computer.
    </div>
    <button id="skip" class="secondary" @click="$router.push('/workspace')">
      Create empty database
    </button>
    <div id="attribution">
      Built on
      <a href="https://sqliteviz.com" target="_blank" rel="noopener">sqliteviz</a>
      (open source) · A
      <a href="https://www.lukebarousse.com" target="_blank" rel="noopener"
        >Luke Barousse</a
      >
      course tool
    </div>
  </div>
</template>

<script>
import DbUploader from '@/components/DbUploader'

export default {
  name: 'Welcome',
  components: { DbUploader }
}
</script>

<style scoped>
#dbloader-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#note {
  margin-top: 27px;
  font-size: 13px;
  color: var(--color-text-base);
}

#skip {
  margin-top: 42px;
}

#attribution {
  margin-top: 28px;
  font-size: 12px;
  color: var(--color-text-light-2);
}
#attribution a {
  color: var(--color-accent);
  text-decoration: none;
}
#attribution a:hover {
  text-decoration: underline;
}

:deep(.drop-area) {
  width: 706px;
  height: 482px;
  padding: 0 150px;
  position: relative;
}

:deep(.drop-area .text) {
  position: absolute;
  bottom: 42px;
  max-width: 300px;
}
</style>
