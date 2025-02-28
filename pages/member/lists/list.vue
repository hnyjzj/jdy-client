<script setup lang="ts">
useSeoMeta({
  title: '会员列表',
})
const { $toast } = useNuxtApp()

const { getMemberList, getMemberInfo, getMemberWhere, updateIntegral } = useMemberManage()
const { memberList, memberInfo, filterListToArray, memberListTotal, searchPage } = storeToRefs(useMemberManage())

const actions = [
  { id: 1, text: '增加' },
  { id: 2, text: '减少' },
]

const items = ref([{
  id: 1,
  isPopoverVisible: false,
  actions,
  selected: '',
}])

const complate = ref(0)
const searchKey = ref('')
const isFilter = ref(false)
const filterData = ref({} as Partial<Member>)
// 没有更多数据了
const nomore = ref(true)

const pages = ref(1)
async function getList(where = {} as Partial<Member>) {
  if (!nomore.value)
    return
  const params = { page: pages.value, limit: 20 } as ReqList<Member>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  const res = await getMemberList(params)
  if (res.data?.list.length) {
    pages.value++
  }
  else {
    nomore.value = false
  }
  return res as any
}

await getList()
await getMemberWhere()

const openFilter = () => {
  isFilter.value = true
}

const show = ref(false)

const memberParams = ref<Member>({} as Member)
const integralParams = ref<IntegralReq>({} as IntegralReq)

// 获取当前用户积分信息，并显示弹窗
const adjustment = async (id: string) => {
  show.value = true
  await getMemberInfo(id as string)
  memberParams.value = JSON.parse(JSON.stringify(memberInfo.value))

  integralParams.value.id = memberParams.value.id
}

// 调整方式
const adjustWay = ref(0)
// 变更积分的绝对值
const fluctuant = ref()

// 初始化弹窗信息
const initPopup = () => {
  show.value = false
  adjustWay.value = 0
  fluctuant.value = ''
  integralParams.value.remark = ''
  items.value.forEach((item) => {
    item.isPopoverVisible = false
    item.selected = ''
  })
}

const disposeNumerical = () => {
  if (adjustWay.value === 1) {
    integralParams.value.change = fluctuant.value
  }
  else {
    integralParams.value.change = -fluctuant.value
  }
}

const adjustIntegral = async () => {
  if (adjustWay.value !== 0 && fluctuant.value !== 0 && fluctuant.value !== undefined && integralParams.value.remark) {
    disposeNumerical()
    await updateIntegral(integralParams.value)

    initPopup()
  }
  else {
    $toast.warning('当前积分调整无效，请检查输入信息')
  }
}

// 筛选列表
async function submitWhere(f: Partial<Member>) {
  filterData.value = { ...f }
  pages.value = 1
  nomore.value = true
  memberList.value = []
  const res = await getList(filterData.value)
  if (res.code === HttpCode.SUCCESS) {
    isFilter.value = false
    return $toast.success('筛选成功')
  }
  $toast.error(res.message ?? '筛选失败')
}

const updatePage = async (page: number) => {
  searchPage.value = page
  await getList()
}

const goIntegral = (id: string) => {
  jump('/member/integral/record', { id })
}

const userJump = (id: string) => {
  jump('/member/lists/info', { id })
}

const userCancel = () => {
  initPopup()
}
</script>

<template>
  <div>
    <common-model
      v-model:model-value="show"
      :show-ok="true"
      title="调整积分"
      @confirm="adjustIntegral"
      @cancel="userCancel"
    >
      <div class="pb-[16px] flex flex-col gap-[16px]">
        <div class="flex flex-row justify-between gap-[16px]">
          <div class="item flex-1">
            <div class="item-caption">
              当前积分
            </div>
            <div class="item-specific">
              <div class="disabled">
                {{ memberParams.integral }}
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-caption">
            调整类型
          </div>
          <div class="item-specific">
            <div>
              <template v-for="(item, index) in items" :key="index">
                <div class="flex flex-row justify-between items-center gap-[8px]">
                  <van-popover
                    v-model:show="item.isPopoverVisible"
                    :actions="item.actions"
                    @select="(action: any) => {
                      item.selected = action.text
                      adjustWay = action.id
                    }"
                  >
                    <template #reference>
                      <div class="refer">
                        <div
                          class="row-left dark:color-[#fff] font-size-[14px] text-nowrap"
                          :style="{ color: item.selected ? '#191919' : '#808089' }"
                        >
                          {{ item.selected || '调整方式' }}
                        </div>
                        <div class="row-right">
                          <van-icon :name="!item.isPopoverVisible ? 'arrow' : 'arrow-down'" color="#808089" size="14px" />
                        </div>
                      </div>
                    </template>
                  </van-popover>
                  <input
                    v-model="fluctuant"
                    placeholder="请输入积分数量"
                    class="input"
                  >
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-caption">
            调整原因
          </div>
          <div class="item-specific">
            <textarea
              v-model="integralParams.remark"
              name="textarea"
              rows="5"
              cols="30"
              wrap="soft"
              placeholder="此项为必填项，请填写调整原因"
              class="area"
            />
          </div>
        </div>
      </div>
    </common-model>

    <product-filter
      v-model:id="complate" v-model:search="searchKey" :product-list-total="memberListTotal" @filter="openFilter">
      <template #company>
        <product-manage-company />
      </template>
    </product-filter>

    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="filterListToArray" @submit="submitWhere" />

    <div class="flex flex-col px-[16px] py-[16px]">
      <member-lists-list :info="memberList" @go-info="userJump" @view-integral="goIntegral" @change-integral="adjustment" />
      <common-page v-model:page="searchPage" :total="memberListTotal" :limit="12" @update:page="updatePage" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  --uno: 'flex flex-col gap-[6px]';

  &-caption {
    --uno: 'font-size-[14px] color-[#333333]';
  }

  &-specific {
    --uno: 'font-size-[14px] color-[#666] flex-1';
  }
}

.disabled {
  --uno: 'flex flex-row justify-between font-size-[14px] text-[#808089] rounded-[60px] bg-[rgba(222,222,222,0.5)] border-solid border-[1px] border-[rgba(230,230,232,0.7)] px-[10px] py-[8px] flex flex-row justify-items-start';

  .variational {
    --uno: 'flex-center-row gap-[2px]';
  }
}

.refer {
  --uno: 'flex flex-between h-[34px] min-w-[80px] gap-[4px] px-[12px] border-rd-[60px] text-[14px] bg-[#fff] border-[#e6e6e8] border-[1px] border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)] cursor-pointer';
}

.area {
  --uno: 'rounded-[8px] bg-[#fff] text-[#333] min-w-full max-h-[80px] px-[12px] py-[8px] font-size-[14px] border-solid border-[#E6E6E8] focus:border-[#3971F3] resize-none';
}

.input {
  --uno: 'flex-1 w-auto h-[34px] font-size-[14px] px-[12px] rounded-[60px] bg-[#fff] border-[#e6e6e8] border-[1px] border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)] focus:border-[#3971F3]';
}
</style>
