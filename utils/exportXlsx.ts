import * as XLSX from 'xlsx'

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
      // ✅ 如果值匹配到 preset 映射，则用映射值；否则置空
      newRow[key] = rawValue in enumMap[key] ? enumMap[key][rawValue] : ''
    }
    else if (key === 'is_special_offer') {
      newRow[key] = row[key] ? '是' : '否'
    }
    else if (key === 'is_our') {
      newRow[key] = row[key] ? '是' : '否'
    }
    else if (key === 'store' || key === 'recycle_store' || key === 'operator') {
      newRow[key] = row[key]?.name ?? ''
    }
    else if (key === 'from_store_id') {
      newRow[key] = row.from_store?.name ?? ''
    }
    else if (key === 'to_store_id') {
      newRow[key] = row.to_store?.name ?? ''
    }
    else if (key === 'initiator_id') {
      newRow[key] = row.initiator?.nickname ?? ''
    }
    else if (key === 'receiver_id') {
      newRow[key] = row.receiver?.nickname ?? ''
    }
    else if (key === 'created_at') {
      newRow[key] = row?.created_at ? formatTimestampToDateTime(row.created_at) : ''
    }
    else if (key === 'updated_at') {
      newRow[key] = row?.updated_at ? formatTimestampToDateTime(row.updated_at) : ''
    }
  }
  return newRow
}

/** 转换为 AOA 格式（用于 Excel 导出） */
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
 * @param data 导出的数据数组
 * @param fields 字段定义（带 name 和 preset）
 * @param name 导出文件名
 * @param summary 统计信息区域
 * @param type 类型：1 为成品，2 为旧料（默认 1）
 * @param header 自定义 header 表头映射
 */
export function exportProductListToXlsx(
  data: Record<string, any>[],
  fields: { name: string, preset?: Record<any, string> }[],
  name: string = '货品列表',
  summary?: [string, string | number][],
  type: 1 | 2 = 1,
  header?: Record<string, string>,
) {
  let headerMap

  if (header) {
    headerMap = header
  }
  else {
    headerMap = type === 1 ? finishedHeaderMap : oldHeaderMap
  }
  // 👇 生成 英文字段 => 中文标题 映射
  const fieldMap: Record<string, string> = Object.fromEntries(
    Object.entries(headerMap).map(([zh, en]) => [en, zh]),
  )

  const enumMap = extractPresets(fields)
  const mappedData = data.map(row => mapEnumValues(row, enumMap))
  const aoaData = convertDataWithChineseHeaders(mappedData, fieldMap)

  let finalData: any[][] = []

  if (summary && summary.length > 0) {
    const summaryRows = [['', '合计'], ...summary, []] // 空行隔开
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
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`
  const finalFilename = `${name}_${timestamp}.xlsx`

  XLSX.writeFile(workbook, finalFilename)
}
