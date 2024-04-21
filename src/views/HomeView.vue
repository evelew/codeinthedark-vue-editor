<script setup>
import { onMounted, ref } from 'vue'
import CodeMirror from 'vue-codemirror6'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/view'
import { Compartment } from '@codemirror/state'
import { html } from '@codemirror/lang-html'

import Button from '@/components/Button.vue'
import Instructions from '@/components/Instructions.vue'

const STORAGE_NAME_KEY = 'name'

const name = ref(null)
const isInstructionsVisible = ref(false)

const lang = new Compartment().of(html({ autoCloseTags: false }))
const setup = [lineNumbers(), highlightActiveLineGutter()]

const showInstructions = () => {
  isInstructionsVisible.value = true
}

const closeInstructions = () => {
  isInstructionsVisible.value = false
}

const getName = (forceNewName = false) => {
  const localStorageName = localStorage.getItem(STORAGE_NAME_KEY)
  if (localStorageName && !forceNewName) {
    name.value = localStorageName
    return
  }

  const userName = prompt("what's your name?")
  localStorage.setItem(STORAGE_NAME_KEY, userName)
  name.value = userName
}

onMounted(() => {
  getName()
})
</script>

<template>
  <div class="editor" @click="closeInstructions">
    <div class="combo">
      <p>Combo</p>
      <p class="combo-number">0</p>
    </div>

    <CodeMirror :extensions="setup" :lang="lang" value="jdaiajdsia aisjdidasj" />

    <div class="name">
      <Button class="name-button" size="large" @click="getName(true)">{{ name }}</Button>
    </div>

    <div class="right-bottom">
      <div class="reference">
        <p>Reference</p>
        <img src="@/assets/challenge/page.jpg" />
      </div>

      <div class="buttons">
        <Button size="small" @click="showInstructions" @click.stop>Instructions</Button>
        <Button size="small">Finish</Button>
      </div>
    </div>

    <Instructions v-if="isInstructionsVisible" @click.stop />
  </div>
</template>

<style lang="scss" scoped>
.editor {
  background-color: #000000;

  .combo {
    color: #ffffff;
    font-family: 'Press Start 2P';
    right: 20px;
    position: fixed;
    text-align: center;
    top: 20px;

    &-number {
      color: #4effa1;
      font-size: 80px;
      margin-top: 30px;
    }
  }

  .name {
    &-button {
      bottom: 20px;
      left: 20px;
      position: absolute;
    }
  }

  .right-bottom {
    bottom: 20px;
    position: absolute;
    right: 20px;

    .reference {
      align-items: flex-end;
      display: flex;
      flex-flow: column;

      p {
        font-family: 'Press Start 2P';
        font-size: 12px;
        margin-bottom: 15px;
        text-align: right;
      }

      img {
        width: 200px;
      }
    }

    .buttons {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
  }

  :deep(.cm-editor) {
    font-size: 20px;
    height: 100vh;
  }

  :deep(.cm-gutters) {
    background-color: #000000;
    border: none;
    color: #bebebe;
  }

  :deep(.cm-gutterElement) {
    padding: 0px 12px 0 18px;
  }

  :deep(.cm-activeLineGutter) {
    background-color: #1a1a1a;
  }

  :deep(.cm-content) {
    color: #ffffff;
    caret-color: #fff;
  }
}
</style>
