// 测试数据。后期全部删除

// 业绩测试数据。待删除

interface Rule {
  name: string
  category: Category[]
}
interface Category {
  name: string
  source: string
}
const ruleList: Rule[] = [
  {
    name: '镶嵌旧料',
    category: [
      {
        name: '玉石',
        source: '回收',
      },
      {
        name: '金属',
        source: '兑换',
      },
      {
        name: '金属',
        source: '兑换',
      },
      {
        name: '金属',
        source: '兑换',
      },
    ],
  },
  {
    name: '黄金旧料',
    category: [
      {
        name: '玉石',
        source: '回收',
      },
      {
        name: '金属',
        source: '兑换',
      },
    ],
  },
]

// 测试数据。待删除
const depositList: SalesSlip[] = [
  {
    num: 'CZ-32493974',
    store: {
      name: '青青草原一号店',
      salesVolume: 100000,
    },
    member: {
      nickname: '张三',
      phone: '13800138000',
      level: 2,
    },
    mainSalesman: '李四',
    goodsInfo: '足金挂坠',
    quantity: 55789,
    realAmount: 25000,
    goodsAmount: 15000,
    discountAmount: '100',
    oldDiscountAmount: '20',
    integral: '32',
    openType: '预定中',
    createTime: '2021-11-11 11:11:11',
    slipStatus: 2,
  },
]

// sale/sales/detail.vue
interface Pics {
  url: string[]
  data: string
}
const pics: Pics[] = [
  {
    url: [
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    ],
    data: '2021-11-11 11:11:11',
  },
]

// sale/search/member.vue
const memberInfo: MemberInfo = {
  nickname: '懒羊羊',
  phone: '19222222222',
  img: 'https://img.yzcdn.cn/vant/cat.jpeg',
  email: '16000000000@qq.com',
  address: '草原地上一层',
  birthday: '0000-01-01',
  gender: '未知',
  remark: '备注信息',
  createTime: '2021-10-10 10:10:10',
  level: 3,
  buyCount: 60,
  isFollow: 1,
}

// sale/repairs/info.vue
const repairInfo = ref([
  {
    name: '状态',
    desc: '门店已收货',
  },
  {
    name: '问题描述',
    desc: '项链断开',
  },
  {
    name: '维修费',
    desc: '12312',
  },
  {
    name: '维修成本',
    desc: '99',
  },
])

// sale/finance/income.vue
const incomeInfo = ref([
  {
    name: '创建时间',
    desc: '2022-01-01 12:00:00',
  },
  {
    name: '所属门店',
    desc: '洛阳XXXXXXX分店',
  },
  {
    name: '关联单号',
    desc: 'SZ21473209174238',
  },
])

declare module 'mock' {

}
