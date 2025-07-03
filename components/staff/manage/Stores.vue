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
const Stores = ref<SelectOption[]>([])
if (storeForm.value.store_ids?.length) {
  Stores.value = defaultform.value.stores
}
if (storeForm.value.store_superior_ids?.length) {
  Stores.value = defaultform.value.stores_superior
}
const loadingStores = ref(false)
const getStores = useDebounceFn(async (query) => {
  const res = await props.getStoreList(query)
  loadingStores.value = false
  if (res.length) {
    Stores.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)
const searchStores = (query: string) => {
  loadingStores.value = true
  getStores(query)
}
const Regions = ref<SelectOption[]>([])
if (storeForm.value.region_ids?.length) {
  Regions.value = defaultform.value.regions
}
if (storeForm.value.region_superior_ids?.length) {
  Regions.value = defaultform.value.regions_superior
}
const loadingRegions = ref(false)
const getRegions = useDebounceFn(async (query) => {
  const res = await props.getRegionList(query)
  loadingRegions.value = false
  if (res.length) {
    Regions.value = res.map(item => ({
      label: item.name,
      value: item.id,
    }))
  }
}, 500)
const searchRegions = (query: string) => {
  loadingRegions.value = true
  getRegions(query)
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
                  @focus="focus"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="负责门店" path="store_superior_ids">
                <n-select
                  v-model:value="storeForm.store_superior_ids"
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
                  @focus="focus"
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
                  @focus="focus"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="12" label="负责区域" path="region_superior_ids">
                <n-select
                  v-model:value="storeForm.region_superior_ids"
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
                  @focus="focus"
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
