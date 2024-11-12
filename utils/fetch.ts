import type { AsyncData } from '#app'

interface Request<T> {
  code: number
  message: string
  data: T
}

class Https {
  BASE_URL: string = import.meta.env.VITE_BASE_URL || ''
  authToken: string = ''
  constructor() {
    if (import.meta.dev) {
      this.BASE_URL = '/proxy'
    }
  }

  setAuthToken(token: string) {
    // window.sessionStorage.setItem('authToken', token)
    this.authToken = token
  }

  //   middleware
  async fetchApi<T>(url: string, opt: any) {
    try {
      const res = await useFetch(this.BASE_URL + url, {
        onRequest({ options }) {
          // Set the request headers
          options.method = opt.method
          if (opt.method === 'POST') {
            options.body = opt.body
          }
          else {
            options.query = opt.query
          }

          if (import.meta.client) {
            options.headers = opt.headers || {}
          }
        },
        onRequestError() {
          // Handle the request errors
        },
        onResponse() {
        // Process the response data
        // console.log(response._data, 'response')
        },
        onResponseError() {
          // Handle the response errors
        },
        // ...opt,
      })

      return res as AsyncData<Request<T>, Error>
    }
    catch (error) {
      console.error('Fetch failed:', error)
      throw error
    }
  }

  createHeaders = (isToken: boolean): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (import.meta.client) {
      if (isToken) {
        const store = useAuth()
        this.authToken = store.token

        if (Date.now() > (store.expires_at) * 1000) {
          navigateTo('/login')
        }

        // if (!this.authToken) {
        //   navigateTo('/login')
        // }
      }

      headers.Authorization = this.authToken
    }

    return headers
  }

  get = async <T, R = undefined>(url: string, options?: R, isToken: boolean = false) => {
    return this.fetchApi<T>(url, {
      method: 'GET',
      headers: this.createHeaders(isToken),
      ...(options && { query: options }),
    })
  }

  post = async <T, R = undefined>(url: string, body?: R, isToken: boolean = false) => {
    return this.fetchApi<T>(url, {
      method: 'POST',
      headers: this.createHeaders(isToken),
      body: JSON.stringify(body),
    })
  }
}
export const https = new Https()
