interface ReqList<T = undefined> {
  page: number
  limit: number
  where: T
}
