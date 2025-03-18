import * as wx from '@wecom/jssdk'

interface Options {
  agent_ticket?: string
  jsapi_ticket?: string
}

class WxWork {
  public jsApiList = [
    'selectEnterpriseContact',
    'scanQRCode',
    'getContext',
    'getCurExternalContact',
  ]

  private corpId = import.meta.env.VITE_CORPID || ''
  private agent_ticket?: string
  private jsapi_ticket?: string

  constructor(options: Options) {
    this.agent_ticket = options?.agent_ticket
    this.jsapi_ticket = options?.jsapi_ticket

    this.register()
  }

  /**
   * 注册
   */
  register = () => {
    const options = {
      corpId: this.corpId,
      jsApiList: this.jsApiList,
    } as wx.RegisterOptions

    if (this.jsapi_ticket) {
      options.getConfigSignature = this.getConfigSignature
    }
    if (this.agent_ticket) {
      options.getAgentConfigSignature = this.getAgentConfigSignature
    }

    options.onConfigSuccess = () => {

    }
    options.onConfigFail = () => {

    }

    wx.register(options)
  }

  /**
   * 检测api接口
   *
   */
  checkJsApi = async () => {
    const { checkResult } = await wx.checkJsApi({
      jsApiList: this.jsApiList,
    })

    return checkResult
  }

  //  调取扫码
  scanQRCode = async () => {
    const { resultStr } = await wx.scanQRCode({
      needResult: true,
      scanType: [wx.ScanQRCodeType.qrCode, wx.ScanQRCodeType.barCode],
    })

    return resultStr
  }

  /**
   * 选择企业通讯录
   *
   * @param options 参数
   * @param options.selectedUserIds 已选员工id列表
   * @param options.selectedDepartmentIds 已选部门id列表
   *
   * @returns 选择的员工以及部门
   */
  selectPerson = async (options?: { selectedUserIds?: string[], selectedDepartmentIds?: string[] }) => {
    const { result } = await wx.selectEnterpriseContact({
      fromDepartmentId: 0,
      mode: wx.SelectEnterpriseContactMode.multi,
      type: [wx.SelectEnterpriseContactType.user],
      ...options,

    })
    return result
  }

  /**
   * 判断用户是从哪个入口打开页面
   */
  getContext = async () => {
    const res = await wx.getContext()
    return res.entry
  }

  /**
   * 获取用户ID
   */
  getUserId = async () => {
    const res = await wx.getCurExternalContact()
    if (res.errMsg === 'getCurExternalContact:ok') {
      return res.userId
    }
    else {
      console.error('getUserId error', res.errMsg)
    }
  }

  /**
   * @returns 获取jsapi_ticket
   */
  private getjsapiTicket = () => {
    if (!this.jsapi_ticket) {
      console.error('jsapi_ticket is required')
      return {} as wx.SignatureData
    }
    return wx.getSignature(this.jsapi_ticket)
  }

  private getAgentConfigSignature = () => {
    if (!this.agent_ticket) {
      console.error('agent_ticket is required')
      return {} as wx.SignatureData
    }

    return wx.getSignature(this.agent_ticket)
  }

  /**
   * 企业签名数据
   */
  private getConfigSignature = () => {
    return this.getjsapiTicket()
  }
}

export const wxWork = (options: Options) => new WxWork(options)
export const isWxWorkClient = () => {
  return wx.env.isWeCom || false
}
export const isWeChatClient = () => {
  return wx.env.isWeChat || false
}
