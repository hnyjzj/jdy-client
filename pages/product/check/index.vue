<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $toast } = useNuxtApp()
const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { getCheckList, getCheckWhere } = useCheck()
const { checkList, checkFilterList, checkFilterListToArray, checkTotal } = storeToRefs(useCheck())
const { storesList } = storeToRefs(useStores())
const { getStoreList, getMyStore } = useStores()
const { searchPage, showtype } = storeToRefs(usePages())
const limits = ref(50)
const tableLoading = ref(false)

const storeCol = ref()
async function changeStore() {
  storeCol.value = []
  storesList.value.forEach((item: Stores) => {
    storeCol.value.push({ label: item.name, value: item.id })
  })
}
await getStoreList({ page: 1, limit: 20 })
await getMyStore({ page: 1, limit: 20 })
await changeStore()
await getCheckWhere()
// 筛选框显示隐藏
const isFilter = ref(false)
useSeoMeta({
  title: '货品盘点',
})
/** 打开高级筛选 */
const openFilter = () => {
  isFilter.value = true
}
/** 搜索 */
async function search(e: string) {
  await submitWhere({ id: e }, true)
}
/** 关闭搜索 */
async function clearSearch() {
  await submitWhere({ }, true)
}
// 获取货品列表
async function getList(where = {} as Partial<Check>) {
  tableLoading.value = true
  const params = { page: searchPage.value, limit: limits.value } as ReqList<Check>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  const res = await getCheckList(params)
  tableLoading.value = false
  return res as any
}

await getList()

const filterData = ref({} as Partial<Check>)

const pull = async (page: number) => {
  searchPage.value = page
  await getList(filterData.value)
}

const store_id = ref()
// 筛选列表
async function submitWhere(f: Partial<Check>, isSearch = false) {
  if (store_id.value) {
    f.store_id = store_id.value
  }
  filterData.value = { ...filterData.value, ...f }
  searchPage.value = 1
  checkList.value = []
  const res = await getList(filterData.value)
  if (res?.code === HttpCode.SUCCESS) {
    isFilter.value = false
    if (!isSearch) {
      $toast.success('筛选成功')
    }
    return
  }
  $toast.error(res?.message ?? '筛选失败')
}

/** 多选值 */
function getMultipleVal(preset: FilterWhere<Check>['preset'], val: any) {
  if (!preset && !val) {
    return ''
  }
  if (!val || val.length === 0)
    return ''
  let str = ''
  val.forEach((item: number) => {
    str = `${str}${preset[item] ? preset[item] : ''}`
  })
  return str
}

/** 单选值 */
function getRadioVal(preset: FilterWhere<Check>['preset'], val: any) {
  if (!val)
    return ''

  if (preset[val]) {
    return preset[val]
  }

  return ''
}

async function changeMyStore() {
  searchPage.value = 1
  reset()
  await getList()
}

/**
 * 表单唯一标识
 */
const Key = ref(useId())

/**
 * 重置
 */
function reset() {
  filterData.value = { }
  Key.value = Date.now().toString()
}

async function getStoreStaffListFun() {
  const res = await getStoreStaffList({ id: myStore.value.id })
  if (res) {
    $toast.error(res?.data.value?.message || '获取员工列表失败')
  }
}

const pageOption = ref({
  page: searchPage,
  pageSize: 50,
  itemCount: checkTotal,
  showSizePicker: true,
  pageSizes: [50, 100, 150, 200],
  onUpdatePageSize: (pageSize: number) => {
    pageOption.value.pageSize = pageSize
    limits.value = pageSize
    pull(1)
  },
  onChange: (page: number) => {
    pull(page)
  },
})

