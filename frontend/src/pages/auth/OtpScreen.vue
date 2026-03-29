<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Verify OTP</template>
      <template #subtitle>We sent a 6-digit code to your phone</template>
    </AppHeader>
    <div class="otp-row">
      <input class="input" placeholder="0" maxlength="1" />
      <input class="input" placeholder="0" maxlength="1" />
      <input class="input" placeholder="0" maxlength="1" />
      <input class="input" placeholder="0" maxlength="1" />
      <input class="input" placeholder="0" maxlength="1" />
      <input class="input" placeholder="0" maxlength="1" />
    </div>
    <button class="button button-primary">Verify</button>
    <p class="text-secondary">Resend in 00:45</p>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>

<style scoped>
.otp-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-2);
}
.otp-row .input { text-align: center; }
</style>
