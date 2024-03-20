<template>
  <GameCanvas ref="gameCanvas" :resolution="{width: 500, height: 500}"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameCanvas from './GameCanvas.vue'
import { CanvasPlus } from '@/game-lib/CanvasPlus'
import { GameMain } from '@/game/game'

export default defineComponent({
    name: 'GameContainer',
    components: { GameCanvas },
    computed: {
      canvas() {
        return (this.$refs.gameCanvas as InstanceType<typeof GameCanvas>).canvas
      }
    },
    async mounted () {
      const canvasPlus = new CanvasPlus(this.canvas)
      const game = new GameMain(canvasPlus)
      await game.loadContent()
      game.loop(performance.now())
    },
})
</script>
