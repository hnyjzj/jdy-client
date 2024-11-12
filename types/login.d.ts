interface Account {
  phone: string
  password: string
  captcha_id: string
  captcha: string
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

interface OAuthRes {
  /**
   * 登录成功后跳转的地址
   */
  redirect_url: string
}

interface OAuthLoginReq {
  code: string
  state: string
}
