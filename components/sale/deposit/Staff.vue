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
      <common-card-info title="基础信息">
        <template #info>
          <div>
            <common-layout-form>
              <n-form-item
                class="col-6"
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
                  @focus="() => {
                    props.getStaffs()
                  }"
                />
              </n-form-item>

              <n-form-item
                class="col-6"
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
                  @focus="() => {
                    props.getStaffs()
                  }"
                />
              </n-form-item>
            </common-layout-form>
          </div>
        </template>
      </common-card-info>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
