<template>
  <div v-if="!isNative" class="map-frame">
    <div class="map-pin"></div>
    <div class="map-label">Google Maps (native) not available on web</div>
  </div>
  <capacitor-google-map v-else ref="mapRef" class="native-map"></capacitor-google-map>
</template>

<script setup lang="ts">
import type { Marker, Polyline } from '@capacitor/google-maps'
import { GoogleMap, LatLngBounds } from '@capacitor/google-maps'
import { Capacitor } from '@capacitor/core'
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    mapId?: string
    center: { lat: number; lng: number }
    zoom?: number
    markers?: Array<{ lat: number; lng: number; title?: string }>
    path?: Array<{ lat: number; lng: number }>
  }>(),
  {
    mapId: 'solvec-map',
    zoom: 14,
    markers: () => [],
    path: () => []
  }
)

const isNative = computed(() => Capacitor.isNativePlatform())
const mapRef = shallowRef<HTMLElement>()
const map = shallowRef<GoogleMap>()
const markerIds = shallowRef<string[]>([])
const polylineIds = shallowRef<string[]>([])

async function createMap() {
  if (!isNative.value) return
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if (!mapRef.value) return

  try {
    map.value = await GoogleMap.create({
      id: props.mapId,
      element: mapRef.value,
      ...(apiKey ? { apiKey } : {}),
      config: {
        center: props.center,
        zoom: props.zoom
      }
    })
    await syncOverlays()
    await moveCameraToData()
    console.log('[NativeMap] created', { mapId: props.mapId, hasApiKey: Boolean(apiKey) })
  } catch (error) {
    console.error('[NativeMap] create failed', error)
  }
}

async function syncOverlays() {
  if (!map.value) return

  if (markerIds.value.length) {
    await map.value.removeMarkers(markerIds.value)
    markerIds.value = []
  }

  if (polylineIds.value.length) {
    await map.value.removePolylines(polylineIds.value)
    polylineIds.value = []
  }

  if (props.markers.length) {
    const markers: Marker[] = props.markers.map((item) => ({
      coordinate: { lat: item.lat, lng: item.lng },
      title: item.title
    }))
    markerIds.value = await map.value.addMarkers(markers)
  }

  if (props.path.length > 1) {
    const polylines: Polyline[] = [
      {
        path: props.path,
        strokeColor: '#21c7c7',
        strokeOpacity: 1,
        strokeWeight: 6
      }
    ]
    polylineIds.value = await map.value.addPolylines(polylines)
  }
}

async function moveCameraToData() {
  if (!map.value) return

  const points = [...props.markers.map((m) => ({ lat: m.lat, lng: m.lng })), ...props.path]
  if (points.length < 2) {
    await map.value.setCamera({
      coordinate: props.center,
      zoom: props.zoom
    })
    return
  }

  const lats = points.map((p) => p.lat)
  const lngs = points.map((p) => p.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const bounds = new LatLngBounds({
    southwest: { lat: minLat, lng: minLng },
    center: { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 },
    northeast: { lat: maxLat, lng: maxLng }
  })

  await map.value.fitBounds(bounds, 90)
}

onMounted(createMap)

watch(
  () => [props.center.lat, props.center.lng, props.zoom, isNative.value, props.path, props.markers],
  async () => {
    if (!map.value) return
    await syncOverlays()
    await moveCameraToData()
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

.map-frame {
  flex: 1;
  background: radial-gradient(circle at 30% 20%, #eaf5f0 0%, #d7ebe3 40%, #c8e1d6 100%);
  border-radius: var(--radius-card);
  min-height: 280px;
  position: relative;
  overflow: hidden;
}

.map-pin {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 0 6px rgba(31, 122, 92, 0.2);
}

.map-label {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 10px;
  border-radius: 10px;
  font-size: var(--text-secondary);
  color: var(--color-text-secondary);
}
</style>
