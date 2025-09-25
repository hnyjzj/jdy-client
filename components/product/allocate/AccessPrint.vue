<script lang="ts" setup>
import PrintTemp from '@/components/product/allocate/AccessPrintInfo.vue'
import usePrint from 'vue3-use-print'

const show = defineModel({ type: Boolean, default: false })
watch(show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'// 禁止滚动
  }
  else {
    document.body.style.overflow = ''
  }
})
const checkTime = ref<string>('')
// 定义打印报表的方法
const printFn = () => {
  // 动态定义一个打印组件
  const PrintComponent = defineComponent({
    render() {
      // 渲染打印模板组件，并传入销售员、开始时间和结束时间
      return h(PrintTemp, {
        font: '10px',
        time: checkTime.value,
      })
    },
  })
  // 调用打印功能
  usePrint(PrintComponent)
}
onMounted(() => {
  checkTime.value = new Date().toISOString()
})
</script>

<template>
  <div>
    <template v-if="show">
      <div class="fixed mask top-0 left-0 bottom-0 right-0 z-3 p-[30px] grid-12">
        <div class="bg-[#fff] rounded-[16px] p-[16px] py-[30px] col-12 h-fit" uno-sm="col-8 offset-2">
          <div class="flex justify-between items-center">
            <div
              class="text-center bg-[#1b6ceb] color-[#fff] px-[8px] py-[4px] rounded-[8px] cursor-pointer"
              @click="printFn"
            >
              打印
            </div>
            <div
              class="text-[20px] wh-[30px] bg-[#eee] flex-center-row rounded-[8px] cursor-pointer hover:bg-[#ddd]"
              @click="show = false">
              ×
            </div>
          </div>
          <div class=" overflow-y-auto h-[600px]">
            <product-allocate-access-print-info :time="checkTime" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.mask {
  background: rgba($color: #000, $alpha: 0.5);
}
</style>
