<script lang="ts" setup>
const props = withDefaults(defineProps<{
  storeStaff: StoresStaff[]
  getStaff: () => void
  filterList: Where<otherOrderWhere>
}>(), {

})
const formData = defineModel<otherOrderCreate>('form', { default: {} })
</script>

<template>
  <div class="pb-[16px]">
    <common-fold title="收支信息" :is-collapse="false">
      <div class="p-[16px]">
        <n-grid :cols="24" :x-gap="8">
          <n-form-item-gi :span="12" label="收支类型" path="type">
            <n-radio-group v-model:value="formData.type" name="radiogroup">
              <n-space>
                <n-radio
                  v-for="(items, index) in optonsToSelect(props.filterList.type?.preset)" :key="index" :value="items.value" :style="{
                    '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                    '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                    '--n-dot-color-active': '#0068ff',
                    '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
                  {{ items.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item-gi>
          <n-form-item-gi
            :span="12"
            label="主销导购" label-placement="top" class=""
            path="clerk_id"
            :rule="{
              required: true,
              message: `请选择导购员`,
              trigger: ['change', 'blur'],
            }">
            <n-select
              v-model:value="formData.clerk_id"
              placeholder="请选择导购员"
              :options="props.storeStaff.map(v => ({
                label: v.nickname,
                value: v.id,
              }))"
              clearable
              remote
              @focus="() => { props.getStaff() }"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="收支内容" path="content">
            <n-input v-model:value="formData.content" placeholder="请输入收支内容" />
          </n-form-item-gi>

          <n-form-item-gi :span="12" label="收支来源" path="source">
            <n-select
              v-model:value="formData.source"
              placeholder="请选择收支来源"
              :options="optonsToSelect(props.filterList.source?.preset) "
              clearable
              remote

            />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="关联销售单">
            <n-input v-model:value="formData.order_id" placeholder="请输入销售单号" />
          </n-form-item-gi>
        </n-grid>
      </div>
    </common-fold>
  </div>
</template>

<style lang="scss" scoped>

</style>
