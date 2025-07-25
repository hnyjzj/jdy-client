/**
 * 产品状态
 */
export enum GoodsStatus {
  /** 草稿 */
  ProductStatusDraft = 1,
  /** 正常 */
  ProductStatusNormal,
  /** 已报损 */
  ProductStatusDamage,
  /** 调拨中 */
  ProductStatusAllocate,
  /** 已出售 */
  ProductStatusSold,
  /** 已定出 */
  ProductStatusReturn,
  /** 盘点中 */
  ProductStatusCheck,
  /** 无库存 */
  ProductStatusNoStock,
}

export const GoodsStatusMap = {
  1: '草稿',
  2: '正常',
  3: '已报损',
  4: '调拨中',
  5: '已出售',
  6: '已定出',
  7: '盘点中',
  8: '无库存',
}

/**
 * 产品类型
 */
export enum GoodsType {
  /** 成品 */
  ProductFinish = 1,
  /** 旧料 */
  ProductOld,
  /** 配件 */
  ProductAccessories,
}

/**
 * 没有配件产品类型
 */
export enum GoodsTypePure {
  /** 成品 */
  ProductFinish = 1,
  /** 旧料 */
  ProductOld,
}

/** 产品类型 */
export const typePreset = { 1: '成品', 2: '旧料' }
