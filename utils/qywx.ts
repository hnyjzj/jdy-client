import * as wx from '@wecom/jssdk'

export const regs = async () => {
  await wx.register({
    corpId: 'ww4deef9b788f1ac8b', // 必填，当前用户企业所属企业ID
    jsApiList: ['getNetworkType'], // 必填，需要使用的JSAPI列表
    getConfigSignature, // 必填，根据url生成企业签名的回调函数
    getAgentConfigSignature,
  })

  async function getConfigSignature(url: any) {
    // 根据 url 生成企业签名
    // 生成方法参考 https://developer.work.weixin.qq.com/document/path/90539
    // return { timestamp, nonceStr, signature }
    console.log(url, 'url1')
    return url
  }
}
async function getAgentConfigSignature(url: any) {
  // 根据 url 生成应用签名，生成方法同上，但需要使用应用的 jsapi_ticket
  console.log(url, 'url2')
  return url
}
