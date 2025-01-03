interface Res<T = undefined> {
  code: number
  message: string
  data?: T
}

interface ResList<T = undefined> {
  list: T[]
  total: number
}
