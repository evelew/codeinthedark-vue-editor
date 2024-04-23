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

const STORAGE_NAME_KEY = 'name'

const router = useRouter()
const contentStore = useContentStore()

const code = ref(null)
const name = ref(null)
const isInstructionsVisible = ref(false)
const isReferenceFocused = ref(false)

const lang = new Compartment().of(html({}))
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
        class: 'tok-atribute-name'
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

  if (res.toLowerCase() === 'yes') {
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

onMounted(() => {
  getName()
})
</script>

<template>
  <section class="editor" @click="closeInstructions">
    <div class="combo">
      <p>Combo</p>
      <p class="combo-number">0</p>
    </div>

    <CodeMirror v-model="code" :extensions="extensions" :lang="lang" minimal tab />

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
.editor {
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

  .reference-image {
    left: 50%;
    position: fixed;
    transform: translate(-50%, -50%);
    top: 50%;
    width: 800px;
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
