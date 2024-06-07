import { ref, computed } from 'vue'
import debounce from 'lodash/debounce'
import defer from 'lodash/defer'
import throttle from 'lodash/throttle'

import {
  EXCLAMATIONS,
  EXCLAMATION_EVERY,
  MAX_PARTICLES,
  PARTICLE_SIZE,
  PARTICLE_ALPHA_FADEOUT,
  PARTICLE_GRAVITY,
  POWER_MODE_ACTIVATION_THRESHOLD,
  TOKEN_COLOR_MAP
} from '@/constants/editor-animation'

import { syntaxTree } from '@codemirror/language'

const STORAGE_CONTENT_KEY = 'content'

const useEditor = ({ cm, code, canvas }) => {
  const isOnPowerMode = ref(false)
  const isComboBarAnimated = ref(false)

  const canvasContext = ref(null)
  const currentExclamations = ref([])
  const comboCount = ref(0)
  const editorMargin = ref('0px')
  const particles = ref([])

  const theme = computed(() => ({
    '.cm-scroller': {
      margin: editorMargin.value
    }
  }))

  const getRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const shake = () => {
    if (!isOnPowerMode.value) return

    const intensity =
      1 + 2 * Math.random() * Math.floor((comboCount.value - POWER_MODE_ACTIVATION_THRESHOLD) / 100)
    const x = intensity * (Math.random() > 0.5 ? -1 : 1)
    const y = intensity * (Math.random() > 0.5 ? -1 : 1)

    editorMargin.value = `${y}px ${x}px`

    setTimeout(() => {
      editorMargin.value = '0'
    }, 75)
  }

  const saveContent = debounce(() => {
    window.localStorage.setItem(STORAGE_CONTENT_KEY, code.value)
  }, 300)

  const loadContent = () => {
    code.value = window.localStorage.getItem(STORAGE_CONTENT_KEY)
  }

  const setupCanvas = () => {
    canvasContext.value = canvas.value.getContext('2d')
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
  }

  const onType = (event) => {
    saveContent()

    if (event.key === 'Backspace') return
    increaseStreak()
    shake()
  }

  const debouncedResetComboCount = debounce(() => {
    comboCount.value = 0
    isOnPowerMode.value = false
  }, 10000)

  const updateCombo = () => {
    isComboBarAnimated.value = false

    comboCount.value++
    debouncedResetComboCount()

    defer(() => {
      isComboBarAnimated.value = true
    })
  }

  const increaseStreak = () => {
    updateCombo()

    if (comboCount.value > 0 && comboCount.value % EXCLAMATION_EVERY === 0) {
      showExclamation()
    }

    if (comboCount.value >= POWER_MODE_ACTIVATION_THRESHOLD && !isOnPowerMode.value) {
      isOnPowerMode.value = true
    }
  }

  const showExclamation = () => {
    if (!isOnPowerMode.value) return
    currentExclamations.value.push(EXCLAMATIONS[getRandomNumberBetween(0, EXCLAMATIONS.length - 1)])

    setTimeout(() => {
      currentExclamations.value = currentExclamations.value.slice(1)
    }, 1500)
  }

  const spawnParticles = ({ x, y, charColor }) => {
    if (!isOnPowerMode.value) return
    const numParticles = getRandomNumberBetween(5, MAX_PARTICLES)

    for (let i = 0; i <= numParticles; i++) {
      particles.value.push(createParticle({ x, y, charColor }))
    }
  }

  const throttledSpawnParticles = ({ x, y, charColor }) => {
    throttle(
      () => {
        spawnParticles({ x, y, charColor })
      },
      25,
      { trailing: false }
    )()
  }

  const createParticle = ({ x, y, charColor }) => {
    const PARTICLE_VELOCITY_RANGE = {
      x: [-2.5, 2.5],
      y: [-7, -3.5]
    }

    const posX = x
    const posY = y + 10
    const alpha = 1
    const color = charColor || [249, 255, 0]
    const velocity = {
      x:
        PARTICLE_VELOCITY_RANGE.x[0] +
        Math.random() * (PARTICLE_VELOCITY_RANGE.x[1] - PARTICLE_VELOCITY_RANGE.x[0]),
      y:
        PARTICLE_VELOCITY_RANGE.y[0] +
        Math.random() * (PARTICLE_VELOCITY_RANGE.y[1] - PARTICLE_VELOCITY_RANGE.y[0])
    }

    return {
      x: posX,
      y: posY,
      alpha,
      color,
      velocity
    }
  }

  const drawParticles = () => {
    canvasContext.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

    for (let i = 0; i < particles.value.length; i++) {
      const particle = particles.value[i]

      if (!particle.alpha <= 0.1) {
        particle.velocity.y += PARTICLE_GRAVITY
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y
        particle.alpha *= PARTICLE_ALPHA_FADEOUT

        canvasContext.value.fillStyle = `rgba(${particle.color.join(', ')}, ${particle.alpha})`
        canvasContext.value.fillRect(
          Math.round(particle.x - PARTICLE_SIZE / 2),
          Math.round(particle.y - PARTICLE_SIZE / 2),
          PARTICLE_SIZE,
          PARTICLE_SIZE
        )
      }
    }
  }

  const onEditorChange = (value) => {
    if (!isOnPowerMode.value) return

    const currentPosition = value.selection.ranges[0].from - 1

    if (currentPosition < 0) return
    const coords = cm.value.view.coordsAtPos(currentPosition)
    const charToken = syntaxTree(cm.value.view.state).resolve(currentPosition).type.name
    console.log({ charToken })
    defer(() => {
      throttledSpawnParticles({
        x: coords.left,
        y: coords.top,
        charColor: TOKEN_COLOR_MAP[charToken]
      })
    })
  }

  return {
    comboCount,
    currentExclamations,
    editorMargin,
    isComboBarAnimated,
    isOnPowerMode,
    theme,

    loadContent,
    drawParticles,
    onEditorChange,
    onType,
    setupCanvas
  }
}

export default useEditor
