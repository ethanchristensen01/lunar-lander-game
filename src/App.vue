<template>
  <header>
    <hgroup>
      <h1>
        Lunar Lander
      </h1>
      <h2>
        Game Dev Assignment 3
      </h2>
    </hgroup>
  </header>
  <main>
    <GameContainer />
  </main>
  <footer>
    <p>Ethan Christensen</p>
    <p>USU 2024 - CS5410</p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameContainer from './vue-components/GameContainer.vue'

export default defineComponent({
  name: 'app',
  components: {
    GameContainer
  }
})
</script>
