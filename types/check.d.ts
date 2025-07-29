interface Check {
  id: string
  /**
   * 产品品牌
   */
  brand: number[]
  /**
   * 产品品类
   */
  category: number[]
  /**
   * 成品大类
   */
  class_finished?: number[]
  /**
   * 旧料大类
   */
  class_old: number[]
  /**
   * 产品工艺
   */
  craft: number[]
  /**
   * 宝石种类
   */
  gem: number[]
  /**
   * 监盘人ID
   */
  inspector_id: string
  /**
   * 盘点人ID
   */
  inventory_person_ids: string[]
  inventory_persons: Staff[]
  /**
   * 产品材质
   */
  material: number[]
  /**
   * 产品成色
   */
  quality: number[]
  /**
   * 盘点范围
   */
  range?: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 门店ID
   */
  store_id: string
  /**
   * 产品类型
   */
  type?: number
  end_time: string
  id: string
  start_time: string
  status: number
  created_at: Data
  store: Store
}

interface CheckInfo {
  /**
   * 产品品牌
   */
  brand: number[]
  /**
   * 产品品类
   */
  category: number[]
  /**
   * 产品大类
   */
  class_finished: number[]
  class_old: number[]
  /**
   * 总件数
   */
  count_quantity?: number
  /**
   * 实盘数量
   */
  count_actual?: number
  /**
   * 盘盈数量
   */
  count_extra?: number
  /**
   * 盘亏数量
   */
  count_loss?: number
  /**
   * 总价值
   */
  count_price?: string
  /**
   * 应盘数量
   */
  count_should?: number
  /**
   * 总重量
   */
  count_weight_metal?: string
  /**
   * 产品工艺
   */
  craft: number[]
  /**
   * 创建时间
   */
  created_at?: Date
  /**
   * 删除时间
   */
  deleted_at?: Date
  /**
   * 宝石种类
   */
  gem: number[]
  /**
   * ID
   */
  id: string
  /**
   * 监盘人信息
   */
  inspector?: Staff
  /**
   * 监盘人ID
   */
  inspector_id: string
  /**
   * 盘带你人信息
   */
  inventory_persons: Staff[]
  /**
   * 盘点人ID
   */
  inventory_person_ids: string
  /**
   * 产品材质
   */
  material: number[]
  /**
   * 产品成色
   */
  quality: number[]
  /**
   * 盘点范围
   */
  range?: number
  /**
   * 备注
   */
  remark?: null | string
  /**
   * 盘点状态
   * 0: "全部", 1: "草稿", 2: "盘点中", 3: "待验证", 4: "盘点完成", 5: "盘点异常", 6: "盘点取消"
   */
  status: CheckStatus
  /**
   * 产品状态
   * 0: "应盘", 1: "实盘", 2: "盘盈", 3: "盘亏"
   */
  product_status: number
  /**
   * 门店
   */
  store?: Store
  /**
   * 门店ID
   */
  store_id: string
  /**
   * 产品类型
   */
  type?: GoodsType1
  /**
   * 更新时间
   */
  updated_at?: Date
  /** 应盘货品 */
  should_products?: CheckProduct[]
  /** 实盘货品 */
  actual_products?: CheckProduct[]
  /** 盘盈货品 */
  extra_products?: CheckProduct[]
  /** 盘亏货品 */
  loss_products?: CheckProduct[]
  /** 应盘数量 */
  should_count: number
  /** 实盘数量 */
  actual_count: number
  /** 盘盈数量 */
  extra_count: number
  /** 盘亏数量 */
  loss_count: number
}

interface CheckProduct {
  product_finished: ProductFinisheds
  product_old: ProductOlds
  product_code: string
  id: string
}

interface AddCheckProductOne {
  id: Check['id']
  code: string
}

interface AddCheckProduct {
  id: Check['id']
  codes: string[]
}

interface CheckInfoParams {
  id: string
  page: number
  limit: number
}

interface CheckInfoParamsAll {
  id: string
  all: boolean
}
