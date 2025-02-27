<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'

// const { addEnter } = useEnter()
const { $toast } = useNuxtApp()
const { storesList, myStore } = storeToRefs(useStores())
const { getStoreList } = useStores()
const { getProductWhere, importProduct } = useProductManage()
const { filterListToArray, filterList } = storeToRefs(useProductManage())
const route = useRoute()
const router = useRouter()
useSeoMeta({
  title: '新增入库单',
})

const params = ref({} as Product)
const isDisables = ref()
if (route.query.type) {
  params.value.type = Number(route.query.type)
  isDisables.value = ['type']
}
const formRef = ref<FormInst | null>(null)
const rules = ref<FormRules>({})

function forRules() {
  filterListToArray.value.forEach((item) => {
    if (item.required) {
      if (item.input === 'text') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
        }
      }
      if (item.input === 'select') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请选择${item.label}`,
          type: 'number',
        }
      }
    }
  })
}

function handleValidateButtonClick() {
  formRef.value?.validate((error) => {
    if (!error) {
      submit()
    }
    else {
      $toast.error('请入库完善信息')
    }
  })
}
/** 门店选择列表 */
const storeCol = ref()
function changeStore() {
  storeCol.value = []
  storesList.value.forEach((item: Stores) => {
    storeCol.value.push({ label: item.name, value: item.id })
  })
}
await getProductWhere()
await getStoreList({ page: 1, limit: 20 })
await changeStore()
forRules()
async function submit() {
  const impParams = {
    products: [params.value],
    store_id: myStore.value.id,
  }
  const res = await importProduct(impParams)
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    params.value = {} as Product
    setTimeout(() => {
      router.back()
    }, 1000)
  }
  else {
    $toast.error(res.message ?? '创建失败')
  }
}
const presetToSelect = (key: keyof Product) => {
  if (!key)
    return []
  const filter = filterList.value[key]
  if (!filter)
    return []
  if (!filter.preset) {
    return []
  }
  return optonsToSelect(filter.preset)
}
</script>

<template>
  <div>
    <div class="grid-12 pt-4 pb-22">
      <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <div class="w-[40%] text-[#FFF] pl-4">
          <product-manage-company />
        </div>
        <div class="rounded-6 bg-white w-auto blur-bga">
          <common-gradient title="新增入库">
            <template #body>
              <n-form ref="formRef" :model="params" :rules="rules">
                <n-grid :cols="24" :x-gap="8">
                  <template v-for="(item, index) in filterListToArray" :key="index">
                    <n-form-item-gi :span="12" :path="item.name" :required="item.required" :label="item.label">
                      <template v-if="item.input === 'select'">
                        <n-select
                          v-model:value="params[item.name]"
                          menu-size="large"
                          :placeholder="`选择${item.label}`"
                          :options="presetToSelect(item.name)"
                          clearable
                          :disabled="isDisables?.includes(item.name)"
                        />
                      </template>
                      <template v-if="item.input === 'text'">
                        <n-input v-model:value="params[item.name]" round :placeholder="`输入${item.label}`" />
                      </template>
                      <template v-if="item.input === 'number'">
                        <div class="w-[100%]">
                          <n-input-number v-model:value="params[item.name]" round :placeholder="`输入${item.label}`" />
                        </div>
                      </template>
                      <template v-if="item.input === 'switch'">
                        <n-switch v-model:value="params[item.name]" :style="{ 'border-radius': '20px' }" round />
                      </template>
                      <template v-if="item.input === 'textarea'">
                        <n-input v-model:value="params[item.name]" :placeholder="`输入${item.label}`" type="textarea" maxlength="255" round :autosize="{ minRows: 2, maxRows: 3 }" />
                      </template>
                    </n-form-item-gi>
                  </template>
                </n-grid>
              </n-form>
            </template>
          </common-gradient>
        </div>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 w-full px-8 py-4 blur-bgc">
      <common-button-rounded content="新增入库" @button-click="handleValidateButtonClick" />
    </div>
  </div>
</template>

<style>
.n-base-selection {
  border-radius: 20px;
}
.n-base-selection-label {
  height: 40px !important;
}
.n-input-wrapper {
  border-radius: 20px !important;
}
</style>

<style lang="scss" scoped>
</style>
