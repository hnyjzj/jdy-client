<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'

const { createAllocate, getAllocateWhere } = useAllocate()
const { allocateFilterList } = storeToRefs(useAllocate())
const { $toast } = useNuxtApp()
const { storesList } = storeToRefs(useStores())
const { myStoreList } = storeToRefs(useStores())
const { getStoreList } = useStores()
const { getFinishedEnterInfo } = useFinishedEnter()
const { enterInfo } = storeToRefs(useFinishedEnter())

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

await getAllocateWhere()
await getStoreList({ page: 1, limit: 20 })
await changeStoer()
async function submit() {
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
  if (!myStoreList.value.length) {
    return $toast.error('暂未分配门店')
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
        <div class="flex flex-col gap-4">
          <div class="w-[40%] text-[#FFF] pl-4">
            <product-manage-company />
          </div>
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
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" path="type" required :label="allocateFilterList.type?.label">
                      <n-select
                        v-model:value="params.type"
                        menu-size="large"
                        :placeholder="`选择${allocateFilterList.type?.label}`"
                        :options="presetToSelect('type')"
                        clearable
                        :disabled="type"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" path="to_store_id" label="调入门店" required>
                      <n-select
                        v-model:value="params.to_store_id"
                        menu-size="large"
                        placeholder="选择调入门店"
                        :options="storeCol"
                        clearable
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" path="reason" required label="调拨原因">
                      <n-select
                        v-model:value="params.reason"
                        menu-size="large"
                        placeholder="选择调拨原因"
                        :options="presetToSelect('reason') "
                        clearable
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" path="remark" label="备注">
                      <n-input v-model:value="params.remark" round placeholder="输入备注" />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" path="status" label="状态">
                      <n-select
                        v-model:value="params.status"
                        menu-size="large"
                        placeholder="选择调拨状态 "
                        :options="presetToSelect('status') "
                        clearable
                      />
                    </n-form-item-gi>
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
