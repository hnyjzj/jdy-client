<script setup lang="ts">
// 搜索门店
import type { SelectOption } from 'naive-ui'

const props = defineProps<{
  getStoreList: (val: string) => Promise<Stores[]>
  getRegionList: (val: string) => Promise<Region[]>
}>()
const emits = defineEmits<{
  submit: []
}>()
const { $toast } = useNuxtApp()
const storeForm = defineModel({ default: {
  id: '',
  store_ids: [],
  store_superior_ids: [],
  region_ids: [],
  region_superior_ids: [],
} as updateStaffForm })

const defaultform = defineModel<{ [key: string]: { label: string, value: string }[] }>('default-form', { default:
     { stores: [], stores_superior: [], regions: [], regions_superior: [] } })

// 负责门店模块
const Stores_sup = ref<SelectOption[]>([])
const loadingStores_sup = ref(false)
const searchStores_sup = useDebounceFn(async (query) => {
  const res = await props.getStoreList(query)
  loadingStores_sup.value = false
  if (res.length) {
    Stores_sup.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)
if (storeForm.value.store_superior_ids?.length) {
  Stores_sup.value = defaultform.value.stores_superior
}
// 所属门店模块
const Stores = ref<SelectOption[]>([])
const loadingStores = ref(false)
const searchStores = useDebounceFn(async (query) => {
  loadingStores.value = true
  const res = await props.getStoreList(query)
  loadingStores.value = false
  if (res.length) {
    Stores.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)
if (storeForm.value.store_ids?.length) {
  Stores.value = defaultform.value.stores
}

// 所属区域模块
const Regions = ref<SelectOption[]>([])
const loadingRegions = ref(false)
const searchRegions = useDebounceFn(async (query) => {
  loadingRegions.value = true
  const res = await props.getRegionList(query)
  loadingRegions.value = false
  if (res.length) {
    Regions.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)
if (storeForm.value.region_ids?.length) {
  Regions.value = defaultform.value.regions
}

// 负责区域模块
const Regions_sup = ref<SelectOption[]>([])
const loadingRegions_sup = ref(false)
const searchRegions_sup = useDebounceFn(async (query) => {
  loadingRegions_sup.value = true
  const res = await props.getRegionList(query)
  loadingRegions_sup.value = false
  if (res.length) {
    Regions_sup.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)
if (storeForm.value.region_superior_ids?.length) {
  Regions_sup.value = defaultform.value.regions_superior
}

const formRef = ref()
function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      emits('submit')
    }
    else {
      $toast.error('验证失败')
    }
  })
}
</script>

<template>
  <div>
    <div class="">
      <common-fold title="分配门店" from-color="#9EBAF9" to-color="#fff">
        <div class="p-[16px]">
          <n-form
            ref="formRef"
            :model="storeForm"
            label-placement="top"
            size="medium"
          >
            <n-grid :cols="24" :x-gap="8">
              <n-form-item-gi :span="12" label="所属门店" path="store_ids">
                <n-select
                  v-model:value="storeForm.store_ids"
                  multiple
                  filterable
                  placeholder="搜索门店选择"
                  :options="Stores"
                  :loading="loadingStores"
                  clearable
                  remote
                  :max-tag-count="1"
                  :clear-filter-after-select="false"
                  @search="searchStores"
                  @focus="() => {
                    loadingStores = true
                    searchStores('')
                  }"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="负责门店" path="store_superior_ids">
                <n-select
                  v-model:value="storeForm.store_superior_ids"
                  multiple
                  filterable
                  placeholder="搜索门店选择"
                  :options="Stores_sup"
                  :loading="loadingStores_sup"
                  clearable
                  remote
                  :max-tag-count="1"
                  :clear-filter-after-select="false"
                  @search="searchStores_sup"
                  @focus="() => {
                    loadingStores_sup = true
                    searchStores_sup('')
                  }"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="所属区域" path="region_ids">
                <n-select
                  v-model:value="storeForm.region_ids"
                  multiple
                  filterable
                  placeholder="搜索区域选择"
                  :options="Regions"
                  :loading="loadingRegions"
                  clearable
                  remote
                  :max-tag-count="1"
                  :clear-filter-after-select="false"
                  @search="searchRegions"
                  @focus="() => {
                    loadingRegions = true
                    searchRegions('')
                  }"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="负责区域" path="region_superior_ids">
                <n-select
                  v-model:value="storeForm.region_superior_ids"
                  multiple
                  filterable
                  placeholder="搜索区域选择"
                  :options="Regions_sup"
                  :loading="loadingRegions_sup"
                  clearable
                  remote
                  :max-tag-count="1"
                  :clear-filter-after-select="false"
                  @search="searchRegions_sup"
                  @focus="() => {
                    loadingRegions_sup = true
                    searchRegions_sup('')
                  }"
                />
              </n-form-item-gi>
            </n-grid>

            <div class="grid-12 px-[26px]">
              <div
                class="font-semibold pb-[26px] cursor-pointer col-12" uno-sm="col-8 offset-2" uno-lg="col-6 offset-3">
                <div @click="handleValidateButtonClick">
                  <common-button-rounded content="确定" />
                </div>
              </div>
            </div>
          </n-form>
        </div>
      </common-fold>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-item {
  --uno: 'h-full w-full border-none bg-transparent dark:placeholder-color-[#fff]';
}
.label {
  --uno: 'pb-[8px] dark:color-#fff';
}

.n-radio .n-radio__dot.n-radio__dot--checked {
  box-shadow: inset 0 0 0 1px #0068ff;
}
</style>
