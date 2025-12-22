<script lang="ts" setup>
import PrintTemp from '@/components/print/Statement.vue'
import usePrint from 'vue3-use-print'

useSeoMeta({
  title: '销售报表',
})
const { myStore, StoreStaffList } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { PrintSattementTotal } = useStatement()
const { $toast } = useNuxtApp()
const formRef = ref()
// 定义表单数据模型，指定类型为 PrintSattementTotalReq
const model = ref<PrintSattementTotalReq>({
  start_time: '',
  end_time: '',
  store_id: myStore.value.id,
  salesman_id: '',
})
// 定义表单验证规则
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
const checkTime = ref('')
// 获取当天的时间范围
const time = getTodayRange()
// 设置表单中的开始时间为当天开始时间
model.value.start_time = time.start
// 设置表单中的结束时间为当天结束时间
model.value.end_time = time.end
// 调用打印报表汇总数据的方法
await PrintSattementTotal(model.value)

// 定义获取门店员工列表的方法
const getStaff = async () => {
  // 调用获取门店员工列表的方法
  const res = await getStoreStaffList({ id: myStore.value.id })
  // 在员工列表开头添加“全部”选项
  StoreStaffList.value.unshift({
    nickname: '全部',
    id: '',
  } as StoresStaff)
  // 如果当前未选择门店且有返回结果，给出错误提示
  if (myStore.value.id === '' && res) {
    $toast.error('请先选择门店')
  }
}

// 定义当前选择的销售员名称
const salesman = ref<string>('')
// 定义打印报表的方法
const printFn = () => {
  // 动态定义一个打印组件
  const PrintComponent = defineComponent({
    render() {
      // 渲染打印模板组件，并传入销售员、开始时间和结束时间
      return h(PrintTemp, {
        salesman: salesman.value,
        start: model.value.start_time,
        end: model.value.end_time,
        font: '10px',
        store: myStore.value.name,
        time: checkTime.value,
      })
    },
  })
  // 调用打印功能
  usePrint(PrintComponent)
}

// 定义查询报表的方法
const SearchResult = async () => {
  // 调用打印报表汇总数据的方法
  const res = await PrintSattementTotal(model.value)
  if (res?.code !== HttpCode.SUCCESS) {
    $toast.error(res?.message || '获取数据失败')
    return
  }
  checkTime.value = new Date().toISOString()
}

// 定义设置销售员名称的方法
const setSalesman = (_: string, option: any) => {
  // 将选择的销售员名称赋值给 salesman
  salesman.value = option.label
}

// 定义门店变更时的处理方法
const changeStore = () => {
  // 如果当前未选择门店
  if (myStore.value.id === '') {
    // 清空门店员工列表
    StoreStaffList.value = []
    // 在员工列表开头添加“全部”选项
    StoreStaffList.value.unshift({
      nickname: '全部',
      id: '',
    } as StoresStaff)
    // 设置默认销售员为空
    model.value.salesman_id = ''
    // 设置门店 ID 为空
    model.value.store_id = ''
  }
}
watch(() => myStore.value.id, async (newVal) => {
  if (newVal) {
    model.value.store_id = newVal
  }
})

onMounted(() => {
  checkTime.value = new Date().toISOString()
  StoreStaffList.value.unshift({
    nickname: '全部',
    id: '',
  } as StoresStaff)
})
</script>

<template>
  <div>
    <div class="blur-bgc mb-[16px]">
      <common-layout-center>
        <div class="w-fit ">
          <product-manage-company @change="changeStore" />
        </div>
      </common-layout-center>
    </div>
    <common-layout-center>
      <div class="blur-bga text-color p-[12px] rounded-[12px]">
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
                      :disabled=" myStore.id === ''"
                      @focus="getStaff"
                      @update:value="setSalesman"
                    />
                  </n-form-item>
                </div>

                <div class="col-12" uno-sm="col-6" uno-lg="col-3">
                  <n-form-item label="开始时间" path="start_time">
                    <n-date-picker v-model:formatted-value="model.start_time" :is-date-disabled="dateDisabled" input-readonly type="datetime" value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" />
                  </n-form-item>
                </div>
                <div class="col-12" uno-sm="col-6" uno-lg="col-3">
                  <n-form-item label="结束时间" path="end_time">
                    <n-date-picker v-model:formatted-value="model.end_time" input-readonly type="datetime" value-format="yyyy-MM-dd'T'HH:mm:ss.SSSxxx" />
                  </n-form-item>
                </div>

                <div class="col-12 " uno-sm="col-6" uno-lg="col-3">
                  <n-form-item>
                    <div class="flex justify-end  w-full">
                      <div class="bg-[#208AFF] hover:bg-[#0B57D0] color-[#fff] p-[6px] rounded-[6px] cursor-pointer mr-[20px]" @click="SearchResult">
                        查询报表
                      </div>
                      <div class="bg-[#fff] border-[#999] border-solid border hover:bg-[#eee] color-[#333] p-[6px] rounded-[6px] cursor-pointer" @click="printFn">
                        打印报表
                      </div>
                    </div>
                  </n-form-item>
                </div>
              </div>
            </n-form>
          </div>
          <PrintStatement :store="myStore.name" :time="checkTime" :start="model.start_time" :end="model.end_time" :salesman="salesman" />
        </div>
      </div>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>
.n-date-picker {
  width: 100%;
}
</style>
