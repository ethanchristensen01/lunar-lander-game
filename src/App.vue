<template>
  <header>
    <hgroup>
      <h1>
        Lunar Lander
      </h1>
      <h2>
        Assignment 3
      </h2>
    </hgroup>
  </header>
  <main>
    <GameContainer />
  </main>
  <footer>
    <p>Ethan Christensen</p>
    <p>CS 5410 - Again!</p>
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
