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
    '标签价*': 'price',
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
    '总重(g)': 'weight',
    '手寸': 'size',
    '贵金属颜色': 'color_metal',
    '主石重': 'weight_gem',
    '主石数量': 'num_gem',
    '副石1重': 'weight_other',
    '副石1数量': 'num_other',
    '颜色': 'color',
    '净度': 'clarity',
    '证书1编号': 'certificate1',
    '证书2编号': 'certificate2',
    '备注': 'remark',
    '是否特价': 'is_special_offer',
  }
  const englishHeaders = headers.map((header: any) => {
    return headerMap[header] || header
  })
  return englishHeaders
}
