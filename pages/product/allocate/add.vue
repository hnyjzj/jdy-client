<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'

const { createAllocate, getAllocateWhere } = useAllocate()
const { allocateFilterList } = storeToRefs(useAllocate())
const { $toast } = useNuxtApp()
const { storesList, myStore } = storeToRefs(useStores())
const { getStoreList } = useStores()
const { getFinishedEnterInfo } = useFinishedEnter()
const { enterInfo } = storeToRefs(useFinishedEnter())
const loading = ref(false)
const params = ref({} as AllocateReq)
const route = useRoute()
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
  params.value.from_store_id = myStore.value.id
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

await getAllocateWhere()
await getStoreList({ page: 1, limit: 20 })
await changeStoer()

/** 创建调拨单 */
async function submit() {
  loading.value = true
  try {
    params.value.from_store_id = myStore.value.id
    const res = await createAllocate(params.value as AllocateReq)
    if (res?.code === HttpCode.SUCCESS) {
      $toast.success('创建成功')
      params.value = {} as AllocateReq
      jump('/product/allocate')
    }
    else {
      $toast.error(res?.message ?? '创建失败')
    }
  }
  finally {
    loading.value = false
  }
}

const presetToSelect = (key: keyof AllocateReq): { label: string, value: any }[] => {
  if (!key)
    return []
  if (key === 'enter_id') {
    return []
  }
  const filter = allocateFilterList.value[key]
  if (!filter)
    return []
  if (!filter.preset) {
    return []
  }
  return optonsToSelect(filter.preset)
}
const formRef = ref<FormInst | null>(null)
const rules = ref<FormRules>({
  method: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择调拨方法',
    type: 'number',
  },
  type: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择仓库类型',
    type: 'number',
  },
  reason: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择调拨原因',
    type: 'number',
  },
  from_store_id: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择调出门店',
    type: 'string',
  },
  to_store_id: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择调入门店',
    type: 'string',
  },
},
)
function handleValidateButtonClick() {
  if (!myStore.value?.id) {
    return $toast.error('暂未分配门店')
  }
  if (params.value.from_store_id === params.value.to_store_id) {
    return $toast.error('调出门店与调入门店不能相同')
  }
  formRef.value?.validate((error) => {
    if (!error) {
      submit()
    }
    else {
      $toast.error('请完善调拨信息')
    }
  })
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-4 pb-20">
        <div class="mb-4 w-[40%]">
          <product-manage-company class="text-[#FFF]" />
        </div>
        <div class="flex flex-col gap-4">
          <div class="rounded-6 bg-white w-auto blur-bga top">
            <common-gradient title="新增调拨单">
              <template #body>
                <n-form ref="formRef" :model="params" :rules="rules">
                  <n-grid :cols="24" :x-gap="8">
                    <n-form-item-gi :span="12" path="method" required :label="allocateFilterList.method?.label">
                      <n-select
                        v-model:value="params.method"
                        menu-size="large"
                        :placeholder="`选择${allocateFilterList.method?.label}`"
                        :options="presetToSelect('method')"
                        clearable
                        @focus="focus"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" path="type" required label="仓库类型">
                      <n-select
                        v-model:value="params.type"
                        menu-size="large"
                        placeholder="选择仓库类型"
                        :options="optonsToSelect(typePreset)"
                        clearable
                        :disabled="type"
                        @focus="focus"
                      />
                    </n-form-item-gi>
                    <template v-if="params.method === 1">
                      <n-form-item-gi :span="12" path="to_store_id" label="调入门店" required>
                        <n-select
                          v-model:value="params.to_store_id"
                          menu-size="large"
                          placeholder="选择调入门店"
                          :options="storeCol"
                          clearable
                          @focus="focus"
                        />
                      </n-form-item-gi>
                    </template>
                    <n-form-item-gi :span="12" path="reason" required label="调拨原因">
                      <n-select
                        v-model:value="params.reason"
                        menu-size="large"
                        placeholder="选择调拨原因"
                        :options="presetToSelect('reason') "
                        clearable
                        @focus="focus"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" path="remark" label="备注">
                      <n-input v-model:value="params.remark" type="textarea" round placeholder="输入备注" @focus="focus" />
                    </n-form-item-gi>
                  </n-grid>
                </n-form>
              </template>
            </common-gradient>
          </div>
        </div>
      </div>
    </common-layout-center>
    <common-loading v-model="loading" />
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
