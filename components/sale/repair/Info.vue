<script setup lang="ts">
const props = defineProps<{
  info: any[]
}>()

const checked = ref(1)
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <common-card-info title="基础信息">
      <template #info>
        <div class="grid-cols-[1fr] gap-[16px]" uno-lg="grid-cols-[1fr]" uno-md="grid">
          <div class="flex flex-col gap-[12px]">
            <div class="item">
              <span class="item-left">门店信息</span>
              <span class="item-right">洛阳XXXXXX店 | 0395-xxxxxxxxx | 千江毕竟东流去</span>
            </div>
            <div class="item">
              <span class="item-left">接待人</span>
              <span class="item-right">李一一 | 15000000000</span>
            </div>
            <div class="item">
              <span class="item-left">会员信息</span>
              <span class="item-right">懒羊羊1500xxxxxx</span>
            </div>
            <div class="item">
              <span class="item-left">状态</span>
              <common-tags text="门店已收货" type="lake" />
            </div>
          </div>
        </div>
      </template>
    </common-card-info>

    <common-card-info title="维修信息">
      <template #info>
        <div class="grid-cols-[1fr] gap-[16px]" uno-lg="grid-cols-[1fr]" uno-md="grid">
          <div class="flex flex-col gap-[12px]">
            <template v-for="(item, index) in props.info" :key="index">
              <div class="flex items-center justify-between">
                <div class="color-[#333] dark:color-[#FFFFFF] text-[14px] flex-none">
                  {{ item.name }}
                </div>
                <common-frame
                  v-model="item.num"
                />
              </div>
            </template>
            <div class="flex-center-between gap-[8px] py-[6px]">
              <span class="color-[#333] dark:color-[#FFFFFF] text-[14px] flex-none">取货方式</span>
              <n-radio-group v-model:value="checked">
                <n-radio
                  :value="1">
                  自提
                </n-radio>
                <n-radio :value="2" class="custom-radio">
                  邮寄
                </n-radio>
              </n-radio-group>
            </div>
          </div>
        </div>
      </template>
    </common-card-info>

    <!-- 产品信息 -->
    <div class="info">
      <!-- header -->
      <common-gradient title="产品信息(3)" :foldable="true">
        <template #body>
          <!-- info -->
          <sale-order-product />
        </template>
      </common-gradient>
    </div>
  </div>
</template>

<style scoped>

</style>

<style scoped lang="scss">
.info {
  --uno: 'bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] border-solid border-1 border-[#EFF0F6] dark:border-[rgb(239,240,246,0.1)] rounded-[24px] overflow-hidden';
}

.item {
  --uno: 'flex-center-between gap-[32px]';

  &-left {
    --uno: 'color-[#666] font-size-[14px] whitespace-nowrap flex-none dark:color-[#CBCDD1]';
  }
  &-right {
    --uno: 'color-[#333] font-size-[14px] w-auto text-wrap self-start break-all dark:color-[#fff]';
  }
}
</style>
