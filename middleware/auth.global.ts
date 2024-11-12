export default defineNuxtRouteMiddleware((to, form) => {
  if (!to.path.startsWith('/login')) {
    const { token, expires_at } = storeToRefs(useAuth())

    if (!token.value || Date.now() > expires_at.value * 1000) {
      const params = {
        path: '/login',
        query: {},
      }
      if (form.fullPath) {
        params.query = {
          redirect_url: form.fullPath || '/',
        }
      }
      return navigateTo(params)
    }
  }
})
