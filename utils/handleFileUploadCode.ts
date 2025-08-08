/**
 * 映射中文字段名到对应的英文字段名
 * @param headers excel表头
 * @returns 英文字段表头
 */
export default async function (headers: any) {
  const headerMap: Record<string, string> = {
    '旧条码*': 'code',
    '新条码*': 'new_code',
  }
  const cleanedHeaders = headers.map((header: keyof BatchCode) =>
    typeof header === 'string' ? header.replace(/\s/g, '') : header,
  )

  const englishHeaders = cleanedHeaders.map((header: any) => {
    return headerMap[header]
  })
  return englishHeaders
}
