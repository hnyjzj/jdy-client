/**
 * ProductOlds，旧料
 */
interface ProductOlds {

  /**
   * 品牌
   */
  brand: number
  /**
   * 品类
   */
  category: number
  /**
   * 主石净度
   */
  clarity: number
  /**
   * 条码
   */
  code: string
  /**
   * 主石色
   */
  color_gem: number
  /**
   * 工艺
   */
  craft: number
  /**
   * 创建时间
   */
  created_at: Date
  /**
   * 主石切工
   */
  cut: number
  /**
   * 删除时间
   */
  deleted_at: Date
  /**
   * 主石
   */
  gem: number
  /**
   * ID
   */
  id: string
  /**
   * 是否本司货品
   */
  is_our: boolean
  /**
   * 标签价
   */
  label_price: string
  /**
   * 材质
   */
  material: number
  /**
   * 名称
   */
  name: string
  /**
   * 主石数
   */
  num_gem: number
  /**
   * 杂料数
   */
  num_other: number
  /**
   * 成色
   */
  quality: number
  /**
   * 实际成色
   */
  quality_actual: number
  /**
   * 回收方式
   */
  recycle_method: number
  /**
   * 回收价格
   */
  recycle_price: number
  /**
   * 回收金价
   */
  recycle_price_gold: number
  /**
   * 回收工费
   */
  recycle_price_labor: number
  /**
   * 回收工费方式
   */
  recycle_price_labor_method: number
  /**
   * 回收来源
   */
  recycle_source: number
  /**
   * 回收来源ID
   */
  recycle_source_id: string
  /**
   * 回收门店
   */
  recycle_store: null | Stores
  /**
   * 回收门店ID
   */
  recycle_store_id: number | string
  /**
   * 回收类型
   */
  recycle_type: number
  /**
   * 备注
   */
  remark: string
  /**
   * 状态
   */
  status: number
  /**
   * 门店，当前所在门店
   */
  store: null | Stores
  /**
   * 门店ID
   */
  store_id: string
  /**
   * 产品类型
   */
  type: number
  /**
   * 更新时间
   */
  updated_at: Date | null
  /**
   * 主石重
   */
  weight_gem: number
  /**
   * 金重
   */
  weight_metal: number
  /**
   * 杂料重
   */
  weight_other: number
  /**
   * 总重
   */
  weight_total: number
  /**
   * 积分
   */
  score?: number
  /**
   *  大类
   */
  class: number
  /**
   * 积分比例
   */
  rate: number | string
}
