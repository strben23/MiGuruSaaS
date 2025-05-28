<script setup lang="ts">

import { ref, onMounted, watch } from 'vue'
import { useYouTube } from '~/composables/useYoutube'

const props = defineProps<{ videoId: string }>()
const videoContainer = ref<HTMLDivElement | null>(null)
const player = ref<YT.Player | null>(null)

const initPlayer = async (id: string) => {
  const YT = await useYouTube()

  if (!videoContainer.value) return

  player.value = new YT.Player(videoContainer.value, {
    videoId: id
  })
}

onMounted(() => {
  initPlayer(props.videoId)
})

// If the videoId changes, load the new video
watch(() => props.videoId, (newId) => {
  if (player.value && newId) {
    player.value.loadVideoById(newId)
  }
})

const play = () => {
  player.value?.playVideo()
}
</script>

<template>
  <div>
    <div ref="videoContainer" />
  </div>
</template>
