/**
 * 映射中文字段名到对应的英文字段名
 * @param headers excel表头
 * @returns 英文字段表头
 */
export default async function (headers: any) {
  const headerMap: Record<string, string> = {
    '名称*': 'name',
    '零售方式*': 'retail_type',
    '类型*': 'type',
    '库存*': 'stock',
    '备注': 'remark',
  }
  const cleanedHeaders = headers.map((header: keyof ProductAccessories) =>
    typeof header === 'string' ? header.replace(/\s/g, '') : header,
  )

  const englishHeaders = cleanedHeaders.map((header: any) => {
    return headerMap[header]
  })
  return englishHeaders
}
