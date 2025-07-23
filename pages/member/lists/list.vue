<script setup lang="ts">
import { NButton } from 'naive-ui'

useSeoMeta({
  title: '会员列表',
})
const { $toast } = useNuxtApp()

const { getMemberList, getMemberInfo, getMemberWhere, updateIntegral } = useMemberManage()
const { memberList, memberInfo, filterListToArray, memberListTotal, showtype } = storeToRefs(useMemberManage())
const { searchPage } = storeToRefs(usePages())
// 获取当前员工的store信息
const { myStore } = storeToRefs(useStores())
const { getMyStore } = useStores()

await getMyStore({ page: 1, limit: 20 })
const tableLoading = ref(false)
const actions = ref([
  { key: 1, label: '增加' },
  { key: 2, label: '减少' },
])

const items = ref([{
  id: 1,
  isPopoverVisible: true,
  actions: actions.value,
  selected: '',
}])

const searchKey = ref('')
const isFilter = ref(false)
const filterData = ref({} as Partial<Member>)
const limit = ref(50)

async function getList(where = {} as Partial<Member>) {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limit.value, where: { store_id: myStore.value.id } } as ReqList<Member>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  await getMemberList(params)
  tableLoading.value = false
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
  await getMemberInfo({ id: id as string })
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

const searchMember = async () => {
  if (searchKey.value) {
    await getMemberList({ page: searchPage.value, limit: limit.value, where: { phone: searchKey.value, store_id: myStore.value.id } })
  }
  else if (searchKey.value === '') {
    await getList()
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
  memberList.value = []
  await getList(filterData.value)
}

const clearFn = async () => {
  memberList.value = []
  searchPage.value = 1
  await getList()
}

const changeStores = async () => {
  await getList()
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

const showInfo = filterListToArray.value
const getTarget = (arrs: Member, keyword: string, type: 'level' | 'status') => {
  const targetOption = showInfo?.find(p => p.name === keyword)
  const targetPreset = targetOption?.preset
  return targetPreset[arrs[type]]
}

const pageOption = ref({
  page: searchPage,
  pageSize: 50,
  itemCount: memberListTotal,
  showSizePicker: true,
  pageSizes: [50, 100, 150, 200],
  onUpdatePageSize: (pageSize: number) => {
    pageOption.value.pageSize = pageSize
    limit.value = pageSize
    updatePage(1)
  },
  onChange: (page: number) => {
    updatePage(page)
  },
})

const cols = [
  {
    title: '姓名',
    key: 'name',
  },
  { title: '手机号', key: 'phone' },
  { title: '专属顾问', key: 'consultant.nickname' },
  { title: '等级', key: 'gender', render: (rowData: Member) => {
    return getTarget(rowData, 'level', 'level')
  } },
  { title: '状态', key: 'gender', render: (rowData: Member) => {
    return getTarget(rowData, 'status', 'status')
  } },
  { title: '入会门店', key: 'store.name' },
  {
    title: '操作',
    width: 300,
    key: 'action',
    render: (rowData: Member) => {
      return [h(
        NButton,
        {
          type: 'primary',
          size: 'small',
          class: 'mr-[4px]',
          onClick: () => {
            userJump(rowData.id)
          },
        },
        { default: () => '查看详情' },
      ), h(
        NButton,
        {
          type: 'info',
          size: 'small',
          class: 'mr-[4px]',
          onClick: () => {
            goIntegral(rowData.id)
          },
        },
        { default: () => '查看积分' },
      ), h(
        NButton,
        {
          type: 'info',
          size: 'small',
          onClick: () => {
            adjustment(rowData.id)
          },
        },
        { default: () => '调整积分' },
      )]
    },
  },
]
</script>

<template>
  <div class="">
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
                <div class="flex flex-row justify-between items-center gap-[8px]" style="line-height: initial;">
                  <n-dropdown
                    trigger="click"
                    placement="bottom-start"
                    :options="item.actions"
                    @select="(action: any) => {
                      let select = actions.find((item:any) => item.key === action)
                      if (select){
                        item.selected = select.label
                        adjustWay = select.key
                      }
                    }">
                    <div class="refer">
                      <div
                        class="row-left dark:text-white font-size-[14px] whitespace-nowrap"
                        :style="{ color: item.selected ? '#191919' : '#808089' }"
                      >
                        {{ item.selected || '调整方式' }}
                      </div>
                      <div class="row-right">
                        <template v-if="!item.isPopoverVisible">
                          <icon name="i-icon:arrow" size="14" color="#808089" />
                        </template>
                        <template v-else>
                          <icon name="i-icon:arrow-down" size="7" color="#808089" />
                        </template>
                      </div>
                    </div>
                  </n-dropdown>
                  <input
                    v-model="fluctuant"
                    placeholder="请输入积分数量"
                    class="input"
                    @focus="focus"
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
    <div class="grid-12 sticky top-0 bg-gradient-linear-[180deg,#3875C5,#467EC9]  z-1">
      <div id="header" class="px-[16px] py-[12px] w-full   col-12" uno-lg="col-8 offset-2">
        <div class="flex flex-row gap-2">
          <product-manage-company class="color-[#fff]" @change="changeStores" />
          <product-filter-search
            placeholder="搜索手机号" class="color-[#fff] flex-1" @submit="searchMember" @clear="clearFn" />
        </div>
        <common-tool-list v-model="showtype" :total="memberListTotal" @height="openFilter" />
      </div>
    </div>

    <template v-if="showtype === 'list'">
      <div class="grid-12">
        <div class="flex flex-col  col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
          <div class="p-[16px]">
            <template v-if="memberList.length">
              <member-lists-list :info="memberList" @go-info="userJump" @view-integral="goIntegral" @change-integral="adjustment" />
              <common-page v-model:page="searchPage" :total="memberListTotal" :limit="limit" @update:page="updatePage" />
            </template>
            <template v-else>
              <common-emptys text="暂无数据" />
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <common-datatable :columns="cols" :list="memberList" :page-option="pageOption" :loading="tableLoading" />
    </template>
    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="filterListToArray" @submit="submitWhere" />
  </div>
</template>

<style scoped lang="scss">
.item {
  --uno: 'flex flex-col gap-[6px]';

  &-caption {
    --uno: 'font-size-[14px] color-[#333333] dark:color-[#fff]';
  }

  &-specific {
    --uno: 'font-size-[14px] color-[#666] flex-1';
  }
}

.disabled {
  --uno: 'flex flex-row justify-between font-size-[14px] text-[#808089] dark:text-[#CBCDD1] rounded-[60px] bg-[rgba(222,222,222,0.5)] dark:bg-[rgba(222,222,222,0.3)] border-solid border-[1px] border-[rgba(230,230,232,0.7)] dark:border-[rgba(230,230,232,0.4)] px-[10px] py-[8px] flex flex-row justify-items-start cursor-not-allowed';

  .variational {
    --uno: 'flex-center-row gap-[2px]';
  }
}

.refer {
  --uno: 'flex flex-between h-[34px] min-w-[80px] gap-[4px] px-[12px] border-rd-[60px] text-[14px] bg-[#fff] border-[#e6e6e8] border-[1px] border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)] cursor-pointer';
}

.area {
  --uno: 'rounded-[8px] bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.2)] text-[#333] dark:text-[#666] dark:border-[rgba(230,230,232,0.2)] min-w-full max-h-[80px] px-[12px] py-[8px] font-size-[14px] border-solid border-[#E6E6E8] focus:border-[#3971F3] resize-none';
}

.input {
  --uno: 'flex-1 w-auto h-[34px] font-size-[14px] px-[12px] rounded-[60px] bg-[#fff] border-[#e6e6e8] border-[1px] border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)] focus:border-[#3971F3]';
}
</style>
