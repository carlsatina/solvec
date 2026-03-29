<template>
  <capacitor-google-map ref="mapRef" class="native-map"></capacitor-google-map>
</template>

<script setup lang="ts">
import { GoogleMap } from '@capacitor/google-maps'
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    mapId?: string
    center: { lat: number; lng: number }
    zoom?: number
  }>(),
  {
    mapId: 'solvec-map',
    zoom: 14
  }
)

const mapRef = shallowRef<HTMLElement>()
const map = shallowRef<GoogleMap>()

async function createMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if (!mapRef.value || !apiKey) return

  map.value = await GoogleMap.create({
    id: props.mapId,
    element: mapRef.value,
    apiKey,
    config: {
      center: props.center,
      zoom: props.zoom
    }
  })
}

onMounted(createMap)

watch(
  () => [props.center.lat, props.center.lng, props.zoom],
  async () => {
    if (!map.value) return
    await map.value.setCamera({
      coordinate: props.center,
      zoom: props.zoom
    })
  }
)

onBeforeUnmount(async () => {
  if (map.value) {
    await map.value.destroy()
  }
})
</script>

<style scoped>
.native-map {
  display: inline-block;
  width: 100%;
  height: 100%;
  min-height: 280px;
  border-radius: var(--radius-card);
  overflow: hidden;
}
</style>
