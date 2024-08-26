<script lang="ts" setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <el-config-provider>
    <header>
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

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
  padding: 20px;
}
</style>