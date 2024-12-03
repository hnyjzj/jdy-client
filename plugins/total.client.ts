import Toast from '~/components/common/toast/toasts'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: new Toast(),
    },
  }
})
