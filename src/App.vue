<script lang="ts" setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <el-config-provider>
    <header class="sticky-header">
      <BaseHeader />
    </header>
    <main class="flex main-container">
      <RouterView />
    </main>
  </el-config-provider>
</template>

<style>
#app {
  color: var(--ep-text-color-primary);
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
  padding: 20px;
}
</style>