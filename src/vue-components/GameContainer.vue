<template>
  <GameCanvas ref="gameCanvas" :resolution="{width: 500, height: 500}"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameCanvas from './GameCanvas.vue'
import { CanvasPlus } from '@/game-lib/canvas/CanvasPlus'

export default defineComponent({
    name: 'GameContainer',
    components: { GameCanvas },
    computed: {
      canvas() {
        return (this.$refs.gameCanvas as InstanceType<typeof GameCanvas>).canvas
      }
    },
    mounted () {
      const demo = new CanvasPlus(this.canvas)
      demo.demo()
    },
})
</script>
