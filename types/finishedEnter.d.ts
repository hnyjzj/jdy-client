interface finishedEnterReq {
  page: number
  limit: number
  where?: Partial<FinishedEnter>
}

// 产品类型
interface FinishedEnter {
  /**
   * 创建时间
   */
  created_at: Date
  /**
   * 删除时间
   */
  deleted_at?: Date
  /**
   * ID
   */
  id: string
  /**
   * IP
   */
  ip?: string
  /**
   * 操作人
   */
  operator?: Staff
  /**
   * 操作人ID
   */
  operator_id?: string
  /**
   * 成品列表
   */
  products?: ProductFinisheds[]
  /**
   * 备注
   */
  remark?: string
  /**
   * 状态
   * 1:草稿 2:已完成 3:已撤销
   */
  status: EnterStatus
  store: Stores
  /**
   * 门店ID
   */
  store_id: string
  /**
   * 更新时间
   */
  updated_at: Date
  type: ProductFinisheds['type']
  /** 总数 */
  product_count: number
  /** 总入网费 */
  product_total_access_fee: number
  /** 总标签价格 */
  product_total_label_price: number
  /** 总重 */
  product_total_weight_metal: number
}

/**
 * 添加成品入库单产品
 */
interface FinishedEnterReq {
  /** 成品入库参数 */
  products: ProductFinisheds[]
  enter_id: string
}

/**
 * 编辑入库单产品
 */
interface editFinishedEnterReq {
  product: Partial<ProductFinisheds>
  /**
   * 入库单 ID
   */
  enter_id: string
  /**
   * 产品 ID
   */
  product_id: string
}

/**
 * 创建入库单参数
 */
interface CreateFinishedEnter {
  store_id: Stores['id']
  remark?: string
  type: number
}

/**
 * 删除入库单产品
 */
interface DelFinishedEnter {
  /**
   * 入库单ID
   */
  enter_id: string
  /**
   * 商品ID列表
   */
  product_ids: string[]
}

interface EnterInfoParams {
  id: FinishedEnter['id']
  page: number
  limit: number
}

interface EnterInfoParamsAll {
  id: FinishedEnter['id']
  all: boolean
}
