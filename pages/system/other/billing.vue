<script lang="ts" setup>
useSeoMeta({
  title: '开单设置',
})
const model = ref({
  inputValue: 0,
  small: 1,
  setup: 1,
  confirm: 2,
})
const formRef = ref(null)
const options = [
  {
    label: '不保留小数',
    value: 1,
  },
  {
    label: '保留1位小数',
    value: 2,
  },
  {
    label: '保留2位小数',
    value: 3,
  },
  {
    label: '保留3位小数',
    value: 4,
  },
]

const setupOpts = [
  {
    value: 1,
    label: '四舍五入',
  },
  {
    value: 2,
    label: '向上取整',
  },
  {
    value: 3,
    label: '向下取整',
  },
]
</script>

<template>
  <div class="grid-12 p-[16px]">
    <div class="col-12" uno-sm="col-6 offset-3">
      <common-fold title="开单设置" :is-collapse="false">
        <div class="p-[16px]">
          <n-form
            ref="formRef"
            :model="model"
            label-placement="left"
            label-width="150px"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="积分抵扣比例">
              <n-input-number v-model:value="model.inputValue" placeholder="输入积分抵扣比例" :show-button="false">
                <template #suffix>
                  积分 = 1元
                </template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="金额小数点控制">
              <n-select v-model:value="model.small" :options="options" placeholder="金额小数点控制" />
            </n-form-item>
            <n-form-item label="金额进位控制">
              <n-select v-model:value="model.setup" :options="setupOpts" placeholder="金额进位控制" />
            </n-form-item>
            <n-form-item label="积分使用二次确认">
              <n-select v-model:value="model.confirm" :options="[{ value: 1, label: '开启' }, { value: 2, label: '关闭' }]" placeholder="积分使用二次确认" />
            </n-form-item>
          </n-form>
        </div>
      </common-fold>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
