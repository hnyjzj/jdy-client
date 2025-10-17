/**
 * 映射中文字段名到对应的英文字段名
 * @param headers excel表头
 * @returns 英文字段表头
 */
export default async function (headers: any) {
  const headerMap: Record<string, string> = {
    '条码*': 'code',
    '货品名称*': 'name',
    '入网费*': 'access_fee',
    '零售方式*': 'retail_type',
    '标签价*': 'label_price',
    '零售工费*': 'labor_fee',
    '款号': 'style',
    '供应商*': 'supplier',
    '品牌': 'brand',
    '材质(贵金属成分)*': 'material',
    '成色*': 'quality',
    '主石(宝玉石种类)*': 'gem',
    '品类*': 'category',
    '工艺': 'craft',
    '金重(g)*': 'weight_metal',
    '总重(g)': 'weight_total',
    '手寸': 'size',
    '贵金属颜色': 'color_metal',
    '主石重': 'weight_gem',
    '主石数量': 'num_gem',
    '副石1重': 'weight_other',
    '副石1数量': 'num_other',
    '颜色': 'color_gem',
    '净度': 'clarity',
    '证书': 'certificate',
    '系列': 'series',
    '备注': 'remark',
    '是否特价': 'is_special_offer',
    '入库时间': 'enter_time',
  }
  // 清洗表头（去掉空格）
  const cleanedHeaders = headers.map((header: string) =>
    typeof header === 'string' ? header.replace(/\s/g, '') : header,
  )

  // 匹配时优先找原字段，找不到就尝试去掉*匹配
  const englishHeaders = cleanedHeaders.map((header: string) => {
    if (headerMap[header]) {
      return headerMap[header]
    }
    const noStar = header.replace(/\*/g, '')
    const matchKey = Object.keys(headerMap).find(
      key => key.replace(/\*/g, '') === noStar,
    )
    return matchKey ? headerMap[matchKey] : header
  })

  return englishHeaders
}
