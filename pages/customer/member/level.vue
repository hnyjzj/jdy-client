<script setup lang="ts">
useSeoMeta({
  title: '会员等级',
})

const show = ref(false)
</script>

<template>
  <div>
    <common-layout-card>
      <div>
        <customer-member-level level="金卡" leftbtn="删除" rightbtn="编辑" />
        <customer-member-level level="金卡" rightbtn="编辑" />
      </div>

      <template #footer>
        <div class="col-12">
          <common-button-rounded content="添加等级" @button-click="show = !show" />
        </div>
      </template>
    </common-layout-card>

    <common-model v-model="show">
      <div>
        <div class="mb-[16px]">
          <div class="text-[14px] line-height-[20px] mb-[8px]">
            <span>等级名称 </span><span class="color-red-6">*</span>
          </div>
          <div class="bg-[#fff] flex-1  rounded-[24px] border-color-[#E6E6E8] border-solid border py-[6px] px-[12px]">
            <input type="text" class="w-full border-none bg-transparent" placeholder="0" @focus="focus">
          </div>
        </div>
        <div class="mb-[16px]">
          <div class="text-[14px] line-height-[20px] mb-[8px]">
            <span>积分范围 </span><span class="color-red-6">*</span>
          </div>
          <div class="bg-[#fff] flex-1  rounded-[24px] border-color-[#E6E6E8] border-solid border py-[6px] px-[12px]">
            <input type="text" class="w-full border-none bg-transparent" placeholder="0" @focus="focus">
          </div>
        </div>
        <div class="mb-[16px]">
          <div class="text-[14px] line-height-[20px] mb-[8px]">
            <span>比例设置 </span>
          </div>
          <div class="grid-12 color-[#808089] text-[14px] gap-[8px]">
            <div class="col-4">
              <div class="mb-[8px]">
                大类
              </div>
              <div class="bg-[#fff] flex-1  rounded-[24px] border-color-[#E6E6E8] border-solid border py-[6px] px-[12px]">
                <input type="text" class="w-full border-none bg-transparent" placeholder="0" @focus="focus">
              </div>
            </div>
            <div class="col-4">
              <div class="mb-[8px]">
                品牌
              </div>
              <div class="bg-[#fff] flex-1  rounded-[24px] border-color-[#E6E6E8] border-solid border py-[6px] px-[12px]">
                <input type="text" class="w-full border-none bg-transparent" placeholder="0" @focus="focus">
              </div>
            </div>
            <div class="col-4">
              <div class="mb-[8px]">
                折扣
              </div>
              <div class="bg-[#fff] flex-1  rounded-[24px] border-color-[#E6E6E8] border-solid border py-[6px] px-[12px]">
                <input type="text" class="w-full border-none bg-transparent" placeholder="0" @focus="focus">
              </div>
            </div>
          </div>
        </div>
      </div>
    </common-model>
  </div>
</template>
