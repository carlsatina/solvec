<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Create account</template>
      <template #subtitle>Start booking in minutes</template>
    </AppHeader>
    <input class="input" placeholder="Full name" />
    <input class="input" placeholder="+63 Mobile number" />
    <input class="input" placeholder="Email (optional)" />
    <input class="input" placeholder="Create password" type="password" />
    <button class="button button-primary">Create account</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
