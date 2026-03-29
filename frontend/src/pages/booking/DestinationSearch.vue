<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Drop-off destination</template>
      <template #subtitle>Search by address or landmark</template>
    </AppHeader>
    <input class="input" placeholder="Where to?" />
    <div class="card">
      <div class="section-title">Recent trips</div>
      <ul class="list">
        <li>NAIA Terminal 3</li>
        <li>UP Town Center</li>
        <li>Rockwell Center</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>

<style scoped>
.list { margin: 0; padding-left: 18px; color: var(--color-text-secondary); }
</style>
