<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Choose ride</template>
      <template #subtitle>Electric taxis with clean air comfort</template>
    </AppHeader>
    <div class="card option">
      <div>
        <div class="section-title">Eco</div>
        <p class="text-secondary">4 seats · PHP 240 est.</p>
      </div>
      <span class="chip">Best value</span>
    </div>
    <div class="card option">
      <div>
        <div class="section-title">Comfort</div>
        <p class="text-secondary">4 seats · PHP 320 est.</p>
      </div>
      <span class="chip">Quiet ride</span>
    </div>
    <div class="card option">
      <div>
        <div class="section-title">XL</div>
        <p class="text-secondary">6 seats · PHP 420 est.</p>
      </div>
      <span class="chip">Group travel</span>
    </div>
    <button class="button button-primary">Continue</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>

<style scoped>
.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
