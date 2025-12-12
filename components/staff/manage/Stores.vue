<script setup lang="ts">
// 搜索门店
import type { SelectOption } from 'naive-ui'

const props = withDefaults(defineProps<{
  getStoreList: (val: string) => Promise<Stores[]>
  getStoreListAll: () => Promise<Stores[]>
  getRegionList: (val: string) => Promise<Region[]>
  getRegionListAll: () => Promise<Region[]>
  showButton?: boolean
}>(), {
  showButton: true,
})
const emits = defineEmits<{
  submit: []
}>()
const { $toast } = useNuxtApp()
const storeForm = defineModel<Partial<updateStaffForm>>({ default: {
  id: '',
  identity: 1,
  store_ids: [],
  store_superior_ids: [],
  region_ids: [],
  region_superior_ids: [],
  store_admin_ids: [],
  region_admin_ids: [],
} as updateStaffForm })

const defaultform = defineModel<{ [key: string]: { label: string, value: string }[] }>('default-form', { default:
     { stores: [], stores_superior: [], regions: [], regions_superior: [] } })

// 负责门店模块
const Stores_sup = ref<SelectOption[]>([])
const loadingStores_sup = ref(false)
const StoresSupAllswitch = ref(false)
const searchStores_sup = useDebounceFn(async (query) => {
  if (StoresSupAllswitch.value) {
    loadingStores_sup.value = false
    return
  }
  const res = await props.getStoreList(query)
  loadingStores_sup.value = false
  if (res.length) {
    Stores_sup.value = res.map(item => ({
      label: item.alias || item.name,
      value: item.id,
    }))
  }
}, 500)
// 负责门店模块全选
const searchStoresSupAll = async (value: boolean) => {
  if (value) {
    loadingStores_sup.value = true
    const res = await props.getStoreListAll()
    loadingStores_sup.value = false
    if (res.length) {
      Stores_sup.value = res.map(item => ({
        label: item.alias || item.name,
        value: item.id,
      }))
      storeForm.value.store_superior_ids = res.map(item => item.id)
    }
  }
  else {
    storeForm.value.store_superior_ids = []
    Stores_sup.value = []
  }
}
if (storeForm.value.store_superior_ids?.length) {
  Stores_sup.value = defaultform.value.stores_superior
}

// 所属门店模块
const storeAllswitch = ref(false)
const Stores = ref<SelectOption[]>([])
const loadingStores = ref(false)
const searchStores = useDebounceFn(async (query) => {
  if (storeAllswitch.value) {
    loadingStores.value = false
    return
  }
  loadingStores.value = true
  const res = await props.getStoreList(query)
  loadingStores.value = false
  if (res.length) {
    Stores.value = res.map(item => ({
      label: item.alias || item.name,
      value: item.id,
    }))
  }
}, 500)
const searchStoresAll = async (value: boolean) => {
  if (value) {
    loadingStores.value = true
    const res = await props.getStoreListAll()
    loadingStores.value = false
    if (res.length) {
      Stores.value = res.map(item => ({
        label: item.alias || item.name,
        value: item.id,
      }))
      storeForm.value.store_ids = res.map(item => item.id)
    }
  }
  else {
    storeForm.value.store_ids = []
    Stores.value = []
  }
}
if (storeForm.value.store_ids?.length) {
  Stores.value = defaultform.value.stores
}

// 所属区域模块
const Regions = ref<SelectOption[]>([])
const loadingRegions = ref(false)
const RegionAllswitch = ref(false)
const searchRegions = useDebounceFn(async (query) => {
  if (RegionAllswitch.value) {
    loadingRegions.value = false
    return
  }
  loadingRegions.value = true
  const res = await props.getRegionList(query)
  loadingRegions.value = false
  if (res.length) {
    Regions.value = res.map(item => ({
      label: item.alias || item.name,
      value: item.id,
    }))
  }
}, 500)

const searchRegionsAll = async (value: boolean) => {
  if (value) {
    loadingRegions.value = true
    const res = await props.getRegionListAll()
    loadingRegions.value = false
    if (res.length) {
      Regions.value = res.map(item => ({
        label: item.alias || item.name,
        value: item.id,
      }))
      storeForm.value.region_ids = res.map(item => item.id)
    }
  }
  else {
    storeForm.value.region_ids = []
    Regions.value = []
  }
}
if (storeForm.value.region_ids?.length) {
  Regions.value = defaultform.value.regions
}

