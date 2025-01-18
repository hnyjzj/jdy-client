<script lang="ts" setup>
const { createAllocate, getProductWhere } = useAllocate()
const { allocateFilterList } = storeToRefs(useAllocate())
const { $toast } = useNuxtApp()
const { storesList } = storeToRefs(useStores())
const { getStoreList } = useStores()

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

await getProductWhere()
await getStoreList({ page: 1, limit: 100 })
await changeStoer()
const params = ref({} as AllocateReq)
async function submit() {
  if (!params.value.method) {
    return $toast.error('请选择调拨方式')
  }
  if (!params.value.type) {
    return $toast.error('请选择仓库类型')
  }
  if (!params.value.reason) {
    return $toast.error('请选择调拨原因')
  }
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
  return Object.keys(filter.preset).map((key) => {
    switch (filter.type) {
      case 'number':
        return {
          label: filter.preset[key],
          value: Number(key),
        }
      default:
        return {
          label: filter.preset[key],
          value: key,
        }
    }
  })
}
</script>

<template>
  <div>
    <div class="grid-12 pt-4 pb-20">
      <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <div class="w-[40%]">
          <product-manage-company />
        </div>
        <div class="rounded-6 bg-white w-auto blur-bga top">
          <common-gradient title="新增调拨单">
            <template #body>
              <n-form :model="params">
                <n-form-item path="method" required :label="allocateFilterList.method?.label">
                  <n-select
                    v-model:value="params.method"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    :placeholder="`选择${allocateFilterList.method?.label}`"
                    :options="presetToSelect('method')"

                    clearable
                  />
                </n-form-item>
                <n-form-item path="type" required :label="allocateFilterList.type?.label">
                  <n-select
                    v-model:value="params.type"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    :placeholder="`选择${allocateFilterList.type?.label}`"
                    :options="presetToSelect('type')"
                    clearable
                  />
                </n-form-item>
                <n-form-item label="调出门店">
                  <n-select
                    v-model:value="params.from_store_id"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    placeholder="选择调出门店"
                    :options="storeCol"
                    clearable
                  />
                </n-form-item>
                <n-form-item label="调入门店">
                  <n-select
                    v-model:value="params.to_store_id"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    placeholder="选择调入门店"
                    :options="storeCol"
                    clearable
                  />
                </n-form-item>
                <n-form-item path="reason" required label="调拨原因">
                  <n-select
                    v-model:value="params.reason"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    placeholder="选择调拨原因"
                    :options="presetToSelect('reason') "
                    clearable
                  />
                </n-form-item>
                <n-form-item path="remark" label="备注">
                  <n-input v-model:value="params.remark" round placeholder="输入备注" />
                </n-form-item>
                <n-form-item label="状态">
                  <n-select
                    v-model:value="params.status"
                    :default-value="0 || '' || undefined || null"
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
    <common-button-one text="添加调拨单" @confirm="submit" />
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
