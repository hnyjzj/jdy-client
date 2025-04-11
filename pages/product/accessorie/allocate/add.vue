<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'

const { $toast } = useNuxtApp()
const { createAccessorieAllocate, getAccessorieAllocateWhere } = useAccessorieAllocate()
const { accessorieAllocateFilterListToArray } = storeToRefs(useAccessorieAllocate())
const { myStoreList, storesList } = storeToRefs(useStores())
const { getStoreList } = useStores()
const { getFinishedEnterInfo } = useFinishedEnter()
const { enterInfo } = storeToRefs(useFinishedEnter())

const params = ref({} as AccessorieAllocateReq)
const route = useRoute()
const router = useRouter()
const type = ref()
const enterId = ref()
if (route.query?.type) {
  type.value = route.query.type
  params.value.type = Number(type.value)
}

if (route.query?.enter_id) {
  enterId.value = route.query.enter_id
  await getFinishedEnterInfo(enterId.value)
  params.value.enter_id = route.query.enter_id as string
  params.value.from_store_id = enterInfo.value?.store_id
  params.value.method = 1
  params.value.type = 1
  params.value.remark = `入库整单调拨[${enterId.value}]`
}
else {
  if (myStoreList.value?.length > 0)
    params.value.from_store_id = myStoreList.value[0].id
}

useSeoMeta({
  title: '新增调拨单',
})

/** 门店选择列表 */
const storeCol = ref()

function changeStoer() {
  storeCol.value = []
  storesList.value.forEach((item: Stores) => {
    storeCol.value.push({ label: item.name, value: item.id })
  })
}

await getAccessorieAllocateWhere()
await getStoreList({ page: 1, limit: 20 })
await changeStoer()
async function submit() {
  const res = await createAccessorieAllocate(params.value as AccessorieAllocateReq)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    params.value = {} as AccessorieAllocateReq
    router.back()
  }
  else {
    $toast.error(res?.message ?? '创建失败')
  }
}

const rules = ref<FormRules>({})

function forRules() {
  accessorieAllocateFilterListToArray.value.forEach((item) => {
    if (item.required) {
      if (item.input === 'text') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
        }
      }
      if (item.input === 'number') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
          type: 'number',
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
forRules()
const formRef = ref<FormInst | null>(null)

function handleValidateButtonClick() {
  formRef.value?.validate((error) => {
    if (!error) {
      submit()
    }
    else {
      $toast.error('请完善信息')
    }
  })
}
const canShowFilter = (item: FilterWhere<AccessorieAllocate>) => {
  if (!item.create) {
    return false
  }

  if (item.condition) {
    return !item.condition?.some((i) => {
      switch (i.operator) {
        case '=':
          return params.value[i.key as keyof AccessorieAllocateReq] !== i.value

        default:
          return false
      }
    })
  }

  return true
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-4 pb-20">
        <div class="flex flex-col gap-4">
          <div class="w-[40%] text-[#FFF] pl-4">
            <product-manage-company />
          </div>
          <div class="rounded-6 bg-white w-auto blur-bga top">
            <common-gradient title="新增调拨单">
              <template #body>
                <n-form ref="formRef" :model="params" :rules="rules">
                  <n-grid :cols="24" :x-gap="8">
                    <template v-for="(item, index) in accessorieAllocateFilterListToArray" :key="index">
                      <template v-if="item.create && canShowFilter(item)">
                        <n-form-item-gi :span="12" :path="item.name" :required="item.required" :label="item.label">
                          <template v-if="item.input === 'select'">
                            <n-select
                              v-model:value="params[item.name as keyof AccessorieAllocateReq]"
                              menu-size="large"
                              :placeholder="`选择${item.label}`"
                              :options="optonsToSelect(item.preset)"
                              clearable
                            />
                          </template>
                          <template v-if="item.input === 'text'">
                            <n-input v-model:value="params[item.name as keyof AccessorieAllocateReq]" round :placeholder="`输入${item.label}`" />
                          </template>
                          <template v-if="item.input === 'number'">
                            <div class="w-[100%]">
                              <n-input-number v-model:value="params[item.name as keyof AccessorieAllocateReq]" round :placeholder="`输入${item.label}`" />
                            </div>
                          </template>
                          <template v-if="item.input === 'switch'">
                            <n-switch v-model:value="params[item.name as keyof AccessorieAllocateReq]" :style="{ 'border-radius': '20px' }" round />
                          </template>
                          <template v-if="item.input === 'textarea'">
                            <n-input v-model:value="params[item.name as keyof AccessorieAllocateReq]" :placeholder="`输入${item.label}`" type="textarea" maxlength="255" round :autosize="{ minRows: 2, maxRows: 3 }" />
                          </template>
                          <template v-if="item.input === 'search'">
                            <template v-if="item.name === 'from_store_id' || item.name === 'to_store_id'">
                              <n-select
                                v-model:value="params[item.name as keyof AccessorieAllocateReq]"
                                :placeholder="`输入${item.label}`"
                                :options="storesList.map(v => ({
                                  label: v.name,
                                  value: v.id,
                                }))"
                                clearable
                                size="large"
                                remote
                                @focus="() => { getStoreList({ page: 1, limit: 20 }) }"
                              />
                            </template>
                          </template>
                        </n-form-item-gi>
                      </template>
                    </template>
                  </n-grid>
                </n-form>
              </template>
            </common-gradient>
          </div>
        </div>
      </div>
    </common-layout-center>
    <div class="fixed bottom-0 left-0 w-full py-4 blur-bgc px-8" uno-sm="px-0">
      <common-layout-center>
        <common-button-rounded content="添加调拨单" @button-click="handleValidateButtonClick" />
      </common-layout-center>
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
