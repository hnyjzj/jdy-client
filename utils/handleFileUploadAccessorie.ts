/**
 * 映射中文字段名到对应的英文字段名
 * @param headers excel表头
 * @returns 英文字段表头
 */
export default async function (headers: any) {
  const headerMap: Record<string, string> = {
    '编号*': 'code',
    '库存*': 'stock',
    '入网费*': 'access_fee',
    '类型': 'type_part',
    '名称': 'name',
    '条码': 'id',
  }
  const cleanedHeaders = headers.map((header: keyof AccessorieCategory) =>
    typeof header === 'string' ? header.replace(/\s/g, '') : header,
  )

  const englishHeaders = cleanedHeaders.map((header: any) => {
    return headerMap[header]
  })
  return englishHeaders
}
