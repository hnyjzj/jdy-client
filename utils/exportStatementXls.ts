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
function mapEnumValues(
  row: Record<string, any>, // 输入的行对象
  enumMap: Record<string, Record<any, string>>, // 枚举映射对象
): Record<string, any> { // 返回新的行对象
  const newRow: Record<string, any> = { ...row }
  for (const key in row) { // 遍历行对象的每一个键
    if (enumMap[key]) { // 如果键在枚举映射对象中存在
      const rawValue = row[key] // 获取原始值
      // ✅ 如果值匹配到 preset 映射，则用映射值；否则置空
      newRow[key] = rawValue in enumMap[key] ? enumMap[key][rawValue] : ''
    }
    else if (key === 'is_special_offer') { // 如果键是 is_special_offer
      newRow[key] = row[key] ? '是' : '否' // 如果原始值是 true，则映射为 '是'，否则为 '否'
    }
    if (key === 'member') {
      newRow.member_name = row[key].name
      newRow.member_phone = row[key].phone
    }
    if (key === 'order') {
      newRow.source = enumMap.source[row[key].source] || ''
      newRow.price_pay = row[key].price_pay || ''
      newRow.order_price = row[key].price || ''
      newRow.price_original = row[key].price_original || ''
      newRow.remarks = row[key]?.remarks?.join(',') || ''
      newRow.mainSale = row[key].clerks[0].salesman?.nickname || ''
      if (row.type === GoodsType.ProductFinish) {
        newRow.price_product = row[key].product_finished_price || ''
      }
      if (row.type === GoodsType.ProductOld) {
        newRow.price_old = row[key].product_old_price || ''
      }
      if (row.type === GoodsType.ProductAccessories) {
        newRow.price_accessory = row[key].product_accessorie_price || ''
      }
    }
    if (row.type === GoodsType.ProductFinish && key === 'finished') {
      newRow.retail_type = enumMap.retail_type[row[key].product.retail_type] || ''
      newRow.labor_fee_product = row[key].labor_fee || ''
      newRow.weight_metal = row[key].product.weight_metal || ''
      newRow.price = row[key].price || ''
      newRow.product_price_gold = row[key].price_gold || ''
      newRow.product_price_original = row[key].price_original || ''
      newRow.discount_member = row[key].discount_member || ''
      newRow.discount_final = row[key].discount_final || ''
      newRow.weight_total = row[key].product.weight_total || ''
      newRow.supplier = enumMap.supplier[row[key].product.supplier] || ''
      newRow.brand = enumMap.brand[row[key].product.brand] || ''
      newRow.material = enumMap.material[row[key].product.material] || ''
      newRow.quality = enumMap.quality[row[key].product.quality] || ''
      newRow.gem = enumMap.gem[row[key].product.gem] || ''
      newRow.category = enumMap.category[row[key].product.category] || ''
      newRow.craft = enumMap.craft[row[key].product.craft] || ''
      newRow.name = row[key].product.name || ''
      newRow.code = row[key].product.code || ''
    }
    if (row.type === GoodsType.ProductOld && key === 'old') {
      newRow.recycle_price = row[key].recycle_price || ''
      newRow.recycle_price_gold = row[key].recycle_price_gold || ''
      newRow.recycle_price_labor = row[key].recycle_price_labor || ''
      newRow.quality_actual = row[key].quality_actual || ''
      newRow.recycle_points = row[key].integral || ''
      newRow.weight_metal = row[key].weight_metal || ''
      newRow.recycle_method = enumMap.recycle_method[row[key].product.recycle_method] || ''
      newRow.recycle_weight_metal = row[key].weight_metal || ''
      newRow.recycle_price_labor_method = enumMap.recycle_price_labor_method[row[key].recycle_price_labor_method] || ''
      newRow.supplier = enumMap.supplier[row[key].product.supplier] || ''
      newRow.brand = enumMap.brand[row[key].product.brand] || ''
      newRow.material = enumMap.material[row[key].product.material] || ''
      newRow.quality = enumMap.quality[row[key].product.quality] || ''
      newRow.gem = enumMap.gem[row[key].product.gem] || ''
      newRow.category = enumMap.category[row[key].product.category] || ''
      newRow.craft = enumMap.craft[row[key].product.craft] || ''
      newRow.name = row[key].product.name || ''
      newRow.code = row[key].product.code || ''
    }
    if (row.type === GoodsType.ProductAccessories && key === 'accessorie') {
      newRow.accessory_price = row[key].product.price || ''
      newRow.accessory_retail_type = enumMap.retail_type[row[key].product.retail_type] || ''
      newRow.accessory_quantity = row[key].quantity || ''
      newRow.name = row[key].product.name || ''
      switch (row[key].product.type) {
        case accessoriesType.part:
          newRow.accessory_type = '配件'
          break
        case accessoriesType.material:
          newRow.accessory_type = '物料'
          break
        case accessoriesType.gift:
          newRow.accessory_type = '赠品'
          break
        case accessoriesType.goods:
          newRow.accessory_type = '商品'
          break
        default:
          break
      }
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
 * @param type 类型：1 为成品，2 为旧料（默认 1）
 */
export function exportStatementListToXlsx(
  data: Record<string, any>[],
  fields: { name: string, preset?: Record<any, string> }[],
  name: string = '货品列表',
  summary?: [string, string | number][],
  type: 1 | 2 | 3 = 1,
) {
  let headerMap = oldHeaderMap
  if (type === 1) {
    headerMap = finishedHeaderMap
  }
  if (type === 2) {
    headerMap = oldHeaderMap
  }
  if (type === 3) {
    headerMap = statementHeaderMap
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
