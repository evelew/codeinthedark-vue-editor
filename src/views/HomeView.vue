<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import CodeMirror from 'vue-codemirror6'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/view'
import { Compartment } from '@codemirror/state'
import { html } from '@codemirror/lang-html'
import { syntaxHighlighting } from '@codemirror/language'
import { classHighlighter, tagHighlighter, tags } from '@lezer/highlight'

import { useContentStore } from '@/store/contentStore'

import Button from '@/components/Button.vue'
import Instructions from '@/components/Instructions.vue'

import useEditor from './useEditor'

const STORAGE_NAME_KEY = 'name'

const router = useRouter()
const contentStore = useContentStore()

const cm = ref()
const canvas = ref()
const code = ref(null)
const isInstructionsVisible = ref(false)
const isReferenceFocused = ref(false)

const {
  comboCount,
  currentExclamations,
  theme,
  editorMargin,
  name,
  isComboBarAnimated,
  isOnPowerMode,
  drawParticles,
  loadContent,
  onEditorChange,
  setupCanvas,
  onType
} = useEditor({ cm, code, canvas })

const lang = new Compartment().of(html())
const extensions = [
  lineNumbers(),
  highlightActiveLineGutter(),
  syntaxHighlighting(classHighlighter),
  syntaxHighlighting(
    tagHighlighter([
      {
        tag: tags.angleBracket,
        class: 'tok-angle-bracket'
      },
      {
        tag: tags.name,
        class: 'tok-name'
      },
      {
        tag: tags.tagName,
        class: 'tok-tag-name'
      },
      {
        tag: tags.className,
        class: 'tok-class-name'
      },
      {
        tag: tags.attributeName,
        class: 'tok-attribute-name'
      }
    ])
  )
]

const focusOnReference = () => {
  isReferenceFocused.value = true
  isInstructionsVisible.value = false
}

const showInstructions = () => {
  isInstructionsVisible.value = true
  isReferenceFocused.value = false
}

const closeInstructions = () => {
  isInstructionsVisible.value = false
  isReferenceFocused.value = false
}

const finish = () => {
  const res = prompt(
    'This will show the results of your code. Doing this before the round is over WILL DISQUALIFY YOU. Are you sure you want to proceed? Type "yes" to confirm.'
  )

  if (res?.toLowerCase() === 'yes') {
    contentStore.setFinalCode(code.value)
    router.push({ name: 'result' })
  }
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

const onFrame = () => {
  drawParticles()
  window.requestAnimationFrame?.(onFrame)
}

const init = () => {
  loadContent()
  getName()
  setupCanvas()
}

onMounted(() => {
  init()
  window.requestAnimationFrame?.(onFrame)
})
</script>

<template>
  <section
    class="editor"
    :class="{ 'editor--power-mode': isOnPowerMode }"
    @click="closeInstructions"
  >
    <canvas ref="canvas" class="editor-canvas" />

    <p v-if="isOnPowerMode" class="power-mode-title">POWER MODE!</p>

    <div class="combo">
      <p class="combo-title">Combo</p>
      <p class="combo-number">{{ comboCount }}</p>
      <span
        v-if="comboCount > 0"
        class="combo-bar"
        :class="{
          'combo-bar--animation': isComboBarAnimated
        }"
      />
      <div class="combo-exclamations">
        <p v-for="item in currentExclamations" :key="item" class="combo-exclamations__item">
          {{ item }}
        </p>
      </div>
    </div>

    <CodeMirror
      ref="cm"
      v-model="code"
      :theme="theme"
      :style="editorMargin"
      :extensions="extensions"
      :lang="lang"
      minimal
      tab
      @keydown="onType"
      @change="onEditorChange"
    />

    <div class="name">
      <Button class="name-button" size="large" @click="getName(true)">{{ name }}</Button>
    </div>

    <img v-if="isReferenceFocused" class="reference-image" src="@/assets/challenge/page.jpg" />

    <div class="right-bottom">
      <button v-if="!isReferenceFocused" class="reference" @click="focusOnReference" @click.stop>
        <p>Reference</p>
        <img src="@/assets/challenge/page.jpg" />
      </button>

      <div class="buttons">
        <Button size="small" @click="showInstructions" @click.stop>Instructions</Button>
        <Button size="small" @click="finish">Finish</Button>
      </div>
    </div>

    <Instructions v-if="isInstructionsVisible" @click.stop />
  </section>
</template>

<style lang="scss" scoped>
@keyframes exclamation {
  100% {
    opacity: 0;
    transform: translate3D(0, 100px, 0);
  }
}

@keyframes background-power {
  0% {
    animation-timing-function: ease-out;
  }

  50% {
    transform: scale(1.2);
    animation-timing-function: ease-in;
  }
}

.editor {
  overflow: hidden;

  &.editor--power-mode {
    .combo-number {
      color: #00ddff;
    }

    .combo-bar {
      background-color: #00ddff;
    }

    :deep(.cm-content) {
      &:after {
        animation: background-power 2s infinite both;
        background-image: url('@/assets/editor/logo-power.png');
      }
    }
  }

  &-canvas {
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    z-index: 1;
  }

  .power-mode-title {
    color: #0df0df;
    font-family: 'Press Start 2P';
    font-size: 40px;
    left: 50%;
    pointer-events: none;
    position: absolute;
    transform: translateX(-50%);
    top: 20px;
    z-index: 2;
  }

  .combo {
    color: #ffffff;
    font-family: 'Press Start 2P';
    right: 20px;
    position: absolute;
    text-align: center;
    top: 20px;
    z-index: 2;

    &-title {
      text-align: right;
    }

    &-number {
      color: #4effa1;
      font-size: 80px;
      margin-top: 30px;
    }

    &-bar {
      background-color: #4effa1;
      display: block;
      height: 8px;
      margin-top: 23px;
      opacity: 0.5;
      position: relative;
      transform: scaleX(1);
      width: 100%;

      &--animation {
        transform: scaleX(0);
        transition: all 10000ms linear;
      }
    }

    &-exclamations {
      margin-top: 10px;
      position: absolute;
      bottom: -20px;
      right: 0;
      display: block;
      opacity: 0.75;
      font-size: 20px;
      text-align: right;
      min-width: 200px;

      &__item {
        color: #00ddff;
        right: 0;
        top: 0;
        display: block;
        position: absolute;
        animation: exclamation 1.5s ease-out both;
      }
    }
  }

  .name {
    &-button {
      bottom: 20px;
      left: 20px;
      position: absolute;
    }
  }

  .reference-image {
    left: 50%;
    position: fixed;
    transform: translate(-50%, -50%);
    top: 50%;
    width: 800px;
    z-index: 5;
  }

  .right-bottom {
    bottom: 20px;
    position: absolute;
    right: 20px;

    .reference {
      align-items: flex-end;
      display: flex;
      flex-flow: column;
      width: 100%;

      p {
        color: #ffffff;
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
    caret-color: #ffffff !important;

    &:after {
      background-image: url('@/assets/editor/logo.png');
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: 520px 476px;
      content: '';
      display: block;
      left: 0;
      height: 100vh;
      position: fixed;
      top: 0;
      width: 100%;
      will-change: transform;
      z-index: -1;
    }
  }

  :deep(.cm-editor) {
    background-color: #000000;
  }

  :deep(.cm-cursor) {
    background-color: #ffffff;
    display: block !important;
    width: 3px;
  }
}
</style>
