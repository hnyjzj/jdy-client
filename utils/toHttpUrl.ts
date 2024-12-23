/**
 * 将图片地址转换为线上地址
 *
 * @param path 图片地址
 * @returns 加工后的图片地址
 */
export const ImageUrl = (path: string | undefined, preview = false) => {
  if (!path || path.startsWith('http'))
    return path || ''

  const imageUrl = import.meta.env.VITE_IMAGE_URL || ''
  const trailingSlash = imageUrl.endsWith('/') ? '' : '/'
  const leadingSlash = path.startsWith('/') ? path.slice(1) : path

  let url = `${imageUrl}${trailingSlash}${leadingSlash}`

  if (preview) {
    url = UrlAndParams(url, {
      timestamp: (new Date()).setMinutes(0, 0, 0) / 1000,
    })
  }

  return url
}
