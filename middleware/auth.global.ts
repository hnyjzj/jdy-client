export default defineNuxtRouteMiddleware((to, form) => {
  if (!to.path.startsWith('/login')) {
    const { token, expires_at } = storeToRefs(useAuth())
    const expirationTime = computed(() => expires_at.value * 1000)
    if (!token.value || Date.now() > expirationTime.value) {
      const params = {
        path: '/login',
        query: {},
      }
      if (form.fullPath && form.fullPath !== '/login') {
        params.query = {
          redirect_url: form.fullPath || '/',
        }
      }
      return navigateTo(params)
    }
  }
})
