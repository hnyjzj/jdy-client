<script lang="ts" setup>
import PrintTemp from '@/components/print/Statement.vue'
import usePrint from 'vue3-use-print'

const printFn = () => {
  const PrintComponent = defineComponent({
    render() {
      return h(PrintTemp)
    },
  })
  //   getMethod()
  usePrint(PrintComponent)
}

const formRef = ref()
const model = ref({
  brand: 1,
  startTime: null,
  endTime: null,
})
const rules = {}
</script>

<template>
  <div class="py-[20px] sm:grid-12">
    <div uno-sm="col-10 offset-1">
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
                  <n-form-item label="品牌" path="brand">
                    <n-select
                      v-model:value="model.brand"
                      placeholder="Select"
                      :options="[]"
                    />
                  </n-form-item>
                </div>
                <div class="col-12" uno-sm="col-6" uno-lg="col-3">
                  <n-form-item label="收银员" path="brand">
                    <n-select
                      v-model:value="model.brand"
                      placeholder="Select"
                      :options="[]"
                    />
                  </n-form-item>
                </div>

                <div class="col-12" uno-sm="col-6" uno-lg="col-3">
                  <n-form-item label="开始时间" path="startTime">
                    <n-date-picker v-model:value="model.startTime" type="datetime" />
                  </n-form-item>
                </div>
                <div class="col-12" uno-sm="col-6" uno-lg="col-3">
                  <n-form-item label="结束时间" path="endTime">
                    <n-date-picker v-model:value="model.endTime" type="datetime" />
                  </n-form-item>
                </div>
                <div class="col-6 offset-6" uno-sm="col-4 offset-8" uno-lg="col-4 offset-8">
                  <n-form-item>
                    <div class="flex justify-end  w-full">
                      <div class="bg-[#208AFF] hover:bg-[#0B57D0] color-[#fff] p-[6px] rounded-[6px] cursor-pointer mr-[20px]" @click="printFn">
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
          <PrintStatement />
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
