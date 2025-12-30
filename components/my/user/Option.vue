<script setup lang="ts">
const props = defineProps<{
  optList: UserOpts[]
}>()
</script>

<template>
  <div class="">
    <template v-for="(item, index) in props.optList" :key="index">
      <div class="cursor-pointer bg px-[16px] blur-bgc rounded-[8px] mb-[16px]">
        <nuxt-link :to="item.link" class="color-[#000] no-underline">
          <div class="flex-between">
            <div class="flex-center-row py-[16px]">
              <icon :name="item.iconName" :size="32" />
              <div class="font-semibold text-[14px] line-height-[20px] ml-[8px] dark:color-[#fff]">
                {{ item.optName }}
              </div>
            </div>
            <div class="flex-center-row gap-[8px]">
              <template v-if="item.rightText">
                <div class="font-normal text-[14px] line-height-[20px] color-[#333] dark:color-[#fff]">
                  {{ item.rightText }}
                </div>
              </template>
              <icon name="i-icon:arrow" :size="13" class="color-[#808089]" />
            </div>
          </div>
        </nuxt-link>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.bg {
  box-shadow: 0px 5px 20px 0px #0000000a;
}
</style>
