interface Roles {
  /**
   * 权限列表
   */
  apis: Apis[]
  /**
   * 创建时间
   */
  created_at?: Date
  /**
   * 删除时间
   */
  deleted_at?: Date
  /**
   * 角色描述
   */
  desc: string
  /**
   * ID
   */
  id: string
  /**
   * IP地址
   */
  ip: string
  /**
   * 是否管理员
   */
  is_admin: boolean
  /**
   * 是否超级管理员
   */
  is_root: boolean
  /**
   * 角色名称
   */
  name: string
  /**
   * 操作员
   */
  operator: Staffs
  /**
   * 操作员ID
   */
  operator_id: string
  /**
   * 功能列表
   */
  routers: Routers[]
  /**
   * 员工列表
   */
  staffs: Staffs[]
  /**
   * 更新时间
   */
  updated_at?: Date
  stores: Stores[]
  /** 默认角色 */
  is_default: boolean
  /** 身份 */
  identity: number
}

interface RolesParams {
  /**
   * 角色描述
   */
  desc: string
  /**
   * 是否管理员
   */
  is_default?: boolean
  /**
   * 角色名称
   */
  name: string
  /** 身份 */
  identity: number
  id?: string
}

/**
 * Apis
 */
interface Apis {
  /**
   * 创建时间
   */
  created_at?: Date
  /**
   * 删除时间
   */
  deleted_at?: Date
  /**
   * ID
   */
  id: string
  /**
   * 请求方式
   */
  method: string
  /**
   * 接口地址
   */
  path: string
  /**
   * 标题
   */
  title: string
  /**
   * 更新时间
   */
  updated_at?: Date
  children: Apis[]
  stores: Stores[]
}

/** 更新参数 */
interface UpdateAuthParams {
  id: string
  stores?: string[]
  staffs?: string[]
  routers?: string[]
  apis?: string[]
}
