<template>
  <div class="app-screen home">
    <AppHeader>
      <template #title>Hello, RC Satina</template>
      <template #subtitle>Ready for a clean ride today?</template>
      <template #action>
        <button class="points-pill" type="button">
          <span class="points-icon">✓</span>
          <span class="points-value">15</span>
        </button>
      </template>
    </AppHeader>

    <div class="search-card">
      <button class="search-field" type="button" @click="goDropoff">
        <span class="pin-icon" aria-hidden="true"></span>
        <span class="search-text">Where to?</span>
      </button>
      <button class="schedule-pill" type="button" @click="goSchedule">
        <span class="calendar-icon" aria-hidden="true"></span>
        Schedule
      </button>
    </div>

    <div class="quick-row">
      <button class="quick-item" type="button" @click="goDropoff">
        <span class="quick-icon quick-icon-car" aria-hidden="true">
          <svg viewBox="0 0 64 64" class="icon-svg" aria-hidden="true">
            <rect x="12" y="28" width="40" height="16" rx="6" />
            <rect x="20" y="20" width="24" height="12" rx="6" />
            <circle cx="22" cy="46" r="6" />
            <circle cx="42" cy="46" r="6" />
          </svg>
        </span>
        <span>Car</span>
      </button>
      <button class="quick-item" type="button" @click="goRewards">
        <span class="quick-icon quick-icon-subs" aria-hidden="true">
          <svg viewBox="0 0 64 64" class="icon-svg" aria-hidden="true">
            <circle cx="32" cy="32" r="20" />
            <path d="M32 18l4.2 8.4 9.2 1.4-6.7 6.5 1.6 9.1L32 39l-8.3 4.4 1.6-9.1-6.7-6.5 9.2-1.4z" />
          </svg>
        </span>
        <span>Subscription</span>
      </button>
    </div>

    <section class="promo-section">
      <div class="carousel" aria-label="Promotions">
        <article class="promo-card promo-eco">
          <div class="promo-copy">
            <p class="promo-kicker">GOOD for the ENVIRONMENT</p>
            <h3>Eco-Friendly Choice</h3>
            <p>No smell, no smoke, no noise. Drive 100% electric.</p>
            <button class="promo-button" type="button">Book now</button>
          </div>
          <div class="promo-visual"></div>
        </article>
        <article class="promo-card promo-savings">
          <div class="promo-copy">
            <p class="promo-kicker">SAVE MORE, RIDE MORE</p>
            <h3>Membership Perks</h3>
            <p>Enjoy lower fares, priority booking, and free charging.</p>
            <button class="promo-button" type="button">Learn more</button>
          </div>
          <div class="promo-visual"></div>
        </article>
        <article class="promo-card promo-driver">
          <div class="promo-copy">
            <p class="promo-kicker">DRIVE WITH US</p>
            <h3>Earn Big, Drive Clean</h3>
            <p>Up to 90% commission sharing and daily cash-outs.</p>
            <button class="promo-button" type="button">Apply now</button>
          </div>
          <div class="promo-visual"></div>
        </article>
      </div>
      <div class="carousel-dots" aria-hidden="true">
        <span class="dot"></span>
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </section>

    <div class="section-header">Featured</div>
    <div class="featured-grid">
      <article class="featured-card">
        <div class="featured-media featured-launch"></div>
        <div class="featured-title">Green GSM Car Launch</div>
      </article>
      <article class="featured-card">
        <div class="featured-media featured-drive"></div>
        <div class="featured-title">Want to Drive Your Own EV?</div>
      </article>
      <article class="featured-card">
        <div class="featured-media featured-care"></div>
        <div class="featured-title">Eco Care for Every Trip</div>
      </article>
      <article class="featured-card">
        <div class="featured-media featured-city"></div>
        <div class="featured-title">Explore the City Clean</div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppHeader from '../../components/AppHeader.vue'

const router = useRouter()

function goDropoff() {
  router.push('/booking/destination')
}

function goSchedule() {
  router.push('/booking/ride-options')
}

function goRewards() {
  router.push('/rewards')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700&display=swap');

.home {
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  font-family: 'Manrope', var(--font-family);
}

.search-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 2px solid #37c6c5;
  border-radius: 28px;
  background: #f7fffe;
  box-shadow: 0 10px 24px rgba(9, 86, 88, 0.08);
}

.search-field {
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  border: none;
  background: transparent;
  text-align: left;
  font-size: 18px;
  font-weight: 600;
  color: #1b1f1e;
  cursor: pointer;
}