// 负责区域模块
const Regions_sup = ref<SelectOption[]>([])
const loadingRegions_sup = ref(false)
const RegionSupAllswitch = ref(false)
const searchRegions_sup = useDebounceFn(async (query) => {
  if (RegionSupAllswitch.value) {
    loadingRegions_sup.value = false
    return
  }
  loadingRegions_sup.value = true
  const res = await props.getRegionList(query)
  loadingRegions_sup.value = false
  if (res.length) {
    Regions_sup.value = res.map(item => ({
      label: item.alias || item.name,
      value: item.id,
    }))
  }
}, 500)
const searchRegionsSupAll = async (value: boolean) => {
  if (value) {
    loadingRegions_sup.value = true
    const res = await props.getRegionListAll()
    loadingRegions_sup.value = false
    if (res.length) {
      Regions_sup.value = res.map(item => ({
        label: item.alias || item.name,
        value: item.id,
      }))
      storeForm.value.region_superior_ids = res.map(item => item.id)
    }
  }
  else {
    storeForm.value.region_superior_ids = []
    Regions_sup.value = []
  }
}

if (storeForm.value.region_superior_ids?.length) {
  Regions_sup.value = defaultform.value.regions_superior
}

// 管理门店
const storeAdminAllswitch = ref(false)
const StoresAdmin = ref<SelectOption[]>([])
const loadingStoresAdmin = ref(false)
const searchStoresAdmin = useDebounceFn(async (query) => {
  if (storeAdminAllswitch.value) {
    loadingStoresAdmin.value = false
    return
  }
  loadingStoresAdmin.value = true
  const res = await props.getStoreList(query)
  loadingStoresAdmin.value = false
  if (res.length) {
    StoresAdmin.value = res.map(item => ({
      label: item.alias || item.name,
      value: item.id,
    }))
  }
}, 500)
const searchStoresAdminAll = async (value: boolean) => {
  if (value) {
    loadingStoresAdmin.value = true
    const res = await props.getStoreListAll()
    loadingStoresAdmin.value = false
    if (res.length) {
      StoresAdmin.value = res.map(item => ({
        label: item.alias || item.name,
        value: item.id,
      }))
      storeForm.value.store_admin_ids = res.map(item => item.id)
    }
  }
  else {
    storeForm.value.store_admin_ids = []
    StoresAdmin.value = []
  }
}
if (storeForm.value.store_admin_ids?.length) {
  StoresAdmin.value = defaultform.value.store_admin_ids
}

// 管理区域
const RegionsAdmin = ref<SelectOption[]>([])
const loadingRegionsAdmin = ref(false)
const RegionAllswitchAdmin = ref(false)
const searchRegionsAdmin = useDebounceFn(async (query) => {
  if (RegionAllswitchAdmin.value) {
    loadingRegionsAdmin.value = false
    return
  }
  loadingRegionsAdmin.value = true
  const res = await props.getRegionList(query)
  loadingRegionsAdmin.value = false
  if (res.length) {
    RegionsAdmin.value = res.map(item => ({
      label: item.alias || item.name,
      value: item.id,
    }))
  }
}, 500)

