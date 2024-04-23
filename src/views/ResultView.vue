<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useContentStore } from '@/store/contentStore'

const router = useRouter()
const contentStore = useContentStore()

const validateContent = () => {
  if (!contentStore.code) {
    router.push({ name: 'home' })
  }
}

onMounted(() => {
  validateContent()
})
</script>

<template>
  <section>
    <div v-html="contentStore.code" />
  </section>
</template>

<style lang="scss" scoped></style>
