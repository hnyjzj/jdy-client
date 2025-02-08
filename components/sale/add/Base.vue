<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title?: string
  filterList: Where<Orders>
  storeStaff: Staff[]
  memberList: Member[]
  getMember: (val: string) => void
}>(), {
  title: '基础信息',
})

const formData = defineModel<Orders>({ default: {} })

// 收银员列表参数
const cashierOptions = props.storeStaff.map(
  v => ({
    label: v.nickname,
    value: v.id,
  }),
)

// 订单类型参数
const typeOptions = optonsToSelect(props.filterList.type?.preset)
// 订单来源参数
const sourceOptions = optonsToSelect(props.filterList.source?.preset)

// 设置主销售员
const handleSwitch = (index: number) => {
  formData.value.salesmens.forEach((item) => {
    item.is_main = false
  })
  formData.value.salesmens[index].is_main = true
}
const dialog = useDialog()
// 删除销售
const deleteSale = (index: number) => {
  dialog.error({
    title: '确定删除此导购吗',
    negativeText: '取消',
    positiveText: '确定',
    onPositiveClick: () => {
      formData.value.salesmens.splice(index, 1)
      const aliveMain = formData.value.salesmens.filter(item => item.is_main === true)
      if (!aliveMain.length) {
        formData.value.salesmens[0].is_main = true
      }
    },
  })
}
// 新增销售员
const addNewSale = () => {
  formData.value.salesmens.push({
    salesman_id: '1864219635784617985',
    performance_amount: 0,
    performance_rate: 0,
    is_main: !formData.value.salesmens.length,
  })
}
// 搜索会员 防抖
const searchMember = useDebounceFn((val) => {
  props.getMember(val)
}, 500)
</script>

<template>
  <common-fold :title="props.title" :is-collapse="false">
    <div class="p-[16px] w-auto flex flex-col gap-[12px]" uno-lg="grid grid-cols-1 gap-[16px] grid-cols-0">
      <div>
        <div class="flex justify-between">
          <n-form-item label="订单类型" path="type" class="w-[45%]">
            <n-select
              v-model:value="formData.type"
              placeholder="请选择"
              :options="typeOptions"
            />
          </n-form-item>
          <n-form-item label="收银员" path="cashier_id" class="w-[45%]">
            <n-select
              v-model:value="formData.cashier_id"
              placeholder="请选择"
              :options="cashierOptions"
            />
          </n-form-item>
        </div>
        <div class="flex justify-between">
          <n-form-item label="会员" path="member_id" class="w-[45%]">
            <n-select
              v-model:value="formData.member_id"
              filterable
              placeholder="输入手机号搜索"
              :options="props.memberList.map(v => ({
                label: v.nickname ? v.nickname : v.name,
                value: v.id,
              }))"
              clearable
              remote
              @search="searchMember"
            />
          </n-form-item>

          <n-form-item label="来源" path="source" class="w-[45%]">
            <n-select
              v-model:value="formData.source"
              placeholder="请选择"
              :options="sourceOptions"
            />
          </n-form-item>
        </div>
      </div>

      <template v-for="(item, index) in formData.salesmens" :key="index">
        <div class="pt-[26px] border-t-[1px] border-t-solid border-t-[#ccc]">
          <div class="flex justify-between">
            <n-form-item
              label="导购员" label-placement="top" class="w-[45%]"
              :path="`salesmens[${index}].salesman_id`"
              :rule="{
                required: true,
                message: `请选择导购员`,
                trigger: ['change', 'blur'],
              }">
              <n-select
                v-model:value="item.salesman_id"
                placeholder="请选择"
                :options="cashierOptions"
              />
            </n-form-item>
            <n-form-item label="业绩比例" path="performance_rate" label-placement="top" class="w-[45%]">
              <n-input-number v-model:value="item.performance_rate" :min="0">
                <template #suffix>
                  %
                </template>
              </n-input-number>
            </n-form-item>
          </div>
          <div class="flex justify-between">
            <n-form-item label="是否主销" label-placement="top" class="w-[45%]">
              <div class="flex justify-between items-center w-full">
                <n-switch v-model:value="item.is_main" @update:value="handleSwitch(index)">
                  <template #checked>
                    主销
                  </template>
                  <template #unchecked>
                    辅销
                  </template>
                </n-switch>
              </div>
            </n-form-item>
            <div class="p-[8px] col-2 flex-center-row cursor-pointer" @click="deleteSale(index)">
              <icon name="i-svg:delete" :size="16" />
            </div>
          </div>
          <div />
        </div>
      </template>
      <div class="flex-center-row">
        <n-button type="info" @click="addNewSale">
          新增导购员
        </n-button>
      </div>
    </div>
  </common-fold>
</template>

<style lang="scss" scoped>
.box {
  --uno: 'flex flex-col gap-[8px]';

  .inplabel {
    --uno: 'color-[#333] dark:text-[#FFFFFF] font-size-[14px]';
  }
}
</style>
