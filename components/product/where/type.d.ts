declare module 'where' {
  export type Where<T> = {
    [K in keyof T]: T[K]
  }
}
