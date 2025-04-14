<script lang="ts" setup>
const { addAccessorieAllocate } = useAccessorieAllocate()

const { accessorieList } = storeToRefs(useAccessorie())
const { getAccessorieList, getAccessorieWhere } = useAccessorie()
const { categoryFilterList, categoryFilterListToArray } = storeToRefs(useAccessorieCategory())
const { getAccessorieCategoryWhere } = useAccessorieCategory()
const { $toast } = useNuxtApp()
const route = useRoute()
const router = useRouter()
useSeoMeta({
  title: '配件调拨添加配件礼品',
})
const allcateId = ref()
if (route.query.id) {
  allcateId.value = route.query.id
}
/** 单条添加搜索配件参数 */
const searchParams = ref({
  label: 'code',
  val: '',
} as
{
  label: keyof ProductAccessories
  val: any
})
const options = ref([
  { label: '配件条目', value: 'code' },
  { label: '配件名称', value: 'name' },
])
const isAddSingle = ref(false)
const selectProduct = ref([] as ProductAccessories[])
await getAccessorieCategoryWhere()
await getAccessorieWhere()
/** 选中入库的条目 */
const selectedCategories = ref([] as ProductAccessories['id'][])
/** 全选/全不选 */
function toggleSelectAll(event: any) {
  if (!accessorieList.value?.length)
    return
  if (event.target.checked) {
    selectedCategories.value = accessorieList.value.map(cat => cat.id)
  }
  else {
    selectedCategories.value = []
  }
}

/** 搜索要入库的配件 */
async function searchAccessorie() {
  selectProduct.value = []
  accessorieList.value = []

  const obj = {} as Partial<ProductAccessories>
  obj[searchParams.value.label] = searchParams.value.val
  await getAccessorieList({ page: 1, limit: 20, where: { ...obj } })
}

/** 选择需要添加的配件 */
async function addCategory() {
  if (!selectedCategories.value?.length)
    return $toast.error('请选择配件礼品')
  const product = [] as ProductAccessories[]
  selectedCategories.value.forEach((id: ProductAccessories['id']) => {
    accessorieList.value?.forEach((cat) => {
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
  const products = [] as AddAccessorieAllocateProduct[]
  const params = {} as AddAccessorieAllocateReq

  // 先进行验证，如果有任何产品不符合条件，则不进行提交
  for (const item of selectProduct.value) {
    if (!item.quantity) {
      $toast.error('请填写调拨数量')
      return
    }
  }

  // 验证通过后，收集所有产品信息
  selectProduct.value.forEach((item: ProductAccessories) => {
    products.push({ product_id: item.id, quantity: item.quantity })
  })

  if (products.length === 0) {
    $toast.error('选择配件礼品')
    return
  }

  params.id = allcateId.value
  params.products = products

  const res = await addAccessorieAllocate(params)
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
        <common-gradient title="选择配件礼品" theme="gradient">
          <template #body>
            <template v-if="selectProduct?.length">
              <div class="text-[14px] pb-4 text-color">
                共 {{ selectProduct.length }}
              </div>
              <template v-for="(item, index) in selectProduct" :key="index">
                <div class="grid mb-3">
                  <sale-order-nesting :title="item.category.name" :info="item">
                    <template #left>
                      <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="debouncedDelProduct(index)" />
                    </template>
                    <template #info>
                      <div class="px-[16px]">
                        <div class="grid grid-cols-2 justify-between sm:grid-cols-3 md:grid-cols-3 gap-4">
                          <template v-for="(filter, findex) in categoryFilterListToArray" :key="findex">
                            <template v-if="filter.create">
                              <div class="flex">
                                <div class="key">
                                  {{ filter.label }}
                                </div>
                                <template v-if="filter.input === 'select'">
                                  <div class="value">
                                    {{ filter.preset[item.category[filter.name]] || '--' }}
                                  </div>
                                </template>
                                <template v-else>
                                  <div class="value">
                                    {{ item.category[filter.name] || '--' }}
                                  </div>
                                </template>
                              </div>
                            </template>
                          </template>
                          <div class="flex">
                            <div class="key">
                              库存
                            </div>
                            <div class="value">
                              {{ item.stock }}
                            </div>
                            <div class="value" />
                          </div>
                        </div>
                        <div class="flex items-center mb-2 mt-2 ">
                          <div class="key w-[80px]">
                            调拨数量
                          </div>
                          <n-input-number v-model:value="item.quantity" placeholder="请输入调拨数量" min-0 :max="item.stock" :show-button="false" />
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
              v-model:value="searchParams.label" :options="options"
              @change="searchParams.val = ''" />
          </div>
          <div>
            <n-input v-model:value="searchParams.val" placeholder="请搜索" @keydown.enter="searchAccessorie" />
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
                  <input type="checkbox" :disabled="accessorieList?.length === 0" @change="toggleSelectAll">
                </th>
                <template v-for="(filter, i) in categoryFilterListToArray" :key="i">
                  <template v-if="filter.create">
                    <th class="whitespace-nowrap px-2 py-1">
                      {{ filter.label }}
                    </th>
                  </template>
                </template>
              </tr>
            </thead>

            <template v-if="accessorieList?.length">
              <tbody class="pt-2">
                <template v-for="(category, i) in accessorieList" :key="i">
                  <tr class="table-color">
                    <td class="sticky-left table-color py-1 px-2">
                      <input v-model="selectedCategories" type="checkbox" :value="category.id">
                    </td>
                    <template v-for="(filter, i) in categoryFilterListToArray" :key="i">
                      <template v-if="filter.create">
                        <template v-if="filter.input === 'select'">
                          <td class="whitespace-nowrap px-2 py-1">
                            {{ categoryFilterList[filter.name]?.preset[category.category[filter.name]] || '--' }}
                          </td>
                        </template>
                        <template v-else>
                          <td class="whitespace-nowrap px-2 py-1">
                            {{ category.category[filter.name] || '--' }}
                          </td>
                        </template>
                      </template>
                    </template>
                  </tr>
                </template>
              </tbody>
            </template>
          </table>
          <template v-if="!accessorieList?.length">
            <div class="flex justify-center items-center">
              <common-empty size="100" text="暂无数据" />
            </div>
          </template>
        </div>
      </div>
    </common-model>
    <common-create @create="accessorieList = [];searchParams.val = '';isAddSingle = true">
      <template #content>
        <div class="flex justify-center items-center">
          <icon name="i-icon:search" color="#fff" :size="18" />
        </div>
      </template>
    </common-create>
    <common-button-one text="添加调拨配件" @confirm="submitProduct" />
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
