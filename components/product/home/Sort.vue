<script setup lang="ts">
const list = [{
  name: '销售单',
  icon: '',
}, {
  name: '销售明细',
  icon: '',
}, {
  name: '工程单',
  icon: '',
}, {
  name: '客服单',
  icon: '',
}, {
  name: '阿里单',
  icon: '',
}, {
  name: '淘宝单',
  icon: '',
}, {
  name: '阿里单',
  icon: '',
}, {
  name: '淘宝单',
  icon: '',
}]
</script>

<template>
  <div class="grid-12">
    <div class="col-12 lg:col-8 lg:offset-2 sm:col-12 relative">
      <div class="absolute right-[-10px] top-[-146px] sm:right-[0] sm:top-[-90px]">
        <img src="/images/banner/product.png">
      </div>
      <div class="absolute top-[-66px] sm:top-[0] sm:right-[240px] sm:flex-center-col sm:items-end">
        <div class="text-size-xl line-height-[24px] font-semibold color-[#fff]">
          早上好,孙暴风
        </div>
        <div class="text-size-[14px] line-height-[24px] color-[#fff] mt-[8px]">
          早上好,孙暴风
        </div>
      </div>

      <div class="tibox ">
        <div class="ti-row">
          <div class="ti-right z1">
            <div
              class="skew">
              <div class="skew-right" />
              <div class="skew-text ">
                工作详情
              </div>
            </div>
            <div class="absolute sm:top-[54px] sm:left-[33px] top-[39px] left-[16px] ">
              <product-home-card img="i-svg:product-target" text="本月销售目标" :num="20" />
            </div>
          </div><div class="ti-after m-0" />
        </div>
        <div class="center-title  pl-[16px] sm:pl-[33px] py-[10px] rounded-tr-[16px] sm:pt-[42px]">
          <div class="grid-12 gap-[16px] ">
            <div class="col-4">
              <product-home-card img="i-svg:product-neworder" text="新增订单" :num="20" />
            </div>
            <div class="col-4">
              <product-home-card img="i-svg:product-newuser" text="新增客户" :num="20" />
            </div>
            <div class="col-4">
              <product-home-card img="i-svg:product-money" text="销售金额" :num="20" />
            </div>
          </div>
        </div>
        <div class="cardbox grid-12 gap-[16px] mt-[-1px]">
          <template v-for="(item, index) in list" :key="index">
            <div class="col-6 sm:col-3">
              <div class="bg-white p-4 border-rd-lg flex-center-row bg-[#fff]">
                <div class="bg-amber w[45px] h[45px] border-rd-full" />
                <div class="w-[70px] flex-col-center ml-[3px]">
                  <div class="font-semibold text-size-sm color-[#333333] line-height-[24px]">
                    {{ item.name }}
                  </div>
                  <div class="text-size-[10px] color-[#808089] line-height-[24px] mt-[8px]">
                    点击进入
                    <van-icon name="play" class="text-size-[12px]" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ti-row {
  --uno: 'flex-start h-85px sm:h-75px relative ';
  .ti-right {
    --uno: 'w-[150px] sm:w-[250px] lg:w-[200px]  lg:mb-[-0px] pos-relative rounded-tl-[16px] h-85px sm:h-75px blur-bgc';
  }
  .ti-after {
    --uno: 'ml-[-1px] lg:ml-[0px] lg:mb-[0px] h-full w-[50px] h-85px sm:h-75px blur-bgc';

    clip-path: polygon(
      0% 100%,
      100% 100%,
      100% 100%,
      96.281% 99.447%,
      92.842% 98.729%,
      89.684% 97.847%,
      86.807% 96.8%,
      84.211% 95.588%,
      81.895% 94.212%,
      79.86% 92.671%,
      78.105% 90.965%,
      76.632% 89.094%,
      75.439% 87.059%,
      75.439% 87.059%,
      74.114% 84.441%,
      72.246% 80.824%,
      69.833% 76.206%,
      66.877% 70.588%,
      63.377% 63.971%,
      59.333% 56.353%,
      54.746% 47.735%,
      49.614% 38.118%,
      43.939% 27.5%,
      37.719% 15.882%,
      37.719% 15.882%,
      35.605% 12.865%,
      33.123% 10.165%,
      30.272% 7.782%,
      27.053% 5.718%,
      23.465% 3.971%,
      19.509% 2.541%,
      15.184% 1.429%,
      10.491% 0.635%,
      5.43% 0.159%,
      0% -0%,
      0% 100%
    );
  }
}

.cardbox {
  --uno: 'blur-bgc px-[10px] pb-14px sm:px-[24px] sm:pb-33px pt-0 rounded-b-16px ';
}

.center-title {
  --uno: ' blur-bgc';
}
</style>
