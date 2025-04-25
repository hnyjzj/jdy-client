<script lang="ts" setup>
const props = defineProps<{
  getStaffs: () => void
  staffs: StoresStaff[]
}>()
const formData = defineModel<DepositOrder>('formData', { default: {} })
</script>

<template>
  <div>
    <div class="pb-[16px]">
      <common-fold title="基础信息" :is-collapse="false">
        <div class="p-[16px]">
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi
              :span="12"
              label="收银员" label-placement="top" path="cashier_id"
            >
              <n-select
                v-model:value="formData.cashier_id"
                placeholder="请输入收银员"
                :options="props.staffs.map(v => ({
                  label: v.nickname,
                  value: v.id,
                }))"
                clearable
                remote
                @focus="() => { props.getStaffs() }"
              />
            </n-form-item-gi>

            <n-form-item-gi
              :span="12"
              label="主销导购" label-placement="top"
              path="clerk_id"
              :rule="{
                required: true,
                message: `请选择导购员`,
                trigger: ['change', 'blur'],
              }"
            >
              <n-select
                v-model:value="formData.clerk_id"
                placeholder="请选择"
                :options="props.staffs.map(v => ({
                  label: v.nickname,
                  value: v.id,
                }))"
                clearable
                remote
                @focus="() => { props.getStaffs() }"
              />
            </n-form-item-gi>
          </n-grid>
        </div>
      </common-fold>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
