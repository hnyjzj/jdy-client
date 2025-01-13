interface GetListReq<T = any> {
  /**
   * 条目
   */
  limit: number
  /**
   * 页码
   */
  page: number
  /**
   * 条件
   */
  where?: T
}

interface UploadRes {
  url: string
}
