/**
 * 映射中文字段名到对应的英文字段名
 * @param headers excel表头
 * @returns 英文字段表头
 */
export default async function (headers: any) {
  const headerMap: Record<string, string> = {
    '编号': 'id',
    '类型*': 'type_part',
    '名称*': 'name',
    '条码': 'code',
    '零售方式*': 'retail_type',
    '重量': 'weight',
    '入网费': 'access_fee',
    '标签价': 'label_price',
    '材质': 'material',
    '成色': 'quality',
    '主石': 'gem',
    '品类': 'category',
    '规格': 'specification',
    '颜色': 'color',
    '系列': 'series',
    '供应商': 'supplier',
    '备注': 'remark',
  }
  const cleanedHeaders = headers.map((header: keyof AccessorieCategory) =>
    typeof header === 'string' ? header.replace(/\s/g, '') : header,
  )

  const englishHeaders = cleanedHeaders.map((header: any) => {
    return headerMap[header]
  })

  return englishHeaders
}
