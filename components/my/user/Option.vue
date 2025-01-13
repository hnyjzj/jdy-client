<script setup lang="ts">
const props = defineProps<{
  optList: UserOpts[]
}>()
</script>

<template>
  <div class=" px-[16px] blur-bgc rounded-[16px]">
    <template v-for="(item, index) in props.optList" :key="index">
      <div class="cursor-pointer">
        <nuxt-link :to="item.link" class="color-[#000]">
          <div class="flex-between">
            <div class="flex-center-row py-[24px]">
              <icon :name="item.iconName" :size="32" />
              <div class="font-semibold text-[14px] line-height-[20px] ml-[8px] dark:color-[#fff]">
                {{ item.optName }}
              </div>
            </div>
            <van-icon name="arrow" size="20px" class="color-[#808089]" />
          </div>
          <div class="w-full h-[1px] bg-[#E6E6E8] dark:opacity-[0.5]" :style="{ background: index !== props.optList.length - 1 ? '#E6E6E8' : 'none' }" />
        </nuxt-link>
      </div>
    </template>
  </div>
</template>
