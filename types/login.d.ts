/**
 * 账号登录参数
 */
interface AccountReq {
  phone: string
  password: string
  captcha_id: string
  captcha: string
}
/**
 * 账号登录返回参数
 */
interface AccountRes {
  token: string
  expires_at: number
}

/** 登录方式选择 */
interface OAuthReq {
  /**
   * 此接口固定为`wxwork`
   */
  state: 'wxwork' | 'wechat' | 'dingding'
  /**
   * 需要回到的链接地址
   */
  uri: string
}
/**
 * 授权登录参数
 */
interface OAuthRes {
  /**
   * 登录成功后跳转的地址
   */
  redirect_url: string
}
/**
 * 企业微信登录参数
 */
interface WXworkLoginReq {
  code: string
  state: string
}
/**
 * 企业微信登录返回参数
 */
interface WXworkLoginRes {
  token: string
  expires_at: number
}
