/**
 * 产品调拨
 */
interface AccessorieAllocate {
  /**
   * ID
   */
  id: string
  /**
   * 调拨方式
   */
  method: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 调拨门店
   */
  store_id?: string
  /**
   * 区域门店
   */
  to_region_id?: string
  to_region: Region
  /**
   * 调拨状态
   * 1:草稿 2:在途 3:已完成 4:已取消
   */
  status: AllocateStatus
  /**
   * 调出门店id
   */
  from_store_id?: string
  from_store: Stores
  /**
   * 调入门店id
   */
  to_store_id?: string
  to_store: Stores
  updated_at: string
  created_at: string
}

interface AccessorieAllocateInfo extends AccessorieAllocate {
  from_store: Stores
  operator: Staffs
  operator_id: string
  /** 调拨总数 */
  product_count: number
  /** 调拨总件数 */
  product_total?: number
  products: AccessorieAllocateProduct[]
}
/**
 * 配件调拨产品
 */
interface AccessorieAllocateProduct extends ProductAccessories {
  methood: number
  allocate: AccessorieAllocate
  allocate_id: string
  created_at: string
  id: string
  stock: number
  store: Stores
  updated_at: string
}

interface AccessorieAllocateReq {
  /**
   * 调出门店
   */
  from_store_id?: string
  /**
   * 调拨方式
   */
  method: number
  /**
   * 调拨原因
   */
  reason: number
  /**
   * 备注
   */
  remark?: string
  /**
   * 状态
   */
  status?: number
  /**
   * 调入门店
   */
  to_store_id?: string
  /**
   * 产品类型
   */
  type: number
  /**
   * 门店id
   */
  store_id: string
  /**
   * 入库单id
   */
  enter_id?: Enter['id']
  /** 区域id */
  to_region_id: string
}
interface AddAccessorieAllocateProduct {
  /**
   * 产品名称
   */
  name: string
  /**
   * 数量
   */
  quantity: number
}
/**
 * 添加调拨配件
 */
interface AddAccessorieAllocateReq {
  /**
   * 调拨单id
   */
  id: string
  products: AddAccessorieAllocateProduct[]
}

/** 删除调拨配件参数 */
interface AddAccessorieAllocateDel {
  /**
   * 调拨单id
   */
  id: string
  product_id: string
}

interface AccessorieAllocateInfoParams {
  id: string
  page: number
  limit: number
}
