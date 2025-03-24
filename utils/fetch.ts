import type { AsyncData } from '#app'

interface Request<T> {
  code: number
  message: string
  data: T
}
const toLogin = () => {
  const route = useRoute()
  navigateTo({
    path: '/login/loading',
    query: {
      redirect_url: encodeURIComponent(route.path),
    },
  })
}
class Https {
  BASE_URL: string = import.meta.env.VITE_BASE_API || ''
  authToken: string = ''
  constructor() {
    // if (import.meta.dev) {
    //   this.BASE_URL = '/proxy'
    // }
  }

  setAuthToken(token: string) {
    this.authToken = token
  }

  //   middleware
  async fetchApi<T>(url: string, opt: any) {
    try {
      const nuxapp = useNuxtApp()
      const res = await useFetch(this.BASE_URL + url, {
        onRequest({ options }) {
          options.method = opt.method
          options.query = opt.query
          options.body = opt.body
          options.headers = opt.headers
        },

        onResponse({ response }) {
          if (response?.status === HttpCode.UNAUTHORIZED || response?._data?.code === HttpCode.UNAUTHORIZED) {
            nuxapp.runWithContext(() => {
              toLogin()
            })
          }
        },
      })

      return res as AsyncData<Request<T> | undefined, Error>
    }
    catch (error) {
      console.error('Fetch failed:', error)
      throw error
    }
  }

  createHeaders = (isToken: boolean, isJson: boolean = true): HeadersInit => {
    const headers: HeadersInit = {}

    if (isJson) {
      headers['Content-Type'] = 'application/json'
    }

    if (isToken) {
      const store = useAuth()
      const route = useRoute()
      this.authToken = store.token

      if (Date.now() > (store.expires_at) * 1000) {
        navigateTo({
          path: '/login/loading',
          query: {
            redirect_url: encodeURIComponent(route.path),
          },
        })
      }
      headers.Authorization = `Bearer ${this.authToken}`
    }

    return headers
  }

  get = async <T, R = undefined>(url: string, body?: R, isToken: boolean = true) => {
    const options: any = {
      method: 'GET',
      headers: this.createHeaders(isToken),
    }
    if (body) {
      options.query = body
    }

    return this.fetchApi<T>(url, options)
  }

  post = async <T, R = undefined>(url: string, body?: R, isToken: boolean = true) => {
    return this.fetchApi<T>(url, {
      method: 'POST',
      headers: this.createHeaders(isToken),
      body: JSON.stringify(body),
    })
  }

  put = async <T, R = undefined>(url: string, body?: R, isToken: boolean = true) => {
    return this.fetchApi<T>(url, {
      method: 'PUT',
      headers: this.createHeaders(isToken),
      body: JSON.stringify(body),
    })
  }

  upload = async <T, R = undefined>(url: string, body?: R, isToken: boolean = true) => {
    // 创建一个新的 FormData 对象
    const formData = new FormData()

    for (const [key, value] of Object.entries(body || {})) {
      formData.append(key, value as Blob)
    }

    return this.fetchApi<T>(url, {
      method: 'POST',
      headers: this.createHeaders(isToken, false),
      body: formData,
    })
  }

  delete = async <T, R = undefined>(url: string, options?: R, isToken: boolean = true) => {
    return this.fetchApi<T>(url, {
      method: 'DELETE',
      headers: this.createHeaders(isToken),
      body: JSON.stringify(options),
    })
  }
}
export const https = new Https()
