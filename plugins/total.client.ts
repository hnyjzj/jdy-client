import Toast from '~/components/common/toast/toast'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: new Toast(),
    },
  }
})
