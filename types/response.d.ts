// 列表响应
interface ResList<T = undefined> {
  list: T[]
  total: number
}

interface UploadRes {
  url: string
}

type EnumRes<V, O = { value: T, text: string }> = V & O
