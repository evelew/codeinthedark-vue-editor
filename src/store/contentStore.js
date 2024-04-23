import { defineStore } from 'pinia'

export const useContentStore = defineStore('content', {
  state: () => ({ finalCode: null }),
  getters: {
    code: (state) => state.finalCode
  },
  actions: {
    setFinalCode(code) {
      this.finalCode = code
    }
  }
})
