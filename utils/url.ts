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
 * @params url 请求地址
 * @params filter 过滤参数
 * @params V 泛型 转出的对象
 * @params K 泛型 过滤参数
 * @returns object
 */
export function getQueryParams<V extends Partial<Record<string, any>>, K extends Where<any> = Where<any>>(url: string | undefined, filter?: K): V {
  if (!url)
    return {} as V
    // 解码URL的查询部分
  const queryString = decodeURIComponent(url).split('?')[1] || ''
  if (!queryString)
    return {} as V
    // 将查询字符串分割成参数数组
  const params = queryString.split('&')

  // 将所有参数转换为对象
  const queryParams = {} as V

  params.forEach((param) => {
    const [key, value] = param.split('=')

    const where = filter && filter[key as keyof K]
    switch (where?.type) {
      case 'number':
        (queryParams as Record<string, any>)[key] = Number(value)
        break
      case 'float':
        (queryParams as Record<string, any>)[key] = Number.parseFloat(value)
        break
      case 'string':
        (queryParams as Record<string, any>)[key] = decodeURIComponent(value)
        break
      case 'bool':
        (queryParams as Record<string, any>)[key] = !!value
        break
      case 'boolean':
        (queryParams as Record<string, any>)[key] = value === 'true'
        break
      case 'string[]':
        (queryParams as Record<string, any>)[key] = value.split(',').map(item => decodeURIComponent(item))
        break
      case 'time':
        (queryParams as Record<string, any>)[key] = new Date(value).getTime()
        break
      default:
        (queryParams as Record<string, any>)[key] = decodeURIComponent(value) || undefined
        break
    }
  })

  return queryParams as V
}
