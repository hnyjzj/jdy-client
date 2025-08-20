import * as XLSX from 'xlsx'

/** 提取字段中的 preset 枚举 */
function extractPresets<T extends { name: string, preset?: Record<any, string> }>(
  fields: T[],
): { [K in T as K['preset'] extends Record<any, string> ? K['name'] : never]: K['preset'] } {
  const result: any = {}
  fields.forEach((field) => {
    if (field.preset)
      result[field.name] = field.preset
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
      newRow[key] = row[key] in enumMap[key] ? enumMap[key][row[key]] : ''
    }
    else if (key === 'is_special_offer' || key === 'is_our') {
      newRow[key] = row[key] ? '是' : '否'
    }
    else if (['store', 'recycle_store', 'operator'].includes(key)) {
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

/** 转换为 AOA 格式（用于 Excel 导出，按给定表头顺序） */
function convertDataWithChineseHeaders(
  data: Record<string, any>[],
  fieldMap: Record<string, string>, // 英文 -> 中文
  fieldOrder: string[], // 英文字段顺序
): any[][] {
  const headers = fieldOrder.map(f => fieldMap[f]).filter(Boolean) // 只保留有中文映射的
  const rows = data.map(row =>
    fieldOrder.map(f => (fieldMap[f] ? row[f] ?? '' : undefined)) // 只取有映射的字段
      .filter(v => v !== undefined),
  )
  return [headers, ...rows]
}

/** 合并多个数组按索引对应成一行 */
function mergeRowsByIndex(dataList: Record<string, any>[][]): Record<string, any>[] {
  const maxLength = Math.max(...dataList.map(arr => arr.length))
  const merged: Record<string, any>[] = []

  for (let i = 0; i < maxLength; i++) {
    const row: Record<string, any> = {}
    dataList.forEach((data) => {
      const item = data[i] || {}
      Object.entries(item).forEach(([key, value]) => {
        row[key] = value // ⚠️ 如果重复会覆盖，可加前缀
      })
    })
    merged.push(row)
  }

  return merged
}

/** 导出 Excel（多个数组对应成同一行，表头中文，按 headerMap 顺序循环） */
export function exportToXlsxMultiple(
  dataList: Record<string, any>[][],
  fields: { name: string, preset?: Record<any, string> }[],
  headerMap: Record<string, string>, // 中文 -> 英文
  name: string = '货品列表',
) {
  const enumMap = extractPresets(fields)

  // 映射枚举值
  const mappedDataList = dataList.map(arr => arr.map(row => mapEnumValues(row, enumMap)))

  // 按行索引合并
  const mergedData = mergeRowsByIndex(mappedDataList)

  // 翻转 headerMap => 英文 -> 中文
  const fieldMap: Record<string, string> = Object.fromEntries(
    Object.entries(headerMap).map(([zh, en]) => [en, zh]),
  )

  // 表头顺序 = headerMap 的 value 顺序（英文字段）
  const fieldOrder = Object.values(headerMap)

  // 转换为 AOA（只保留在 headerMap 中有映射的字段）
  const aoaData = convertDataWithChineseHeaders(mergedData, fieldMap, fieldOrder)

  const worksheet = XLSX.utils.aoa_to_sheet(aoaData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // 导出文件名带时间戳
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`
  const finalFilename = `${name}_${timestamp}.xlsx`

  XLSX.writeFile(workbook, finalFilename)
}
