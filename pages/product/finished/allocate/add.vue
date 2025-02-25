<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'

const { createAllocate, getAllocateWhere } = useAllocate()
const { allocateFilterList } = storeToRefs(useAllocate())
const { $toast } = useNuxtApp()
const { storesList } = storeToRefs(useStores())
const { getStoreList } = useStores()
const params = ref({} as AllocateReq)
const route = useRoute()
const type = ref()
if (route.query?.type) {
  type.value = route.query.type
  params.value.type = Number(type.value)
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
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    params.value = {} as AllocateReq
  }
  else {
    $toast.error(res.message ?? '创建失败')
  }
}

const presetToSelect = (key: keyof AllocateReq): { label: string, value: any }[] => {
  if (!key)
    return []

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
  console.log(11, params.value)

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
    <div class="grid-12 pt-4 pb-20">
      <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <div class="w-[40%] text-[#FFF] pl-4">
          <product-manage-company />
        </div>
        <div class="rounded-6 bg-white w-auto blur-bga top">
          <common-gradient title="新增调拨单">
            <template #body>
              <n-form ref="formRef" :model="params" :rules="rules">
                <n-form-item path="method" required :label="allocateFilterList.method?.label">
                  <n-select
                    v-model:value="params.method"
                    menu-size="large"
                    :placeholder="`选择${allocateFilterList.method?.label}`"
                    :options="presetToSelect('method')"
                    clearable
                  />
                </n-form-item>
                <n-form-item path="type" required :label="allocateFilterList.type?.label">
                  <n-select
                    v-model:value="params.type"
                    menu-size="large"
                    :placeholder="`选择${allocateFilterList.type?.label}`"
                    :options="presetToSelect('type')"
                    clearable
                    :disabled="type"
                  />
                </n-form-item>
                <n-form-item path="from_store_id" label="调出门店" required>
                  <n-select
                    v-model:value="params.from_store_id"
                    menu-size="large"
                    placeholder="选择调出门店"
                    :options="storeCol"
                    clearable
                  />
                </n-form-item>
                <n-form-item path="to_store_id" label="调入门店" required>
                  <n-select
                    v-model:value="params.to_store_id"
                    menu-size="large"
                    placeholder="选择调入门店"
                    :options="storeCol"
                    clearable
                  />
                </n-form-item>
                <n-form-item path="reason" required label="调拨原因">
                  <n-select
                    v-model:value="params.reason"
                    menu-size="large"
                    placeholder="选择调拨原因"
                    :options="presetToSelect('reason') "
                    clearable
                  />
                </n-form-item>
                <n-form-item path="remark" label="备注">
                  <n-input v-model:value="params.remark" round placeholder="输入备注" />
                </n-form-item>
                <n-form-item path="status" label="状态">
                  <n-select
                    v-model:value="params.status"
                    menu-size="large"
                    placeholder="选择调拨状态 "
                    :options="presetToSelect('status') "
                    clearable
                  />
                </n-form-item>
              </n-form>
            </template>
          </common-gradient>
        </div>
      </div>
    </div>
    <common-button-one text="添加调拨单" @confirm="handleValidateButtonClick" />
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
