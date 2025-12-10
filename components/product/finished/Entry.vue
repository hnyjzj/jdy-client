<script setup lang="ts">
// 入库单详情
const props = defineProps<{
  productStorageInfo: WarehouseReceipt
}>()

// 入库单状态
const statusDesc = {
  1: '已完成',
  2: '已撤销',
  3: '草稿',
}
</script>

<template>
  <div class="grid-12">
    <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
      <div class="rounded-6 bg-white w-auto blur-bga top">
        <common-gradient title="基础信息">
          <template #body>
            <div class="flex flex-col gap-4">
              <div class="operation-information flex flex-col gap-1">
                <div class="flex-start gap-3 text-sm font-normal">
                  <div class="color-[#666666]">
                    操作人
                  </div>
                  <div class="color-[#333333]">
                    {{ props.productStorageInfo.operator }}
                  </div>
                </div>
                <div class="flex-start gap-3 text-sm font-normal">
                  <div class="color-[#666666]">
                    入库单号
                  </div>
                  <div class="color-[#333333]">
                    {{ props.productStorageInfo.num }}
                  </div>
                </div>
                <div class="flex-start gap-3 text-sm font-normal">
                  <div class="color-[#666666]">
                    状态
                  </div>
                  <div class="color-[#333333]">
                    <common-tags type="green" :text="statusDesc[props.productStorageInfo.status]" />
                  </div>
                </div>
                <div class="flex-start gap-3 text-sm font-normal">
                  <div class="color-[#666666]">
                    类型
                  </div>
                  <div class="color-[#333333]">
                    {{ props.productStorageInfo.type }}
                  </div>
                </div>
              </div>
              <div class="line-space" />
              <div class="product-information flex flex-col gap-1">
                <div class="flex-start gap-3 text-sm font-normal">
                  <div class="color-[#666666]">
                    总件数
                  </div>
                  <div class="color-[#333333]">
                    {{ props.productStorageInfo.totalCount }}
                  </div>
                </div>
                <div class="flex-start gap-3 text-sm font-normal">
                  <div class="color-[#666666]">
                    总金重
                  </div>
                  <div class="color-[#333333]">
                    {{ props.productStorageInfo.totalWeight }}
                  </div>
                </div>
                <div class="flex-start gap-3 text-sm font-normal">
                  <div class="color-[#666666]">
                    总标价
                  </div>
                  <div class="color-[#333333]">
                    {{ props.productStorageInfo.totalPrice }}
                  </div>
                </div>
                <div class="flex-start gap-3 text-sm font-normal">
                  <div class="color-[#666666]">
                    总入网费
                  </div>
                  <div class="color-[#333333]">
                    {{ props.productStorageInfo.networkAccessFee }}
                  </div>
                </div>
              </div>
              <div class="line-space" />
              <div class="other-information flex flex-col gap-1">
                <div class="flex-start gap-3 text-sm font-normal">
                  <div class="color-[#666666]">
                    备注
                  </div>
                  <div class="color-[#333333]">
                    {{ props.productStorageInfo.remark }}
                  </div>
                </div>
                <div class="flex-start gap-3 text-sm font-normal">
                  <div class="color-[#666666]">
                    创建时间
                  </div>
                  <div class="color-[#333333]">
                    {{ props.productStorageInfo.createTime }}
                  </div>
                </div>
                <div class="flex-start gap-3 text-sm font-normal">
                  <div class="color-[#666666]">
                    完成时间
                  </div>
                  <div class="color-[#333333]">
                    {{ props.productStorageInfo.completeTime }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </common-gradient>
      </div>
    </div>
  </div>
</template>
