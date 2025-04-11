<script lang="ts" setup>
const { categoryFilterListToArray, categoryFilterList, categoryList } = storeToRefs(useAccessorieCategory())
const { getAccessorieCategoryWhere, getAccessorieCategoryList } = useAccessorieCategory()
const { addAccessorieEnter } = useAccessorieEnter()
const { $toast } = useNuxtApp()
const route = useRoute()
const router = useRouter()
useSeoMeta({
  title: '配件入库添加配件',
})
const enterId = ref()
if (route.query.id) {
  enterId.value = route.query.id
}
/** 单条添加搜索配件参数 */
const searchParams = ref({
  label: 'name',
  val: '',
} as
{
  label: keyof AccessorieCategory
  val: any
})
// categoryList.value = []
const isAddSingle = ref(false)
const selectProduct = ref([] as AccessorieCategory[])
await getAccessorieCategoryWhere()
/** 选中入库的条目 */
const selectedCategories = ref([] as AccessorieCategory['id'][])
/** 全选/全不选 */
function toggleSelectAll(event: any) {
  if (!categoryList.value?.length)
    return
  if (event.target.checked) {
    selectedCategories.value = categoryList.value.map(cat => cat.id)
  }
  else {
    selectedCategories.value = []
  }
}
const searchWhere = computed(() => {
  return categoryFilterList.value[searchParams.value.label]
})

/** 搜索要入库的配件 */
function searchAccessorie() {
  const obj = {} as Partial<AccessorieCategory>
  obj[searchParams.value.label] = searchParams.value.val
  getAccessorieCategoryList({ page: 1, limit: 20, where: { ...obj } })
}

async function addCategory() {
  if (!selectedCategories.value?.length)
    return $toast.error('请选择条目')
  const product = [] as AccessorieCategory[]
  selectedCategories.value.forEach((id: AccessorieCategory['id']) => {
    categoryList.value?.forEach((cat) => {
      if (cat.id === id) {
        product.push(JSON.parse(JSON.stringify(cat)))
      }
    })
  })
  selectProduct.value = product
  isAddSingle.value = false
}

/** 添加单条入库配件 */
async function submitProduct() {
  const products = [] as AccessorieEnterProductReq[]
  const params = {} as AccessorieEnterReq

  // 先进行验证，如果有任何产品不符合条件，则不进行提交
  for (const item of selectProduct.value) {
    if (!item.in_stock) {
      $toast.error('请填写入库数量')
      return
    }
    if (!item.in_access_fee) {
      $toast.error('请填写入库入网费')
      return
    }
  }

  // 验证通过后，收集所有产品信息
  selectProduct.value.forEach((item: AccessorieCategory) => {
    products.push({ code: item.id, stock: item.in_stock, access_fee: item.in_access_fee })
  })

  if (products.length === 0) {
    $toast.error('请添加配件礼品')
    return
  }

  params.enter_id = enterId.value
  params.products = products
  const res = await addAccessorieEnter(params)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('添加成功', 1000)
    setTimeout(() => {
      router.back()
    }, 1000)
  }
  else {
    $toast.error(res?.message ?? '添加失败')
  }
}

/**
 * 删除选中配件
 */
