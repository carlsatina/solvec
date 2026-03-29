<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Application</template>
      <template #subtitle>Step 1 of 4 · Personal info</template>
    </AppHeader>
    <ProgressStepper :steps="steps" :current="1" />
    <input class="input" placeholder="Full name" />
    <input class="input" placeholder="+63 Mobile number" />
    <input class="input" placeholder="Email (optional)" />
    <input class="input" placeholder="Home address" />
    <button class="button button-primary">Next</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import ProgressStepper from '../../components/ProgressStepper.vue'

const steps = ['Info', 'Docs', 'Schedule', 'Review']
</script>
