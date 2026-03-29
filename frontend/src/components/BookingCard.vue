<template>
  <div class="card booking-card">
    <div class="pickup">
      <span class="chip">Pickup</span>
      <input class="input" placeholder="Enter pickup location" />
    </div>
    <div class="dropoff">
      <span class="chip">Drop-off</span>
      <input class="input" placeholder="Where to?" />
    </div>
    <div class="actions">
      <button class="button button-secondary">Schedule</button>
      <button class="button button-primary">Book now</button>
    </div>
  </div>
</template>

<style scoped>
.booking-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
</style>
