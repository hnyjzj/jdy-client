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
 * 产品状态颜色
 */
export const GoodsStatusColorMap: Record<GoodsStatus, string> = {
  [GoodsStatus.ProductStatusDraft]: '#8B5CF6',
  [GoodsStatus.ProductStatusNormal]: '#059669',
  [GoodsStatus.ProductStatusDamage]: '#DC2626',
  [GoodsStatus.ProductStatusAllocate]: '#4F46E5',
  [GoodsStatus.ProductStatusSold]: '#DC2626',
  [GoodsStatus.ProductStatusReturn]: '#DC2626',
  [GoodsStatus.ProductStatusCheck]: '#4F46E5',
  [GoodsStatus.ProductStatusNoStock]: '#D97706',
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

/**
 * 配件类型
 */
export enum accessoriesType {
//   1: '配件',
  part = 1,
  //   2: '物料',
  material = 2,
  //   3: '赠品',
  gift = 3,
  //   4: '商品',
  goods = 4,

}
