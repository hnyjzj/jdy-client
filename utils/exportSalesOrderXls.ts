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
// 定义一个函数，用于将枚举值映射到新的对象中
// 优化后的 mapEnumValues，减少重复、提升可维护性
function mapEnumValues(
  row: Record<string, any>,
  enumMap: Record<string, Record<any, string>>,
): Record<string, any> {
  const newRow: Record<string, any> = { ...row }
  // 通用枚举和布尔
  Object.keys(row).forEach((key) => {
    if (enumMap[key]) {
      newRow[key] = enumMap[key][row[key]] ?? ''
    }
    else if (key === 'is_special_offer') {
      newRow[key] = row[key] ? '是' : '否'
    }
  })
  // member 信息
  if (row.member) {
    newRow.member_name = row.member.name ?? ''
    newRow.member_phone = row.member.phone ?? ''
  }
  newRow.mainSale = row.clerks?.[0]?.salesman?.nickname ?? ''
  newRow.mainSale_ratio = `${row.clerks?.[0]?.performance_rate ?? ''}%`
  newRow.subSale_count = row.clerks.length - 1
  newRow.subSale = row.clerks.slice(1).map((c: OrderSalesClerks) => c.salesman?.nickname ?? '').join(',')
  newRow.subSale_ratio = row.clerks.slice(1).map((c: OrderSalesClerks) => `${c.performance_rate ?? ''}%`).join(',')
  newRow.remark = row.remarks?.join(',') || ''
  newRow.created_at = formatTimestampToDateTime(row.created_at) ?? ''

  if (row.products.length) {
    const productFinisheds = ref<string[]>([])
    const productFinishedsPrice = ref<number>(0)
    const productOolds = ref<string[]>([])
    const productOldPrice = ref<number>(0)
    const productAccessories = ref<string[]>([])
    const productAccessoriesPrice = ref<number>(0)

    row.products.forEach((p: any) => {
      switch (p.type) {
        case GoodsType.ProductFinish:
          productFinisheds.value.push(p.finished.product?.code ?? '')
          productFinishedsPrice.value += Number(p.finished.price) ?? 0
          Object.assign(newRow, {
            product_finisheds: productFinisheds.value.join(','),
            product_finisheds_amount: productFinishedsPrice.value,
          })
          break
        case GoodsType.ProductOld:
          productOolds.value.push(p.old.product?.code ?? '')
          productOldPrice.value += Number(p.old.recycle_price) ?? 0
          Object.assign(newRow, {
            product_olds: productOolds.value.join(','),
            product_olds_amount: productOldPrice.value,
          })
          break
        case GoodsType.ProductAccessories:
          productAccessories.value.push(`${p.accessorie.product?.name}*${p.accessorie.quantity}`)
          productAccessoriesPrice.value += Number(p.accessorie.price) ?? 0
          Object.assign(newRow, {
            product_accessories: productAccessories.value.join(','),
            product_accessories_amount: productAccessoriesPrice.value,
          })
          break
      }
    })
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
  const rows = data.map((row) => {
    return fields.map((field) => {
      if (field === 'store') {
        return row.store.name ?? ''
      }

      return row[field] ?? ''
    })
  })

  return [headers, ...rows]
}

/**
 * 导出 Excel
 * @param data 导出的数据数组
 * @param fields 字段定义（带 name 和 preset）
 * @param name 导出文件名
 * @param summary 统计信息区域
 *
 */
export function exportSalesOrderListToXlsx(
  data: Record<string, any>[],
  fields: { name: string, preset?: Record<any, string>, type?: string }[],
  name: string = '货品列表',
  summary?: [string, string | number][],
) {
  const headerMap = saleHeaderMap
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
  // Apply number formatting for float fields
  formatFloatFieldsInWorksheet(worksheet, finalData, Object.keys(fieldMap), fields)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const finalFilename = `${name}_${timestamp}.xlsx`

  XLSX.writeFile(workbook, finalFilename)
}
