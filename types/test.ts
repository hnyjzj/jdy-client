// 测试数据。后期将会删除。

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

// finance/achievement/Summary.vue
const finishedColumns = [
  {
    header: '姓名',
    field: 'name',
  },
  {
    header: '年龄',
    field: 'age',
  },
  {
    header: '出生日期',
    field: 'birthday',
  },
  {
    header: '地址',
    field: 'address',
  },
  {
    header: '操作',
    field: 'operation',
  },
]
const oldColumns = [
  {
    header: '大类',
    field: 'category',
  },
  {
    header: '剩余抵值',
    field: 'residue',
  },
  {
    header: '退货金额',
    field: 'returnAmount',
  },
]
const finishedData = [
  {
    name: '小美',
    age: 20,
    birthday: '0',
    address: '0',
    operation: '编辑',
  },
  {
    name: '懒羊羊',
    age: 23,
    birthday: '0',
    address: '0',
    operation: '编辑',
  },
  {
    name: '懒羊羊',
    age: 23,
    birthday: '0',
    address: '0',
    operation: '编辑',
  },
  {
    name: '懒羊羊',
    age: 23,
    birthday: '0',
    address: '0',
    operation: '编辑',
  },
]
const oldData = [
  {
    category: '成品',
    residue: 100,
    returnAmount: 100,
  },
  {
    category: '原料',
    residue: 100,
    returnAmount: 100,
  },
  {
    category: '银料用件',
    residue: 100,
    returnAmount: 100,
  },
]

const productInfo = [
  {
    name: '条码',
    desc: 's123901287',
  },
  {
    name: '零售方式',
    desc: '自提',
  },
  {
    name: '零售方式',
    desc: '自提',
  },
  {
    name: '工艺',
    desc: '特价',
  },
  {
    name: '工艺',
    desc: '特价',
  },
  {
    name: '工艺',
    desc: '特价',
  },
]

const repairInfo = [
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
]

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

const repair = [
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
]

const pics = [
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

export { depositList, finishedColumns, finishedData, memberInfo, oldColumns, oldData, pics, productInfo, repair, repairInfo, ruleList }
