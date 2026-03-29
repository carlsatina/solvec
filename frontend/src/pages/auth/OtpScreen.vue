<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Verify OTP</template>
      <template #subtitle>We sent a 6-digit code to your phone</template>
    </AppHeader>
    <div class="otp-row">
      <input v-for="i in 6" :key="i" v-model="digits[i - 1]" class="input" maxlength="1" />
    </div>
    <button class="button button-primary" :disabled="auth.loading" @click="handleVerify">Verify</button>
    <p class="text-secondary">Resend in 00:45</p>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useAuthStore } from '../../store/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const digits = ref<string[]>(['', '', '', '', '', ''])

async function handleVerify() {
  const phone = String(route.query.phone ?? '')
  const code = digits.value.join('')
  if (!phone || code.length !== 6) return
  await auth.verifyOtp(phone, code)
  router.push('/home')
}
</script>

<style scoped>
.otp-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-2);
}
.otp-row .input { text-align: center; }
</style>
