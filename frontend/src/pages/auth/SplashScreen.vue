<template>
  <div class="app-screen splash">
    <div class="logo">Solvec EV Taxi</div>
    <div class="loader"></div>
  </div>
</template>

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
