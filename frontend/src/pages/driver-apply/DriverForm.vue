<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Application</template>
      <template #subtitle>Step 1 of 4 · Personal info</template>
    </AppHeader>
    <input class="input" placeholder="Full name" />
    <input class="input" placeholder="Mobile number" />
    <input class="input" placeholder="Address" />
    <button class="button button-primary">Next</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
