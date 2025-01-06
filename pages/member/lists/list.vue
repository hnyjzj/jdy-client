<script setup lang="ts">
const { getMemberList, getMemberInfo, getMemberWhere, updateMemberInfo } = useMemberManage()
const { memberList, memberInfo, filterListToArray, memberListTotal } = storeToRefs(useMemberManage())

const { $toast } = useNuxtApp()

useSeoMeta({
  title: '会员列表',
})

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

// 获取头部高度
const height = ref<number | undefined>(0)
onMounted(() => {
  height.value = getHeight('header')
})
function pull() {
  getList()
}

const show = ref(false)
const memberParams = ref<Member>({} as Member)
const adjustment = async (id: string) => {
  show.value = !show.value
  await getMemberInfo(id as string)
  memberParams.value = JSON.parse(JSON.stringify(memberInfo.value))
}

const adjustWay = ref(0)
const afterAdjusting = (initValue: number, adjustValue: number) => {
  return adjustWay.value === 1 ? initValue + adjustValue : initValue - adjustValue
}

const showTo = ref(0)
const capture = defineModel()
const updateShowTo = () => {
  if (adjustWay.value !== 0 && capture.value !== undefined && capture.value !== '') {
    const adjustValue = Number(capture.value)
    showTo.value = afterAdjusting(memberParams.value.integral, adjustValue)
  }
}

const updateIntegral = async () => {
  memberParams.value.integral = showTo.value
  await updateMemberInfo(memberParams.value)
  if (adjustWay.value !== 0 && capture.value !== '') {
    show.value = false
  }
  else {
    $toast.warning('当前积分调整无效')
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

const userJump = (id: string) => {
  jump('/member/lists/info', { id })
}
</script>

<template>
  <div class="grid-12">
    <common-model v-model:model-value="show" :show-ok="true" title="调整积分" @confirm="updateIntegral">
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
          <div class="item flex-1">
            <div class="item-caption">
              调整后积分
            </div>
            <div class="item-specific">
              <div class="disabled">
                <div class="show">
                  <input v-model="showTo" class="border-none bg-[#fff] bg-opacity-0" disabled>
                </div>
                <template v-if="adjustWay !== 0 && capture !== undefined && capture !== ''">
                  <div class="variational">
                    <div v-if="adjustWay === 1" class="increase color-[#2ED653]">
                      +
                    </div>
                    <div v-else class="decrease color-[#FF2F2F]">
                      -
                    </div>
                    <div class="capture" :style="{ color: adjustWay === 1 ? '#2ED653' : '#FF2F2F' }">
                      {{ capture }}
                    </div>
                  </div>
                </template>
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
                    @select="(action) => {
                      item.selected = action.text
                      adjustWay = action.id
                      updateShowTo()
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
                    v-model="capture"
                    placeholder="请输入积分数量"
                    class="input"
                    @blur="updateShowTo"
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
              name="textarea"
              rows="5"
              cols="30"
              wrap="soft"
              placeholder="非必填"
              class="area"
            />
          </div>
        </div>
      </div>
    </common-model>

    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="filterListToArray" @submit="submitWhere" />

    <div class="flex flex-col col-12" uno-lg="col-8 offset-2">
      <div>
        <product-filter
          v-model:id="complate" v-model:search="searchKey" :product-list-total="memberListTotal" @filter="openFilter">
          <template #company>
            <product-manage-company />
          </template>
        </product-filter>
      </div>

      <common-list-pull
        :distance="height"
        :nomore="!nomore"
        @pull="pull"
      >
        <member-lists-list :info="memberList" @go-info="userJump" @change-integral="adjustment" />
      </common-list-pull>
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
