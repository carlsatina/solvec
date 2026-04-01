<template>
  <div class="app-screen splash">
    <div class="logo">Solvec EV Taxi</div>
    <div class="loader"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { api } from '../../services/api'

const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  // Show the splash for at least 1.5 s so it doesn't flash
  const minDelay = new Promise((resolve) => setTimeout(resolve, 1500))

  const token = localStorage.getItem('auth_token')
  let destination = '/auth/welcome'

  if (token) {
    try {
      const me = await api.me()
      auth.$patch({ token, user: me })
      destination = '/home'
    } catch {
      // Token is expired or invalid — clear it and send to welcome
      localStorage.removeItem('auth_token')
      auth.$patch({ token: null, user: null })
    }
  }

  await minDelay
  router.replace(destination)
})
</script>

<style scoped>
.splash {
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(160deg, #f7fbf9 0%, #e3f2ea 100%);
}
.logo {
  font-size: var(--text-h2);
  font-weight: 600;
}
.loader {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 4px solid #d3e8dd;
  border-top-color: var(--color-primary);
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
