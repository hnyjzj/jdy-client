<script lang="ts" setup>
const { createAllocate, getProductWhere } = useAllocate()
const { filterList } = storeToRefs(useAllocate())
const { $toast } = useNuxtApp()
const { storesList } = storeToRefs(useStores())
const { getStoreList } = useStores()
useSeoMeta({
  title: '新增调拨单',
})

const columns = ref()
function changeStoer() {
  columns.value = []
  storesList.value.forEach((item: Stores) => {
    columns.value.push({ label: item.name, key: item.id })
  })
}
await getProductWhere()
await getStoreList({ page: 1, limit: 100 })
await changeStoer()
const params = ref({} as AllocateReq)
async function submit() {
  const res = await createAllocate(params.value as AllocateReq)
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    params.value = {} as AllocateReq
  }
  else {
    $toast.error(res.message ?? '删除失败')
  }
}
const presetToSelect = (key: keyof AllocateReq): { label: string, value: any }[] => {
  if (!key)
    return []

  const filter = filterList.value[key]
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
              <n-form>
                <n-form-item :label="filterList.method?.label">
                  <n-select
                    v-model:value="params.method"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    fable
                    :placeholder="`选择${filterList.method?.label}`"
                    :options="presetToSelect('method') "
                  />
                </n-form-item>
                <n-form-item :label="filterList.type?.label">
                  <n-select
                    v-model:value="params.type"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    fable
                    :placeholder="`选择${filterList.type?.label}`"
                    :options="presetToSelect('type') "
                  />
                </n-form-item>
                <n-form-item label="调出门店">
                  <n-select
                    v-model:value="params.from_store_id"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    fable
                    placeholder="选择调出门店"
                    :options="columns"
                  />
                </n-form-item>
                <n-form-item label="调入门店">
                  <n-select
                    v-model:value="params.from_store_id"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    fable
                    placeholder="选择调入门店"
                    :options="columns"
                  />
                </n-form-item>
                <n-form-item label="调拨原因">
                  <n-select
                    v-model:value="params.reason"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    fable
                    placeholder="选择调拨原因"
                    :options="presetToSelect('reason') "
                  />
                </n-form-item>
                <n-form-item label="备注">
                  <n-input v-model:value="params.remark" round placeholder="输入备注" />
                </n-form-item>
                <n-form-item label="状态">
                  <n-select
                    v-model:value="params.status"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    fable
                    placeholder="选择调拨状态 "
                    :options="presetToSelect('status') "
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
