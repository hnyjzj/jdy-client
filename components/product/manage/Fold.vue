<script setup lang="ts">
const isOpen = ref<boolean>(false)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}
const checked = ref([])
</script>

<template>
  <div class="">
    <van-checkbox-group v-model="checked" shape="square">
      <div class="grid-12 gap-[24px] ">
        <template v-for="(item, index) in 5" :key="index">
          <div class="sm:col-12 lg:col-6 col-12">
            <div class=" rounded-[24px] overflow-hidden ">
              <div class="bg-[#F1F5FE] px-[16px] py-[12px] grid-12">
                <div class="col-1 flex-center-row">
                  <van-checkbox name="a" />
                </div>
                <div class="col-10 flex-start">
                  <div class="mr-[20px] color-[#CC00B8] text-size-[12px] line-height-[20px] px-[8px] bg-[#FBE2FF] rd-tl-[8px] rd-br-[8px]">
                    成品
                  </div>
                  <div>
                    <common-avatar :size="24" />
                  </div>
                  <div class="color-[#1B2129] text-size-[14px] line-height-[20px] ml-[8px] font-semibold">
                    123213
                  </div>
                </div>
                <div class="col-1 flex-center-row" @click="toggleOpen()">
                  <template v-if="isOpen">
                    <van-icon name="arrow-down" />
                  </template>
                  <template v-else>
                    <van-icon name="arrow-up" />
                  </template>
                </div>
              </div>
              <div class="bg-[#FFFFFF] grid-12 px-[16px]" :class="[isOpen ? 'block1' : 'hidden1']">
                <div class="col-1" />
                <div class="col-11 pt-[12px] pb-[16px] text-size-[14px]" :class="[isOpen ? 'block2' : 'hidden2']">
                  <div class="flex-between mb-[8px]">
                    <product-line-one />
                    <product-line-two />
                  </div>
                  <div class="flex-between">
                    <product-line-one />
                    <product-line-three />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </van-checkbox-group>
  </div>
</template>

<style lang="scss" scoped>
.hidden1 {
  height: 0px;
  transition: all 200ms ease;
}

.block2 {
  opacity: 1;
  transition: all 200ms ease;
}
.hidden2 {
  opacity: 0;
  transition: all 200ms ease;
}
</style>
