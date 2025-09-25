import * as XLSX from 'xlsx'

/** 提取字段中的 preset 枚举 */
function extractPresets<
  T extends { name: string, preset?: Record<any, string> },
>(fields: T[]): Record<string, Record<any, string>> {
  const result: Record<string, Record<any, string>> = {}
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
      newRow[key] = row.from_store?.alias ?? ''
    }
    else if (key === 'to_store_id') {
      newRow[key] = row.to_store?.alias ?? ''
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
    else if (key === 'to_region_id') {
      newRow[key] = row.to_region?.name ?? ''
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
  const headers = fieldOrder.map(f => fieldMap[f]).filter(Boolean)
  const rows = data.map(row =>
    fieldOrder
      .map(f => (fieldMap[f] ? row[f] ?? '' : undefined))
      .filter(v => v !== undefined),
  )
  return [headers, ...rows]
}

/** 按行索引合并多个数组 */
function mergeRowsByIndex(
  dataList: Record<string, any>[][],
): Record<string, any>[] {
  const maxLength = Math.max(...dataList.map(arr => arr.length))
  const merged: Record<string, any>[] = []

  for (let i = 0; i < maxLength; i++) {
    const row: Record<string, any> = {}
    dataList.forEach((data) => {
      const item = data[i] || {}
      Object.entries(item).forEach(([key, value]) => {
        row[key] = value // ⚠️ 相同字段会覆盖
      })
    })
    merged.push(row)
  }
  return merged
}

/**
 * 导出 Excel（单 Sheet，多数据源拼一行）
 * @param dataList - 多个数据源数组 [res.data, newProduct]
 * @param fields - 字段配置（可能包含枚举和类型）
 * @param headerMap - 中文 -> 英文 的映射
 * @param name - 导出文件名
 */
export function exportToXlsxMultiple(
  dataList: Record<string, any>[][],
  fields: { name: string, preset?: Record<any, string>, type?: string }[],
  headerMap: Record<string, string>,
  name: string = '货品列表',
) {
  const enumMap = extractPresets(fields)

  // 映射枚举值
  const mappedDataList = dataList.map(arr =>
    arr.map(row => mapEnumValues(row, enumMap)),
  )

  // 合并
  const mergedData = mergeRowsByIndex(mappedDataList)

  // 翻转 headerMap => 英文 -> 中文
  const fieldOrder = Object.values(headerMap) // 英文字段顺序
  const fieldMap: Record<string, string> = Object.fromEntries(
    Object.entries(headerMap).map(([zh, en]) => [en, zh]),
  )

  // 转换为 AOA
  const aoaData = convertDataWithChineseHeaders(
    mergedData,
    fieldMap,
    fieldOrder,
  )

  const worksheet = XLSX.utils.aoa_to_sheet(aoaData)
  formatFloatFieldsInWorksheet(worksheet, aoaData, fieldOrder, fields)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // 导出文件名带时间戳
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const timestamp = `${now.getFullYear()}-${pad(
    now.getMonth() + 1,
  )}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const finalFilename = `${name}_${timestamp}.xlsx`

  XLSX.writeFile(workbook, finalFilename)
}
