import * as XLSX from 'xlsx'

/** 中文 => 英文字段映射 */
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
  '证书1编号': 'certificate1',
  '证书2编号': 'certificate2',
  '系列': 'series',
  '备注': 'remark',
  '是否特价': 'is_special_offer',
}

/** 生成英文 => 中文字段映射 */
const fieldMap: Record<string, string> = Object.fromEntries(
  Object.entries(headerMap).map(([zh, en]) => [en, zh]),
)

/** 提取字段中的 preset 枚举 */
function extractPresets<T extends { name: string, preset?: Record<any, string> }>(
  fields: T[],
): {
    [K in T as K['preset'] extends Record<any, string> ? K['name'] : never]: K['preset']
  } {
  const result = {} as any
  fields.forEach((field) => {
    if (field.preset) {
      result[field.name] = field.preset
    }
  })
  return result
}

/** 将枚举值映射为中文 */
function mapEnumValues(
  row: Record<string, any>,
  enumMap: Record<string, Record<any, string>>,
): Record<string, any> {
  const newRow: Record<string, any> = { ...row }
  for (const key in row) {
    if (enumMap[key]) {
      const rawValue = row[key]
      newRow[key] = enumMap[key][rawValue] ?? rawValue
    }
  }
  return newRow
}

/** 将数据转换为 AOA 格式（二维数组）用于 Excel */
function convertDataWithChineseHeaders(
  data: Record<string, any>[],
  fieldMap: Record<string, string>,
): any[][] {
  const fields = Object.keys(fieldMap)
  const headers = fields.map(field => fieldMap[field] || field)
  const rows = data.map(row => fields.map(field => row[field] ?? ''))

  return [headers, ...rows]
}

/**
 * 导出 Excel
 * @param data 需要导出的数据
 * @param fields 字段定义（带 name 和 preset）
 */
export function exportProductListToXlsx(
  data: Record<string, any>[],
  fields: { name: string, preset?: Record<any, string> }[],
) {
  const enumMap = extractPresets(fields)
  const mappedData = data.map(row => mapEnumValues(row, enumMap))
  const aoaData = convertDataWithChineseHeaders(mappedData, fieldMap)
  const worksheet = XLSX.utils.aoa_to_sheet(aoaData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  // 添加时间戳
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())})}`

  // 拼接文件名
  const finalFilename = `货品列表_${timestamp}.xlsx`

  XLSX.writeFile(workbook, finalFilename)
}
