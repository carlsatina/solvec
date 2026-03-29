<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Welcome back</template>
      <template #subtitle>Sign in with your mobile number</template>
    </AppHeader>
    <input class="input" placeholder="+63 Mobile number" />
    <input class="input" placeholder="Password (optional)" type="password" />
    <button class="button button-primary">Send OTP</button>
    <button class="button button-ghost">Continue with email</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
