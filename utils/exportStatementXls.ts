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
  // order 信息
  if (row.order) {
    const order = row.order
    Object.assign(newRow, {
      source: enumMap.source?.[order.source] ?? '',
      price_pay: order.price_pay ?? '',
      price_deposit: order.price_deposit ?? '',
      created_at: formatTimestampToDateTime(order.created_at) ?? '',
      remark: order.remarks?.join(',') || '',
      mainSale: order.clerks?.[0]?.salesman?.nickname ?? '',
      mainSale_ratio: `${order.clerks?.[0]?.performance_rate ?? ''}%`,
      subSale_count: order.clerks.length - 1,
      subSale: order.clerks.slice(1).map((c: OrderSalesClerks) => c.salesman?.nickname ?? '').join(','),
      subSale_ratio: order.clerks.slice(1).map((c: OrderSalesClerks) => `${c.performance_rate ?? ''}%`).join(','),
    })
  }
  // 类型相关处理
  const fillProductFields = (p: any, fields: string[]) => {
    fields.forEach((field) => {
      const val = p[field]
      newRow[field] = enumMap[field]?.[val] ?? (val == null || val === 0 ? '' : val)
    })
  }
  switch (row.type) {
    case GoodsType.ProductFinish:
      if (row.finished) {
        const f = row.finished
        const p = f.product || {}
        const data = {
          discount_member: f.discount_member ?? '',
          discount_final: f.discount_final ?? '',
          product_price_gold: f.price_gold ?? '',
          price: f.price ?? '',
          labor_fee_product: Number(f.product?.labor_fee) ?? 0,
          labor_fee_product_actual: Number(f.labor_fee) ?? 0, // 实收工费
          labor_fee_product_ratio: '', // 工费比例
          price_original: f.price_original ?? '',
          label_price: p.label_price ?? '',
          amount_price: f.price ?? '',
          class: enumMap.finished_class?.[p.class] ?? '',
          series_product: p.series ?? '',
          remark_product: p.remark ?? '',
        }
        if (data.labor_fee_product !== 0 && data.labor_fee_product_actual !== 0) {
          data.labor_fee_product_ratio = `${(data.labor_fee_product_actual / data.labor_fee_product * 100).toFixed(2) || ''}%` // 工费比例
        }
        Object.assign(newRow, data)
        fillProductFields(p, [
          'name',
          'code',
          'weight_metal',
          'weight_total',
          'retail_type',
          'supplier',
          'brand',
          'material',
          'quality',
          'gem',
          'category',
          'craft',
        ])
      }
      break
    case GoodsType.ProductOld:
      if (row.old) {
        const o = row.old
        const p = o.product || {}
        Object.assign(newRow, {
          price_old: o.recycle_price ?? '',
          recycle_price_gold: o.recycle_price_gold ?? '',
          recycle_price_labor: o.recycle_price_labor ?? '',
          quality_actual: o.quality_actual ?? '',
          recycle_points: o.integral ?? '',
          weight_metal: o.weight_metal ?? '',
          recycle_weight_metal: o.weight_metal ?? '',
          recycle_price_labor_method: enumMap.recycle_price_labor_method?.[o.recycle_price_labor_method] ?? '',
          class: enumMap.class?.[p.class] ?? '',
          code_old: p.code ?? '',
          code: p.code_finished ?? '',
          remark_product: p.remark ?? '',
        })
        fillProductFields(p, [
          'name',
          'recycle_method',
          'supplier',
          'brand',
          'material',
          'quality',
          'gem',
          'category',
          'craft',
        ])
      }
      break
    case GoodsType.ProductAccessories:
      if (row.accessorie) {
        const a = row.accessorie
        const p = a.product || {}
        Object.assign(newRow, {
          accessory_price: p.price ?? '',
          accessory_retail_type: enumMap.retail_type?.[p.retail_type] ?? '',
          accessory_quantity: a.quantity ?? '',
          name: p.name ?? '',
          price_original: a.price_original ?? '',
          amount_price: a.price ?? '',
          label_price: p.price ?? '',
          remark_product: p.remark ?? '',
        })
        newRow.accessory_type = (() => {
          switch (p.type) {
            case accessoriesType.part: return '配件'
            case accessoriesType.material: return '物料'
            case accessoriesType.gift: return '赠品'
            case accessoriesType.goods: return '商品'
            default: return ''
          }
        })()
      }
      break
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
export function exportStatementListToXlsx(
  data: Record<string, any>[],
  fields: { name: string, preset?: Record<any, string>, type?: string }[],
  name: string = '货品列表',
  summary?: [string, string | number][],
) {
  const headerMap = statementHeaderMap
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
