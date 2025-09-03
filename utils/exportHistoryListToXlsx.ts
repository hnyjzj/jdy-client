import * as XLSX from 'xlsx'

/** 中文 => 英文字段映射 */
const headerMap: Record<string, string> = {
  '操作': 'action',
  '关联单号': 'source_id',
  '产品类型': 'type',
  '所属门店': 'store_id',
  '操作时间': 'updated_at',
  '条码*': 'code',
  '货品名称*': 'name',
  '入网费*': 'access_fee',
  '零售方式*': 'retail_type',
  '标签价*': 'label_price',
  '零售工费*': 'labor_fee',
  '款号': 'style',
  '供应商*': 'supplier',
  '品牌': 'brand',
  '成品大类': 'finish_class',
  '旧料大类': 'old_class',
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
  '系列': 'series',
  '备注': 'remark',
  '是否特价': 'is_special_offer',
  '回收方式': 'recycle_method',
  '回收金额': 'recycle_price',
  '回收金价': 'recycle_price_gold',
  '回收工费': 'recycle_price_labor',
  '回收工费方式': 'recycle_price_labor_method',
  '回收类型': 'recycle_type',
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
      newRow[key] = rawValue in enumMap[key] ? enumMap[key][rawValue] : ''
    }
    else if (key === 'is_special_offer') {
      newRow[key] = row[key] ? '是' : '否'
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
export function exportHistoryListToXlsx(
  data: Record<string, any>[],
  fields: { name: string, preset?: Record<any, string> }[],
  name: string = '货品记录列表',
  summary?: [string, string | number][],
) {
  if (!Array.isArray(data) || !Array.isArray(fields)) {
    throw new TypeError('data 和 fields 参数必须是数组')
  }

  if (data.length === 0) {
    throw new Error('导出数据不能为空')
  }
  const enumMap = extractPresets(fields)

  // 👉 根据 type 字段重命名 class 字段为 finish_class 或 old_class
  const normalizedData = data.map((row) => {
    const { class: classValue, ...rest } = row
    if (row.type === 1) {
      return { ...rest, finish_class: classValue }
    }
    else if (row.type === 2) {
      return { ...rest, old_class: classValue }
    }
    return row
  })

  const mappedData = normalizedData.map(row => mapEnumValues(row, enumMap))
  const aoaData = convertDataWithChineseHeaders(mappedData, fieldMap)

  let finalData: any[][] = []

  if (summary && summary.length > 0) {
    const summaryRows = [['', '合计'], ...summary, []]
    finalData = [...summaryRows, ...aoaData]
  }
  else {
    finalData = aoaData
  }

  const worksheet = XLSX.utils.aoa_to_sheet(finalData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const finalFilename = `${name}_${timestamp}.xlsx`

  try {
    XLSX.writeFile(workbook, finalFilename)
  }
  catch (error) {
    throw new Error(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}
