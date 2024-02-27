<template>
  <label
    :for="uid"
    class="label">
    <slot name="label">{{ inputProps?.name || 'Number' }}</slot></label>
  <input
    v-bind="inputProps"
    :id="uid"
    ref="input"
    class="value"
    type="number"
    :min="min"
    :max="max"
    @keydown.up.prevent="stepUp"
    @keydown.down.prevent="stepDown"
    :value="modelValue"
    @input="emitValue"/>
  <span class="unit"><slot name="unit"></slot></span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NumberInput',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    altStep: {
      type: Number
    },
    uid: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    inputProps: {
      type: Object
    }
  },
  methods: {
    stepUp ($event: KeyboardEvent) {
      const step = this.altStep && $event.getModifierState('Alt') ? this.altStep : this.step
      this.inputElement.stepUp(step)
      this.emitValue()
    },
    stepDown ($event: KeyboardEvent) {
      const step = this.altStep && $event.getModifierState('Alt') ? this.altStep : this.step
      this.inputElement.stepDown(step)
      this.emitValue()
    },
    emitValue () {
      this.$emit('update:modelValue', parseInt(this.inputElement.value))
    }
  },
  computed: {
    inputElement () {
      return this.$refs.input as HTMLInputElement
    }
  }
})
</script>

<style>
</style>