const debouncedDelProduct = useThrottleFn((index: number) => {
  selectProduct.value.splice(index, 1)
}, 200)
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-6 pb-18 px-4">
        <common-gradient title="添加入库配件" theme="gradient">
          <template #body>
            <template v-if="selectProduct?.length">
              <div class="text-[14px] pb-4 text-color">
                共 {{ selectProduct.length }}
              </div>
              <template v-for="(item, index) in selectProduct" :key="index">
                <div class="grid mb-3">
                  <sale-order-nesting :title="item.name" :info="item">
                    <template #left>
                      <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="debouncedDelProduct(index)" />
                    </template>
                    <template #info>
                      <div class="px-[16px]">
                        <div class="grid grid-cols-2 justify-between sm:grid-cols-3 md:grid-cols-4 gap-4">
                          <template v-for="(filter, findex) in categoryFilterListToArray" :key="findex">
                            <template v-if="filter.find">
                              <div class="flex">
                                <div class="key">
                                  {{ filter.label }}
                                </div>
                                <template v-if="filter.input === 'select'">
                                  <div class="value">
                                    {{ filter.preset[item[filter.name]] }}
                                  </div>
                                </template>
                                <template v-else-if="filter.input === 'switch'">
                                  <div class="value">
                                    {{ item[filter.name] ? '是' : '否' }}
                                  </div>
                                </template>
                                <template v-else>
                                  <div class="value">
                                    {{ item[filter.name] ? item[filter.name] : '' }}
                                  </div>
                                </template>
                              </div>
                            </template>
                          </template>
                        </div>
                        <div class="flex items-center mb-2 mt-2 ">
                          <div class="key w-[80px]">
                            入库数量
                          </div>
                          <n-input-number v-model:value="item.in_stock" placeholder="请输入入库数量" min-0 :show-button="false" />
                        </div>
                        <div class="flex items-center mb-2">
                          <div class="key w-[80px]">
                            入库入网费
                          </div>
                          <n-input-number v-model:value="item.in_access_fee" placeholder="请输入入库入网费" min-0 :show-button="false" />
                        </div>
                      </div>
                    </template>
                  </sale-order-nesting>
                </div>
              </template>
            </template>
            <template v-else>
              <common-empty size="100" />
            </template>
          </template>
        </common-gradient>
      </div>
    </common-layout-center>
    <common-model v-model="isAddSingle" title="选择配件" :show-ok="true" @confirm="addCategory">
      <div>
        <div class="grid grid-cols-[30%_60%_10%] items-center gap-2">
          <div class="">
            <n-select
              v-model:value="searchParams.label" :options="categoryFilterListToArray.map(v => ({
                label: v.label,
                value: v.name,
              }))"
              @change="searchParams.val = ''" />
          </div>
          <div>
            <template v-if="searchWhere?.input === 'text' || searchWhere?.input === 'textarea'">
              <n-input v-model:value="searchParams.val" placeholder="请搜索" @keydown.enter="searchAccessorie" />
            </template>
            <template v-if="searchWhere?.input === 'number'">
              <n-input-number v-model:value="searchParams.val" placeholder="请搜索" @keydown.enter="searchAccessorie" />
            </template>
            <template v-else-if="searchWhere?.input === 'select'">
              <n-select v-model:value="searchParams.val" :options="optonsToSelect(searchWhere.preset)" />
            </template>
          </div>
          <div @click="searchAccessorie">
            搜索
          </div>
        </div>
        <div class="m-4 category-list max-h-[400px] min-h-[200px] overflow-y-auto">
          <table>
            <thead>
              <tr class="table-color">
                <th class="sticky-left table-color px-2">
                  <input type="checkbox" :disabled="categoryList?.length === 0" @change="toggleSelectAll">
                </th>
                <template v-for="(item, index) in categoryFilterListToArray" :key="index">
                  <template v-if="item.find">
                    <th class="text-nowrap px-2 py-1">
                      {{ item.label }}
                    </th>
                  </template>
                </template>
              </tr>
            </thead>

            <template v-if="categoryList?.length">
              <tbody class="pt-2">
                <template v-for="(category, i) in categoryList" :key="i">
                  <tr class="table-color">
                    <td class="sticky-left table-color py-1 px-2">
                      <input v-model="selectedCategories" type="checkbox" :value="category.id">
                    </td>
                    <template v-for="(item, index) in categoryFilterListToArray" :key="index">
                      <template v-if="item.name === 'code'">
                        <td>
                          {{ category.id }}
                        </td>
                      </template>
                      <template v-else>
                        <template v-if="item.input === 'text' || item.input === 'textarea' || item.input === 'number'">
                          <td>
                            {{ category[item.name] }}
                          </td>
                        </template>
                        <template v-if="item.input === 'select'">
                          <td class="border-collapse">
                            {{ item.preset[category[item.name]] }}
                          </td>
                        </template>
                      </template>
                    </template>
                  </tr>
                </template>
              </tbody>
            </template>
          </table>
          <template v-if="!categoryList?.length">
            <div class="flex justify-center items-center">
              <common-empty size="100" text="暂无数据" />
            </div>
          </template>
        </div>
      </div>
    </common-model>
    <common-create @create="isAddSingle = true">
      <template #content>
        <div class="flex justify-center items-center">
          <icon name="i-icon:search" color="#fff" :size="18" />
        </div>
      </template>
    </common-create>
    <common-button-one text="添加入库" @confirm="submitProduct" />
  </div>
</template>

<style lang="scss" scoped>
.key {
  --uno: 'text-size-[14px] whitespace-nowrap color-[#666] dark:color-[#CBCDD1] mr-2';
}
.value {
  --uno: 'text-size-[14px] color-[#333] dark:color-[#fff] w-[60%]';
  text-overflow: ellipsis; /* 超出显示省略号 */
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden;
}
.category-list {
  overflow: auto;
}
.category-list table {
  border-collapse: collapse;
}
.category-list th,
.category-list td {
  text-align: center; /* 水平居中 */
  vertical-align: middle; /* 垂直居中（可选） */
}
.sticky-left {
  --uno: 'sticky left-0 z-10';
}
.table-color {
  --uno: 'dark:bg-[rgba(0,0,0,0.8)] bg-[#F1F5FE]';
}
</style>
