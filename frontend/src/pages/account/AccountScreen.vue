<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Account</template>
      <template #subtitle>Manage your profile and settings</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Profile</div>
      <p class="text-secondary">Edit personal info, saved places</p>
    </div>
    <div class="card">
      <div class="section-title">Payments</div>
      <p class="text-secondary">Cards and e-wallets</p>
    </div>
    <div class="card">
      <div class="section-title">Drive with us</div>
      <p class="text-secondary">Apply as an EV taxi driver</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
