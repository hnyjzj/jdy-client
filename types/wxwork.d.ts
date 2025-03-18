interface ticketRes {
  agent_id?: string
  agent_ticket?: string
  corp_id: string
  jsapi_ticket?: string
}
interface ticketReq {
  platform: 'wxwork'
  type: 'jsapi' | 'agent'
}
