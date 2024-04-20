<script setup>
const props = defineProps({
  size: {
    type: String,
    validator: (v) => ['small', 'large'].includes(v)
  }
})
</script>

<template>
  <button class="button" :class="props.size">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.button {
  background-color: rgba(58, 147, 100, 0.75);
  color: #ffffff;
  font-family: 'Press Start 2P';

  &.large {
    font-size: 56px;
    padding: 20px;
  }

  &.small {
    font-size: 12px;
    padding: 10px 15px;
  }

  &:hover {
    opacity: 0.8;
  }
}
</style>