.search-text { color: #1b1f1e; }

.pin-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffd36b 0%, #f4a601 70%);
  position: relative;
  box-shadow: 0 8px 16px rgba(244, 166, 1, 0.25);
}

.pin-icon::after {
  content: '';
  position: absolute;
  inset: 9px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #fff;
  opacity: 0.5;
}

.schedule-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 10px 16px;
  border-radius: 999px;
  border: none;
  background: #e8fbf9;
  color: #0c5f60;
  font-weight: 700;
  cursor: pointer;
}

.calendar-icon {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 2px solid #0c5f60;
  position: relative;
}

.calendar-icon::before,
.calendar-icon::after {
  content: '';
  position: absolute;
  background: #0c5f60;
}

.calendar-icon::before {
  top: -4px;
  left: 4px;
  right: 4px;
  height: 4px;
  border-radius: 4px;
}

.calendar-icon::after {
  top: 6px;
  left: 5px;
  right: 5px;
  height: 2px;
}

.points-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  background: #e8fbf9;
  font-weight: 700;
  color: #0c5f60;
}

.points-icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #38c6c5 0%, #5fe7d4 100%);
  color: #fff;
  font-size: 14px;
}

.quick-row {
  display: flex;
  gap: var(--space-5);
  justify-content: flex-start;
}

.quick-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  border: none;
  background: transparent;
  font-weight: 600;
  color: #1b1f1e;
}

.quick-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 20px rgba(20, 89, 88, 0.16);
}

.icon-svg {
  width: 36px;
  height: 36px;
  fill: #ffffff;
}

.quick-icon-car {
  background: linear-gradient(135deg, #66e0d1 0%, #34b7b1 100%);
}

.quick-icon-subs {
  background: linear-gradient(135deg, #ffe08c 0%, #f2b705 100%);
}

.promo-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.carousel {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 88%;
  gap: var(--space-4);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 6px;
}

.carousel::-webkit-scrollbar { display: none; }

.promo-card {
  scroll-snap-align: center;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: var(--space-4);
  border-radius: 20px;
  padding: var(--space-5);
  color: #0b3f3b;
  position: relative;
  overflow: hidden;
}

.promo-eco {
  background: linear-gradient(135deg, #c8f08e 0%, #b7e96c 35%, #8edbd2 100%);
}

.promo-savings {
  background: linear-gradient(135deg, #8ddaf7 0%, #52b7ff 45%, #1f5ea8 100%);
  color: #f4fbff;
}

.promo-driver {
  background: linear-gradient(135deg, #2b5fb9 0%, #12336f 100%);
  color: #f7f9ff;
}

.promo-copy {
  max-width: 60%;
  z-index: 1;
}

.promo-copy h3 {
  margin: 6px 0 6px;
  font-size: 20px;
}

.promo-copy p {
  margin: 0 0 12px;
  font-size: 14px;
}

.promo-kicker {
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.04em;
}

.promo-button {
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 700;
  background: #ff6b9d;
  color: #fff;
}

.promo-savings .promo-button {
  background: #0c2957;
}

.promo-driver .promo-button {
  background: #ffb703;
  color: #1b1f1e;
}

.promo-visual {
  width: 38%;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.35);
  position: relative;
  overflow: hidden;
}

.promo-visual::before {
  content: '';
  position: absolute;
  inset: 16px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #cbdad6;
}

.dot.active {
  width: 18px;
  background: #37c6c5;
}

.section-header {
  font-size: 20px;
  font-weight: 700;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.featured-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.featured-title {
  font-size: 14px;
  font-weight: 600;
}

.featured-media {
  height: 140px;
  border-radius: 18px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 22px rgba(16, 24, 22, 0.12);
}

.featured-launch {
  background-image: linear-gradient(135deg, #5ed4d1 0%, #8ae47d 100%);
}

.featured-drive {
  background-image: linear-gradient(135deg, #1a3b77 0%, #3094e7 70%);
}

.featured-care {
  background-image: linear-gradient(135deg, #8be98b 0%, #45b26b 100%);
}

.featured-city {
  background-image: linear-gradient(135deg, #f7d38f 0%, #f09a5a 100%);
}

.featured-media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0));
}

@media (max-width: 420px) {
  .search-card {
    flex-direction: column;
    align-items: stretch;
  }

  .promo-copy { max-width: 70%; }

  .featured-media { height: 120px; }
}
</style>