const searchRegionsAllAdmin = async (value: boolean) => {
  if (value) {
    loadingRegionsAdmin.value = true
    const res = await props.getRegionListAll()
    loadingRegionsAdmin.value = false
    if (res.length) {
      RegionsAdmin.value = res.map(item => ({
        label: item.alias || item.name,
        value: item.id,
      }))
      storeForm.value.region_admin_ids = res.map(item => item.id)
    }
  }
  else {
    storeForm.value.region_admin_ids = []
    RegionsAdmin.value = []
  }
}
if (storeForm.value.region_admin_ids?.length) {
  RegionsAdmin.value = defaultform.value.region_admin_ids || []
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
const clearSwitch = () => {
  RegionAllswitchAdmin.value = false
  storeAdminAllswitch.value = false
  RegionSupAllswitch.value = false
  storeAllswitch.value = false
  StoresSupAllswitch.value = false
  RegionAllswitch.value = false
}
defineExpose({
  clearSwitch,
})
</script>

<template>
  <div>
    <common-card-info title="分配门店">
      <template #info>
        <div>
          <n-form
            ref="formRef"
            :model="storeForm"
            label-placement="top"
            size="medium"
          >
            <n-grid :cols="24" :x-gap="8">
              <template v-if="[UserLevel.IdentityClerk, UserLevel.IdentityShopkeeper].includes(storeForm.identity as number)">
                <n-form-item-gi :span="12" label="所属门店" path="store_ids">
                  <div class="absolute z-1 right-0 top-[-24px]">
                    <span class="color-[#4B576D]">全选</span> <n-switch v-model:value="storeAllswitch" @update:value="searchStoresAll" />
                  </div>
                  <n-select
                    v-model:value="storeForm.store_ids"
                    multiple
                    filterable
                    placeholder="搜索门店选择"
                    :options="Stores"
                    :loading="loadingStores"
                    clearable
                    :max-tag-count="1"
                    :clear-filter-after-select="false"
                    @focus="() => {
                      loadingStores = true
                      searchStores('')
                    }"
                  />
                </n-form-item-gi>
              </template>
              <template v-if="[UserLevel.IdentityAreaManager].includes(storeForm.identity as number)">
                <n-form-item-gi :span="12" label="所属区域" path="region_ids">
                  <div class="absolute z-1 right-0 top-[-24px]">
                    <span class="color-[#4B576D]">全选 </span> <n-switch v-model:value="RegionAllswitch" @update:value="searchRegionsAll" />
                  </div>
                  <n-select
                    v-model:value="storeForm.region_ids"
                    multiple
                    filterable
                    placeholder="搜索区域选择"
                    :options="Regions"
                    :loading="loadingRegions"
                    clearable
                    :max-tag-count="1"
                    :clear-filter-after-select="false"
                    @focus="() => {
                      loadingRegions = true
                      searchRegions('')
                    }"
                  />
                </n-form-item-gi>
              </template>
              <template v-if="[UserLevel.IdentityShopkeeper].includes(storeForm.identity as number)">
                <n-form-item-gi :span="12" label="负责门店" path="store_superior_ids">
                  <div class="absolute z-1 right-0 top-[-24px]">
                    <span class="color-[#4B576D]">全选 </span> <n-switch v-model:value="StoresSupAllswitch" @update:value="searchStoresSupAll" />
                  </div>
                  <n-select
                    v-model:value="storeForm.store_superior_ids"
                    multiple
                    filterable
                    placeholder="搜索门店选择"
                    :options="Stores_sup"
                    :loading="loadingStores_sup"
                    clearable
                    :max-tag-count="1"
                    :clear-filter-after-select="false"
                    @focus="() => {
                      loadingStores_sup = true
                      searchStores_sup('')
                    }"
                  />
                </n-form-item-gi>
              </template>
              <template v-if="[UserLevel.IdentityAreaManager].includes(storeForm.identity as number)">
                <n-form-item-gi :span="12" label="负责区域" path="region_superior_ids">
                  <div class="absolute z-1 right-0 top-[-24px]">
                    <span class="color-[#4B576D]">全选 </span>  <n-switch v-model:value="RegionSupAllswitch" @update:value="searchRegionsSupAll" />
                  </div>
                  <n-select
                    v-model:value="storeForm.region_superior_ids"
                    multiple
                    filterable
                    placeholder="搜索区域选择"
                    :options="Regions_sup"
                    :loading="loadingRegions_sup"
                    clearable
                    :max-tag-count="1"
                    :clear-filter-after-select="false"
                    @focus="() => {
                      loadingRegions_sup = true
                      searchRegions_sup('')
                    }"
                  />
                </n-form-item-gi>
              </template>
              <template v-if="[UserLevel.IdentityAreaManager, UserLevel.IdentityAdmin, UserLevel.IdentityHeadquarters, UserLevel.IdentitySuperAdmin].includes(storeForm.identity as number)">
                <n-form-item-gi :span="12" label="管理门店" path="store_admin_ids">
                  <div class="absolute z-1 right-0 top-[-24px]">
                    <span class="color-[#4B576D]">全选 </span>
                    <n-switch
                      v-model:value="storeAdminAllswitch"
                      @update:value="searchStoresAdminAll" />
                  </div>
                  <n-select
                    v-model:value="storeForm.store_admin_ids"
                    multiple
                    filterable
                    placeholder="搜索门店选择"
                    :options="StoresAdmin"
                    :loading="loadingStoresAdmin"
                    clearable
                    :max-tag-count="1"
                    :clear-filter-after-select="false"
                    @focus="() => {
                      loadingStoresAdmin = true
                      searchStoresAdmin('')
                    }"
                  />
                </n-form-item-gi>
              </template>
              <template v-if="[UserLevel.IdentityAdmin, UserLevel.IdentityHeadquarters, UserLevel.IdentitySuperAdmin].includes(storeForm.identity as number)">
                <n-form-item-gi :span="12" label="管理区域" path="region_admin_ids">
                  <div class="absolute z-1 right-0 top-[-24px]">
                    <span class="color-[#4B576D]">全选 </span>
                    <n-switch
                      v-model:value="RegionAllswitchAdmin"
                      @update:value="searchRegionsAllAdmin" />
                  </div>
                  <n-select
                    v-model:value="storeForm.region_admin_ids"
                    multiple
                    filterable
                    placeholder="搜索区域选择"
                    :options="RegionsAdmin"
                    :loading="loadingRegionsAdmin"
                    clearable
                    :max-tag-count="1"
                    :clear-filter-after-select="false"
                    @focus="() => {
                      loadingRegionsAdmin = true
                      searchRegionsAdmin('')
                    }"
                  />
                </n-form-item-gi>
              </template>
            </n-grid>
            <template v-if="props.showButton">
              <div class="grid-12 px-[26px]">
                <div
                  class="font-semibold cursor-pointer col-12" uno-sm="col-8 offset-2" uno-lg="col-6 offset-3">
                  <div @click="handleValidateButtonClick">
                    <common-button-rounded content="更新门店" />
                  </div>
                </div>
              </div>
            </template>
          </n-form>
        </div>
      </template>
    </common-card-info>
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
