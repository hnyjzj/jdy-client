interface PrintTemplate {
  /**
   * 模板名称
   */
  name: string
  /**
   * 模板类型
   */
  type?: PrintType
  /**
   * 模板id
   */
  id?: string
  /**
   * 模板归属的门店信息
   */
  store_id?: string
  /**
   * 是否为系统默认模板
   */
  is_default?: boolean
  /**
   * 模板配置
   */
  config: LayoutConfig
}

/**
 * 模板基础设置
 */
interface LayoutConfig {
  size: Size
  base: PositionValue
  phone: PositionValue
  list: PositionValue
  total: PositionValue
  more: PositionValue
}

/**
 * 纸张字体设置
 */
interface Size {
  width: number
  height: number
  fontSize: number
}

/**
 * 定位数值设置
 */
interface PositionValue {
  width?: number
  height?: number
  top?: number
  right?: number
  left?: number
  bottom?: number
}

interface PrintDetail {
  /**
   * 当前所属门店
   */
  currentShop: string
  /**
   * 当前操作员工
   */
  currentOperator: string
  /**
   * 当前打印时间
   */
  currentTime: string
  /**
   * 打印页码
   */
  printPage?: number
  /**
   * 打印条数
   */
  printCopies?: number
  /**
   * 打印数据
   */
  printData: orderInfoProducts[]
}
