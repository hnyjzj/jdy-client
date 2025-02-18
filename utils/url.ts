/**
 * 对象转URL参数
 *
 * @param url 请求地址
 * @param param 请求参数
 * @returns string
 */
export function UrlAndParams(url: string, param: object) {
  if (!param || typeof param !== 'object')
    return url
  const urlParams = getQueryParams(url)
  const params = { ...param, ...urlParams }
  const str = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string | number | boolean)}`)
    .join('&')
  if (!str)
    return url
  return `${url}?${str}`
}

/**
 * 获取URL参数
 *
 * @param url 请求地址
 * @returns object
 */
export function getQueryParams<T extends object>(url: string | undefined): T {
  if (!url)
    return {} as T
    // 解码URL的查询部分
  const queryString = decodeURIComponent(url).split('?')[1] || ''
  if (!queryString)
    return {} as T
    // 将查询字符串分割成参数数组
  const params = queryString.split('&')

  // 将所有参数转换为对象
  const queryParams = {} as Record<string, string>
  params.forEach((param) => {
    const [key, value] = param.split('=')
    queryParams[key] = decodeURIComponent(value)
  })

  return queryParams as T
}
