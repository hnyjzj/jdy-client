declare module 'common-form' {
  // 表单规则
  export interface Rule<T = any, K = any> {
    /**
     * 验证失败时的提示信息
     */
    message: string

    /**
     * 验证器
     *
     * - 支持自定义方法
     * - 支持正则
     * - 支持枚举值
     * - 支持预定义的验证器
     * 如：required、string、number、boolean、array、object、email、url、date、phone
     *
     * @default undefined
     */
    validator:
      | ((value: K) => boolean)
      | RegExp
      | 'enum'
      | 'required'
      | 'string'
      | 'number'
      | 'boolean'
      | 'array'
      | 'object'
      | 'email'
      | 'url'
      | 'date'
      | 'phone'

    /**
     * 枚举值
     * 当 validator 为 enum 时，枚举值必须
     */
    enums?: K[]
  }

  // 表单规则集
  export type Rules<T> = {
    [K in keyof T]?: Rule<K, T[K]>[]
  }
}
