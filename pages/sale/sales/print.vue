<script lang="ts" setup>
import PrintTemp from '@/components/print/Statement.vue'
import usePrint from 'vue3-use-print'

const { myStore, StoreStaffList } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()

const { printData } = storeToRefs(useStatement())
const { PrintSattementTotal } = useStatement()
const formRef = ref()
const model = ref<PrintSattementTotalReq>({
  start_time: '',
  end_time: '',
  store_id: myStore.value.id,
  salesman_id: '',
})
const rules = {
  start_time: {
    required: true,
    message: '开始时间不能为空',
    trigger: 'blur',
  },
  end_time: {
    required: true,
    message: '结束时间不能为空',
    trigger: 'blur',
  },
}
const time = getTodayRange()
model.value.start_time = time.start
model.value.end_time = time.end
await PrintSattementTotal(model.value)
const { $toast } = useNuxtApp()
// 获取门店员工列表
StoreStaffList.value.unshift({
  nickname: '全部',
  id: '',
} as StoresStaff)
model.value.salesman_id = ''
const getStaff = async () => {
  const res = await getStoreStaffList({ id: myStore.value.id })
  StoreStaffList.value.unshift({
    nickname: '全部',
    id: '',
  } as StoresStaff)
  if (res) {
    $toast.error(res?.data.value?.message || '获取员工列表失败')
  }
}
const printFn = () => {
  const PrintComponent = defineComponent({
    render() {
      return h(PrintTemp)
    },
  })
  usePrint(PrintComponent)
}
const salesman = ref<string>('')
const SearchResult = async () => {
  await PrintSattementTotal(model.value)
}
const setSalesman = (_: string, option: any) => {
  salesman.value = option.label
}
</script>

<template>
  <div class="py-[20px] sm:grid-12">
    <div uno-sm="col-10 offset-1">
      <div class="w-fit color-[#fff] pb-[12px]">
        <product-manage-company />
      </div>
      <div class="bg-[#fff] p-[12px] rounded-[12px]">
        <div style="border: 1px dashed #ccc;" class="p-[12px]  rounded-[12px]">
          <div>
            <n-form
              ref="formRef"
              :model="model"
              :rules="rules"
              inline
              label-placement="left"
              label-width="auto"
              require-mark-placement="right-hanging"
            >
              <div class="grid-12 gap-[12px] w-full">
                <div class="col-12" uno-sm="col-6" uno-lg="col-3">
                  <n-form-item label="销售员">
                    <n-select
                      v-model:value="model.salesman_id"
                      placeholder="选择销售员"
                      :options="StoreStaffList.map(item => ({ label: item.nickname, value: item.id }))"
                      default-value=""
                      @focus="getStaff"
                      @update:value="setSalesman"
                    />
                  </n-form-item>
                </div>

                <div class="col-12" uno-sm="col-6" uno-lg="col-3">
                  <n-form-item label="开始时间" path="start_time">
                    <n-date-picker v-model:formatted-value="model.start_time" input-readonly type="datetime" value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" />
                  </n-form-item>
                </div>
                <div class="col-12" uno-sm="col-6" uno-lg="col-3">
                  <n-form-item label="结束时间" path="end_time">
                    <n-date-picker v-model:formatted-value="model.end_time" input-readonly type="datetime" value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" />
                  </n-form-item>
                </div>

                <div class="col-12" uno-sm="col-6" uno-lg="col-3">
                  <n-form-item>
                    <div class="flex justify-end  w-full">
                      <div class="bg-[#208AFF] hover:bg-[#0B57D0] color-[#fff] p-[6px] rounded-[6px] cursor-pointer mr-[20px]" @click="SearchResult">
                        查询报表
                      </div>
                      <div class="bg-[#2F80ED] hover:bg-[#0B57D0] color-[#fff] p-[6px] rounded-[6px] cursor-pointer" @click="printFn">
                        打印报表
                      </div>
                    </div>
                  </n-form-item>
                </div>
              </div>
            </n-form>
          </div>
          <PrintStatement :start="model.start_time" :end="model.end_time" :salesman="salesman" :data="printData" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
    .n-date-picker {
  width: 100%;
}
</style>
