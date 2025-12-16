<script setup lang="ts">
useSeoMeta({
  title: '会员列表',
})
const { $toast } = useNuxtApp()
const { getMemberList, getMemberInfo, getMemberWhere, updateIntegral } = useMemberManage()
const { memberList, memberInfo, filterListToArray, memberListTotal, showtype, filterList } = storeToRefs(useMemberManage())
const { searchPage } = storeToRefs(usePages())
const { myStore, StoreStaffList } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { getMyStore } = useStores()
const getStaff = async () => {
  if (!myStore.value.id)
    return
  await getStoreStaffList({ id: myStore.value.id })
}
await getMyStore()
const tableLoading = ref(false)

const isFilter = ref(false)
const filterData = ref({} as Partial<Member>)
const limits = ref(50)

async function getList(where = {} as Partial<Member>) {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value, where: { store_id: myStore.value.id } } as ReqList<Member>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }

  await getMemberList(params)
  tableLoading.value = false
}

const openFilter = () => {
  getStaff()
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
const adjustWay = ref(1)
// 变更积分的绝对值
const fluctuant = ref()

// 初始化弹窗信息
const initPopup = () => {
  show.value = false
  adjustWay.value = 0
  fluctuant.value = ''
  integralParams.value.remark = ''
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
const listJump = () => {
  const url = UrlAndParams('/member/lists/list', filterData.value)
  navigateTo(url, { external: true, replace: true, redirectCode: 200 })
}

const searchKey = ref('')
const route = useRoute()
await getMemberWhere()
// 读取url参数,获取列表
const handleQueryParams = async () => {
  filterData.value = {}
  const f = getQueryParams<Partial<Member>>(route.fullPath, filterList.value)
  filterData.value = f
  if (filterData.value.phone) {
    searchKey.value = filterData.value.phone
  }
  if (f.showtype) {
    showtype.value = f.showtype
  }
  if (f.searchPage) {
    searchPage.value = Number(f.searchPage)
  }
  if (f.limits) {
    limits.value = Number(f.limits)
  }

  await getList(filterData.value as Partial<Member>)
}
await handleQueryParams()

// 筛选列表
const submitWhere = (f: Partial<Member>) => {
  filterData.value = { ...f, showtype: showtype.value, searchPage: 1, limits: limits.value }
  listJump()
}
const resetWhere = () => {
  filterData.value = {}
  listJump()
}
const searchMember = async (phone: string) => {
  filterData.value.phone = phone
  filterData.value.searchPage = 1
  listJump()
}

// 清空选项
const clearFn = async () => {
  delete filterData.value.phone
  filterData.value.searchPage = 1
  listJump()
}

const changeStores = async () => {
  filterData.value.searchPage = 1
  await getList(filterData.value)
}
// 切换卡片
const changeCard = () => {
  filterData.value.showtype = showtype.value
  filterData.value.searchPage = searchPage.value
  filterData.value.limits = limits.value
  listJump()
}
const updatePage = async (page: number) => {
  filterData.value.searchPage = page
  filterData.value.limits = limits.value
  listJump()
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
  pageSize: limits,
  itemCount: memberListTotal,
  showSizePicker: true,
  pageSizes: [50, 100, 150, 200],
  onUpdatePageSize: (pageSize: number) => {
    limits.value = pageSize
    updatePage(1)
  },
  onChange: (page: number) => {
    updatePage(page)
  },
})

const cols = [
  {
    title: '姓名',
    render: (rowData: Member) => {
      return rowData.name || '--'
    },
  },
  { title: '手机号', render: (rowData: Member) => {
    return rowData.phone || '--'
  } },
  { title: '专属顾问', key: 'consultant.nickname' },
  { title: '等级', render: (rowData: Member) => {
    return getTarget(rowData, 'level', 'level') || '--'
  } },
  { title: '状态', render: (rowData: Member) => {
    return getTarget(rowData, 'status', 'status') || '--'
  } },
  { title: '入会门店', render: (rowData: Member) => {
    return rowData.store?.name || '--'
  } },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 170,
    render: (rowData: Member) => {
      return [h(
        'span',
        {
          type: 'primary',
          size: 'small',
          class: 'mr-[4px]',
          style: {
            color: '#0D6CE4',
            cursor: 'pointer',
            fontWeight: 'bold',
          },
          onClick: () => {
            userJump(rowData.id)
          },
        },
        { default: () => '详情' },
      ), h(
        'span',
        {
          type: 'info',
          size: 'small',
          class: 'mr-[4px]',
          style: {
            color: '#41CF84',
            cursor: 'pointer',
            fontWeight: 'bold',
          },
          onClick: () => {
            goIntegral(rowData.id)
          },
        },
        { default: () => '查看积分' },
      ), h(
        'span',
        {
          type: 'info',
          size: 'small',
          style: {
            color: '#DD9200',
            cursor: 'pointer',
            fontWeight: 'bold',
          },
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
      <div class="pb-[16px] flex flex-col gap-[16px] text-color">
        <div class="flex flex-col ">
          <div class="text-[14px] font-semibold  pb-[4px]">
            当前积分
          </div>
          <div class="light:bg-[#F5F5F5] dark:bg-[#243F69] h-[34px] line-height-[34px] pl-[16px] rounded-[30px]">
            {{ memberParams.integral }}
          </div>
        </div>

        <div>
          <div class="text-[14px] font-semibold text-color pb-[4px]">
            调整类型
          </div>
          <div class="flex flex-row justify-between items-center gap-[12px]" style="line-height: initial;">
            <div class="w-[120px]">
              <n-select v-model:value="adjustWay" :options="[{ label: '增加', value: 1 }, { label: '减少', value: 2 }]" placeholder="请选择调整类型" />
            </div>
            <n-input-number v-model:value="fluctuant" class="flex-1" min="0" clearable placeholder="请输入积分数量" @focus="focus" />
          </div>
        </div>
        <div class="">
          <div class="text-[14px] font-semibold text-color pb-[4px]">
            调整原因
          </div>
          <n-input
            v-model="integralParams.remark"
            :style="{
              '--n-border-radius': '8px',
            }" type="textarea" placeholder="此项为必填项，请填写调整原因" class="area" />
        </div>
      </div>
    </common-model>

    <product-filter
      v-model:search-key="searchKey"
      v-model:showtype="showtype"
      :product-list-total="memberListTotal"
      placeholder="搜索手机号" @change-card="changeCard" @filter="openFilter" @search="searchMember" @clear-search="clearFn">
      <template #company>
        <product-manage-company @change="changeStores" />
      </template>
    </product-filter>
    <div class="p-[16px]">
      <common-layout-center>
        <template v-if="showtype === 'list'">
          <template v-if="memberList.length">
            <member-lists-list :info="memberList" @go-info="userJump" @view-integral="goIntegral" @change-integral="adjustment" />
            <common-page v-model:page="searchPage" :total="memberListTotal" :limit="limits" @update:page="updatePage" />
          </template>
          <template v-else>
            <common-empty text="暂无数据" />
          </template>
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="memberList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </common-layout-center>
    </div>
    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetWhere">
      <template #consultant_id>
        <n-select
          v-model:value="filterData.consultant_id"
          filterable
          placeholder="输入顾问名称搜索"
          :options="StoreStaffList.map(v => ({
            label: v.nickname,
            value: v.id,
          }))"
          size="large"
          clearable
          remote
          @focus="() => {
            if (!myStore.id){
              StoreStaffList = []
              $toast.error('请先切换门店')
              return
            }
            getStaff()
          }"
        />
      </template>
    </common-filter-where>
  </div>
</template>

<style scoped lang="scss">

</style>
