<script lang="ts" setup>
import PrintTemp from '@/components/print/Board.vue'

import usePrint from 'vue3-use-print'
// 销售单详情
useSeoMeta({
  title: '销售单详情',
})
const { $toast } = useNuxtApp()
const { getMemberWhere } = useMemberManage()
const { getPrintTempList, getTempInfo } = useSystemPrint()
const { printList, searchPage, PrintTemplate } = storeToRefs(useSystemPrint())
const { filterList: memberFiler } = storeToRefs(useMemberManage())
const { OrderDetail, filterList } = storeToRefs(useOrder())
const { getOrderDetail, getSaleWhere, returnOrderGoods } = useOrder()
const { getFinishedWhere } = useFinished()
const { finishedFilterList } = storeToRefs(useFinished())
const { getOldWhere } = useOld()
const { oldFilterList } = storeToRefs(useOld())

const { myStore } = storeToRefs(useStores())

const { userinfo } = storeToRefs(useUser())
const { getUserInfo } = useUser()
await getUserInfo()

const route = useRoute()
if (route.query.id) {
  await getOrderDetail({ id: route.query.id as string })
  await getMemberWhere()
  await getSaleWhere()
  await getFinishedWhere()
  await getOldWhere()
}
const showModel = ref(false)
const returnGoods = async (req: ReturnGoods) => {
  const res = await returnOrderGoods(req)
  if (res) {
    showModel.value = false
    $toast.success('退货成功')
    await getOrderDetail({ id: route.query.id as string })
  }
}

const router = useRouter()

const gather = ref('')

const getMethod = () => {
  const method = OrderDetail.value.payments.map(item => item.payment_method)
  const name = method.map(item => filterList.value.payment_method?.preset[item])

  gather.value = name.join('、')
}

const limit = 12
const isPrintable = OrderDetail.value.status === 3 || OrderDetail.value.status === 4

// 获取类别1(销售单)的打印模板
async function getList(where = {} as Partial<PrintTemplate>) {
  const params = { page: searchPage.value, limit, where: { store_id: myStore.value.id, type: 1 } } as ReqList<Member>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  await getPrintTempList(params)
}

await getList()

const chosen = ref(null)
const tempInfo = ref<PrintTemplate>({} as PrintTemplate)

const tempList = printList.value.map(item => ({ label: item.name, value: item.id })).filter(item => item.value !== '')

const getSpecificInfo = async () => {
  if (chosen.value) {
    await getTempInfo({ id: chosen.value, type: 1, store_id: myStore.value.id })
    tempInfo.value = JSON.parse(JSON.stringify(PrintTemplate.value))
  }
}

const printPre = () => {
  const PrintComponent = defineComponent({
    render() {
      return h(PrintTemp, { details: OrderDetail.value, type: 1, operator: userinfo.value.nickname, payMethod: gather.value, numerical: tempInfo.value })
    },
  })
  getMethod()
  usePrint(PrintComponent)
}

const isModel = ref(false)

const jumpPre = () => {
  isModel.value = true
}

// 弹窗确认
const modelConfirm = async () => {
  if (chosen.value) {
    await getSpecificInfo()
    printPre()
  }
  else {
    $toast.error('请先选择打印模板')
  }
}

const isMobile = ref(false)

onMounted(() => {
  isMobile.value = checkEnv()
})
</script>

<template>
  <div>
    <common-model
      v-model="isModel"
      :show-ok="true"
      title="选择打印模板"
      @confirm="modelConfirm"
      @cancel="() => (
        isModel = false,
        chosen = null
      )"
    >
      <div class="flex flex-col gap-[16px] px-[12px]">
        <div class="describe font-size-[16px] text-color-[#333] pt-[32px]">
          请先选择打印模板。
        </div>
        <div class="pb-[32px]">
          <n-space vertical>
            <n-select
              v-model:value="chosen"
              :options="tempList"
            />
          </n-space>
        </div>
      </div>
    </common-model>
    <div class="p-[16px] pb-[80px]">
      <sale-order-detail
        v-model:dialog="showModel"
        :old-filter="oldFilterList"
        :member-filer="memberFiler"
        :order-where="filterList"
        :product-filter="finishedFilterList"
        :orders="OrderDetail"
        :return-goods="returnGoods" />
    </div>
    <template v-if="!isMobile && isPrintable">
      <common-button-bottom
        confirm-text="打印"
        cancel-text="返回"
        @confirm="() => jumpPre()"
        @cancel="router.back()"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid #e6e6e8;
  --uno: 'fixed bottom-0 left-0 block w-full bg-[#F1F5FE] dark:bg-[rgba(0,0,0,0.6)] blur-8px py-3';
}
.info {
  --uno: 'bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] border-solid border-1 border-[#EFF0F6] dark:border-[rgb(239,240,246,0.1)] rounded-[24px] overflow-hidden';
}
</style>
