import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/store/contentStore'

const STORAGE_NAME_KEY = 'name'

const useInteractions = ({ code }) => {
  const contentStore = useContentStore()
  const router = useRouter()

  const name = ref(null)
  const isReferenceFocused = ref(false)
  const isInstructionsVisible = ref(false)

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

  return {
    name,
    isReferenceFocused,
    isInstructionsVisible,

    focusOnReference,
    showInstructions,
    closeInstructions,
    finish,
    getName
  }
}

export default useInteractions
