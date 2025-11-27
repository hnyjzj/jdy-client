<script lang="ts" setup>
const props = defineProps<{
  staffs: StoresStaff[]
  areaBorder: boolean
  getStaff: () => void
}>()
const formData = defineModel('form', { default: {} as serviceOrederCreate })
const region = defineModel('region', { default: {} })
</script>

<template>
  <div>
    <common-card-info title="基础信息" :is-collapse="false">
      <template #info>
        <div class="relative">
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi
              :span="12"
              label="收银员" label-placement="top"
              path="cashier_id"
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
                  props.getStaff()
                }"
              />
            </n-form-item-gi>
            <n-form-item-gi
              :span="12"
              label="接待人" label-placement="top"
              path="receptionist_id"
            >
              <n-select
                v-model:value="formData.receptionist_id"
                placeholder="请输入接待人"
                :options="props.staffs.map(v => ({
                  label: v.nickname,
                  value: v.id,
                }))"
                clearable
                remote
                @focus="() => {
                  props.getStaff()
                }"
              />
            </n-form-item-gi>
            <n-form-item-gi
              :span="24"
              label="维修项目" label-placement="top"
              path="name"
            >
              <n-input v-model:value="formData.name" @focus="focus" />
            </n-form-item-gi>
            <n-form-item-gi
              :span="24"
              label="问题描述" label-placement="top"
              path="desc"
            >
              <n-input v-model:value="formData.desc" @focus="focus" />
            </n-form-item-gi>
            <n-form-item-gi
              :span="12"
              label="维修费用" label-placement="top"

            >
              <n-input-number v-model:value="formData.expense" min="0" :show-button="false" @focus="focus" />
            </n-form-item-gi>
            <n-form-item-gi
              :span="12"
              label="维修成本" label-placement="top"

            >
              <n-input-number v-model:value="formData.cost" min="0" :show-button="false" @focus="focus" />
            </n-form-item-gi>
            <n-form-item-gi
              :span="12"
              label="取货方式" label-placement="top"
            >
              <n-radio-group v-model:value="formData.delivery_method" name="radiogroup">
                <n-space>
                  <n-radio
                    v-for="(items, index) in [{ value: 1, label: '自提' }, { value: 2, label: '邮寄' }]" :key="index" :value="items.value" :style="{
                      '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                      '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                      '--n-dot-color-active': '#0068ff',
                      '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
                    {{ items.label }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item-gi>

            <template v-if="formData.delivery_method === 2">
              <n-form-item-gi
                :span="24"
                label="收货地址" label-placement="top"
              >
                <common-area-select :border="props.areaBorder" :is-required="false" :showtitle="false" :form="region" />
              </n-form-item-gi>
              <n-form-item-gi
                :span="24"
                label="详细地址" label-placement="top"
              >
                <n-input v-model:value="formData.address" @focus="focus" />
              </n-form-item-gi>
            </template>
          </n-grid>
        </div>
      </template>
    </common-card-info>
  </div>
</template>

<style lang="scss" scoped>
.n-input-number {
  width: 100%;
}
</style>
