<script setup lang="ts">
import PrintTemp from '@/components/print/Board.vue'
import usePrint from 'vue3-use-print'

useSeoMeta({
  title: '打印预览',
})

const route = useRoute()

const { getOrderDetail } = useOrder()
// 订单详情数据
// const { OrderDetail } = storeToRefs(useOrder())

await getOrderDetail({ id: route.query.id as string })

const printPre = () => {
  const PrintComponent = defineComponent({
    render() {
      // TODO: 这里的 details 应该是从 store 中获取的订单详情数据,后续测试完就修改
      return h(PrintTemp, { details: '1111' })
    },
  })

  usePrint(PrintComponent)
}
</script>

<template>
  <div class="grid-12">
    <div class="col-12 px-[16px] py-[16px]" uno-lg="col-8 offset-2">
      <div class="bg-[#fff] rounded-[16px] shadow-2xl px-[12px] py-[12px]">
        <div
          :style="{
            border: '2px dashed #ccc',
            padding: '10px',
            borderRadius: '8px',
          }">
          测试
        </div>
      </div>
    </div>
    <common-button-One
      text="打印预览"
      @confirm="printPre"
    />
  </div>
</template>

<style scoped lang="scss">
</style>
