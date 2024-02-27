<template>
  <canvas ref="canvas" :width="resolution.width" :height="resolution.height" tabindex="1">
    <noscript>Sorry, this game requires JavaScript to run</noscript>
  </canvas>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'GameCanvas',
  props: {
    resolution: {
      type: Object as PropType<{width: number, height: number}>,
      default: { width: 600, height: 400 }
    }
  },
  computed: {
    canvas() {
      return this.$refs.canvas as HTMLCanvasElement
    }
  }
})
</script>
