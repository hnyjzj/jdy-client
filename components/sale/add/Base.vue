<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title?: string
  filterList: Where<Orders>
  storeStaff: StoresStaff[]
  memberList: Member[]
  getMember: (val: string) => void
  getStaff: () => void
}>(), {
  title: '基础信息',
})
const formData = defineModel<Orders>({ default: {} })

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
    salesman_id: '',
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
      <n-grid :cols="24" :x-gap="8">
        <n-form-item-gi :span="12" label="订单类型" path="type" class="">
          <n-select
            v-model:value="formData.type"
            placeholder="请选择"
            :options="typeOptions"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="收银员" path="cashier_id" class="">
          <n-select
            v-model:value="formData.cashier_id"
            placeholder="请输入收银员"
            :options="props.storeStaff.map(v => ({
              label: v.nickname,
              value: v.id,
            }))"
            clearable
            remote
            @focus="() => { props.getStaff() }"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="会员" path="member_id" class="">
          <n-select
            v-model:value="formData.member_id"
            filterable
            placeholder="输入手机号搜索"
            :options="props.memberList.map(v => ({
              label: `${v.phone} (${v.nickname ? v.nickname : v.name})`,
              value: v.id,
            }))"
            clearable
            remote
            @search="searchMember"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="来源" path="source" class="">
          <n-select
            v-model:value="formData.source"
            placeholder="请选择"
            :options="sourceOptions"
          />
        </n-form-item-gi>
      </n-grid>

      <template v-for="(item, index) in formData.salesmens" :key="index">
        <div class="pt-[26px] border-t-[1px] border-t-solid border-t-[#ccc]">
          <n-grid :cols="24" :x-gap="8">
            <n-form-item-gi
              :span="12"
              label="导购员" label-placement="top" class=""
              :path="`salesmens[${index}].salesman_id`"
              :rule="{
                required: true,
                message: `请选择导购员`,
                trigger: ['change', 'blur'],
              }">
              <n-select
                v-model:value="item.salesman_id"
                placeholder="请选择"
                :options="props.storeStaff.map(v => ({
                  label: v.nickname,
                  value: v.id,
                }))"
                clearable
                remote
                @focus="() => { props.getStaff() }"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="业绩比例" path="performance_rate" label-placement="top" class="">
              <n-input-number v-model:value="item.performance_rate" :min="0" :max="100">
                <template #suffix>
                  %
                </template>
              </n-input-number>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="是否主销" label-placement="top" class="">
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
            </n-form-item-gi>
            <n-form-item-gi :span="3" :offset="9">
              <div class="p-[8px] col-2 flex-center-row cursor-pointer" @click="deleteSale(index)">
                <icon name="i-svg:delete" :size="16" />
              </div>
            </n-form-item-gi>
          </n-grid>
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
.n-input-number {
  width: 100%;
}
</style>