const cols = [
  {
    title: '盘点状态',
    key: 'status',
    render(row: Check) {
      return checkFilterList.value.status?.preset?.[row.status] ?? '-'
    },
  },
  // 以下动态生成的字段来自 checkFilterListToArray，根据 item.input 渲染
  ...checkFilterListToArray.value
    .filter(item => item.find)
    .map((item) => {
      if (item.name === 'class_finished') {
        return {
          title: item.label,
          key: 'class_finished',
          render(row: Check) {
            return row.type === GoodsType.ProductFinish
              ? getMultipleVal(item.preset, row.class_finished)
              : '-'
          },
        }
      }

      if (item.name === 'class_old') {
        return {
          title: item.label,
          key: 'class_old',
          render(row: Check) {
            return row.type === GoodsType.ProductOld
              ? getMultipleVal(item.preset, row.class_old)
              : '-'
          },
        }
      }

      if (item.input === 'text') {
        return {
          title: item.label === 'ID' ? '盘点单号' : item.label,
          key: item.name,
        }
      }

      if (item.input === 'select') {
        return {
          title: item.label,
          key: item.name,
          render(row: Check) {
            return getRadioVal(item.preset, row[item.name])
          },
        }
      }

      if (item.input === 'multiple') {
        if (item.name === 'inventory_person_ids') {
          return {
            title: item.label,
            key: 'inventory_persons',
            render(row: Check) {
              const list = row.inventory_persons || []
              if (list.length === 0)
                return '-'
              const shown = list.slice(0, 2).map(p => p.nickname).join(', ')
              const more = list.length > 2 ? ` +${list.length - 2}` : ''
              return `${shown}${more}`
            },
          }
        }
        else {
          return {
            title: item.label,
            key: item.name,
            render(row: Check) {
              return getMultipleVal(item.preset, row[item.name])
            },
          }
        }
      }

      return null // fallback
    })
    .filter(Boolean),
  {
    title: '创建时间',
    key: 'created_at',
    render(row: Check) {
      return formatTimestampToDateTime(row.created_at)
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(row: Check) {
      return h(
        'div',
        { style: 'display: flex; gap: 8px;' },
        [
          h(
            NButton,
            {
              type: 'info',
              size: 'small',
              onClick: () => jump('/product/check/info', { id: row.id }),
            },
            { default: () => '详情' },
          ),
        ],
      )
    },
  },
]
</script>

<template>
  <div>
    <!-- 筛选 -->
    <div id="header" class="sticky top-0 bg-[#3875C5] z-1">
      <product-filter
        v-model:showtype="showtype" :product-list-total="checkTotal" placeholder="搜索盘点单号" @filter="openFilter" @search="search" @clear-search="clearSearch">
        <template #company>
          <product-manage-company @change="changeMyStore" />
        </template>
      </product-filter>
    </div>
    <!-- 小卡片组件 -->
    <div class="px-[16px] pb-20">
      <template v-if="checkList?.length">
        <template v-if="showtype === 'list'">
          <product-manage-card :list="checkList">
            <template #top="{ info }">
              <div class="status-title" :class="info.status === 1 ? 'orange' : info.status === 2 ? 'bule' : 'grey'">
                {{ checkFilterList.status?.preset[info.status] }}
              </div>
            </template>
            <template #info="{ info }">
              <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
                <template v-for="(item, index) in checkFilterListToArray" :key="index">
                  <template v-if="item.find">
                    <template v-if="item.name === 'class_finished' || item.name === 'class_old'">
                      <template v-if="info.type === GoodsType.ProductFinish && item.name === 'class_finished'">
                        <div class="flex py-[4px] justify-between">
                          <div class="label">
                            {{ item.label }}
                          </div>
                          <div class="text-align-end">
                            {{ getMultipleVal(item?.preset, info[item.name]) }}
                          </div>
                        </div>
                      </template>
                      <template v-if="info.type === GoodsType.ProductOld && item.name === 'class_old'">
                        <div class="flex py-[4px] justify-between">
                          <div class="label">
                            {{ item.label }}
                          </div>
                          <div class="text-align-end">
                            {{ getMultipleVal(item?.preset, info[item.name]) }}
                          </div>
                        </div>
                      </template>
                    </template>
                    <template v-else>
                      <template v-if="item.input === 'text'">
                        <div class="flex py-[4px] justify-between">
                          <div class="label">
                            {{ item.label === 'ID' ? '盘点单号' : item.label }}
                          </div>
                          <div class="text-align-end">
                            {{ info[item.name] }}
                          </div>
                        </div>
                      </template>
                      <template v-if="item.input === 'select'">
                        <div class="flex py-[4px] justify-between">
                          <div class="label">
                            {{ item.label }}
                          </div>
                          <div class="text-align-end">
                            {{ getRadioVal(item.preset, info[item.name]) }}
                          </div>
                        </div>
                      </template>
                      <template v-if="item.input === 'multiple'">
                        <div class="flex py-[4px] justify-between">
                          <div class="label">
                            {{ item.label }}
                          </div>
                          <template v-if="item.name === 'inventory_person_ids'">
                            <div class="text-align-end w-[60%]">
                              <span
                                v-for="(person) in info.inventory_persons.slice(0, 2)" :key="person.id"
                                class="mr-[4px]"
                              >
                                <n-tag size="small">
                                  {{ person.nickname }}
                                </n-tag>
                              </span>

                              <template v-if="info.inventory_persons.length > 2">
                                <n-tag size="small">
                                  +{{ info.inventory_persons.length - 2 }}
                                </n-tag>
                              </template>
                            </div>
                          </template>
                          <template v-else>
                            <div class="text-align-end">
                              {{ getMultipleVal(item?.preset, info[item.name]) }}
                            </div>
                          </template>
                        </div>
                      </template>
                    </template>
                  </template>
                </template>
                <div class="flex py-[4px] justify-between">
                  <div class="label">
                    创建时间
                  </div>
                  <div class="text-align-end">
                    {{ formatTimestampToDateTime(info.created_at) }}
                  </div>
                </div>
              </div>
            </template>
            <template #bottom="{ info }">
              <div class="flex-end text-size-[14px]">
                <common-button-irregular text="详情" @click="jump('/product/check/info', { id: info.id })" />
              </div>
            </template>
          </product-manage-card>
          <common-page
            v-model:page="searchPage" :total="checkTotal" :limit="limits" @update:page="pull" />
        </template>
        <template v-else>
          <common-datatable :columns="cols" :list="checkList" :page-option="pageOption" :loading="tableLoading" />
        </template>
      </template>
      <template v-else>
        <common-empty width="100px" />
      </template>
    </div>
    <template v-if="myStore.id">
      <div class="cursor-pointer">
        <common-create @click="jump('/product/check/add')" />
      </div>
    </template>
    <div :id="Key" :key="Key">
      <common-filter-where v-model:show="isFilter" :data="filterData" :filter="checkFilterListToArray" @submit="submitWhere" @reset="reset">
        <template #inspector_id>
          <n-select
            v-model:value="filterData.inspector_id"
            placeholder="请选择审核人"
            :options="StoreStaffList.map(v => ({
              label: v.nickname,
              value: v.id,
            }))"
            clearable
            remote

            @focus="(e) => {
              focus(e)
              getStoreStaffListFun()
            }"
          />
        </template>
        <template #inventory_person_ids>
          <n-select
            v-model:value="filterData.inventory_person_ids"
            placeholder="请选择盘点人"
            :options="StoreStaffList.map(v => ({
              label: v.nickname,
              value: v.id,
            }))"
            clearable
            remote

            @focus="(e) => {
              focus(e)
              getStoreStaffListFun()
            }"
          />
        </template>
      </common-filter-where>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.uploadInp {
  --uno: 'text-14px px-[12px] py-[4px] rounded-[36px] flex-between text-color-light bg-#fff border-[#e6e6e8] border-1px border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)]';
  &-right {
    --uno: 'flex items-center py-[6px] px-4 rounded-[36px] text-#FFF';
    background: linear-gradient(to bottom, #1b6ceb, #6da6ff);
    box-shadow: #1111113d 0px 2px 2px 1px;
  }
}
.label {
  --uno: 'w-80px shrink-0';
}
.status-title {
  --uno: 'px-2 rounded-[8px] text-#FFF';
}
.orange {
  --uno: 'bg-[rgba(221,146,0,1)]';
}
.bule {
  --uno: 'bg-#1b6ceb';
}
.grey {
  --uno: 'bg-[#999]';
}
</style>
