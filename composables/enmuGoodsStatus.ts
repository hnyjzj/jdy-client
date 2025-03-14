/**
 * 产品类型
 */
export enum GoodsStatus {
  /** 草稿 */
  ProductStatusDraft = 1,
  /** 正常 */
  ProductStatusNormal,
  /** 已报损 */
  ProductStatusDamage,
  /** 已调拨 */
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
