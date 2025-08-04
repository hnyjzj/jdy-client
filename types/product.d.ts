// 产品类型
interface ProductDamage {
  code: ProductFinisheds['code']
  reason: string
}

interface ProductTransfer {
  id: ProductFinisheds['id']
  type: ProductFinisheds['type']
}

/**
 * 货品记录参数
 */
interface HistoryWhere {
  /**
   * 操作
   */
  action: number
  /**
   * 编号
   */
  code: string
  /**
   * 门店 ID
   */
  store_id: string
}

/**
 * 货品操作记录
 */
interface ProductHistories {
  /**
   * 操作
   */
  action: number
  /**
   * 创建时间
   */
  created_at: Date
  /**
   * ID
   */
  id: string
  /**
   * IP
   */
  ip: string
  /**
   * 键
   */
  key: string
  /**
   * 操作人ID
   */
  operator_id: string
  /**
   * 操作人信息
   */

  operator: Staff
  /**
   * 更新后货品信息
   */
  new_value: ProductFinisheds
  /**
   * 更新前货品信息
   */
  old_value: ProductFinisheds
  /**
   * 产品ID
   */
  product_id: string
  /**
   * 来源id
   */
  source_id: string
  /**
   * 门店 ID
   */
  store_id: string
  /**
   * 更新时间
   */
  updated_at: Date
  /**
   * 值
   */
  value: any[] | boolean | number | { [key: string]: any } | null | string
  code: string

}

/**
 * 上传产品图参数
 */
interface UploadProductImg {
  image: File
  product_id: string
}

interface Allhistory<T = undefined> {
  all: boolean
  where?: Partial<T>
}
