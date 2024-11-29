<script lang="ts" setup>
definePageMeta({ layout: 'solid' })
const otherList = ref([{
  name: 'wxwork',
  icon: 'i-svg:qwicon',
}])
</script>

<template>
  <div class="px-[16px] py-[16px] ">
    <div class="grid-12">
      <div class="pb-[16px] col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
        <div class="bg-[#fff] px-[16px] py-[12px] rounded-[8px] flex-between">
          <div class="bg-amber rounded-[50%] wh-[36px]" />
          <div class="color-[#848484]">
            <span>
              修改头像
            </span>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>

      <div class="pb-[32px] col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
        <div class="bg-[#fff] px-[16px] rounded-[8px] color-[#848484]">
          <div class="items">
            <div>姓名</div>
            <div class="color-black">
              12321312
            </div>
          </div>
          <div class="items">
            <div>电话</div>
            <div class="color-black">
              123
            </div>
          </div>
          <div class="items">
            <div>手机</div>
            <div class="color-black">
              123
            </div>
          </div>
          <div class="items">
            <div>Email</div>
            <div>
              <input type="text" class="text-right border-none color-black" placeholder="请输入">
            </div>
          </div>
        </div>
      </div>
      <div class="pb-[160px]  col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
        <div class="ok cursor-pointer">
          保存
        </div>
      </div>
    </div>

    <login-other text="其他授权方式" :list="otherList" />
  </div>
</template>

<style lang="scss" scoped>
.items {
  --uno: 'flex-between border-b-[1px] border-b-solid border-b-[#F7F7F7]  py-[16px]';
}
.ok {
  --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px]  text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
}
</style>
