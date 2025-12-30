<script lang="ts" setup>
const { followSystem, isDark } = storeToRefs(useThemeStore())
const { setTheme } = useThemeStore()
</script>

<template>
  <div class="sm:pt-[16px]">
    <common-layout-center>
      <div class="bg-[#fff] dark:bg-[#1D2C60] flex flex-center-between px-[16px] py-[8px] sm:rounded-[8px]">
        <div>
          <div class="text-[14px] line-height-[24px] text-color font-bold">
            跟随系统
          </div>
          <div class="text-[14px] line-height-[20px] color-[#808089]">
            开启后，将跟随系统打开或关闭深色模式
          </div>
        </div>
        <div>
          <client-only>
            <n-switch v-model:value="followSystem" size="medium" @update:value="setTheme" />
          </client-only>
        </div>
      </div>
      <template v-if="!followSystem">
        <div class="text-[14px] line-height-[24px] color-[#91929E] font-bold p-[16px]">
          手动选择
        </div>
        <div class="bg-[#fff] dark:bg-[#1D2C60] px-[16px] sm:rounded-[8px]">
          <div class="py-[12px] line-color-b  flex items-center justify-between" @click="setTheme(false)">
            <div class="text-color ">
              浅色模式
            </div>
            <client-only>
              <template v-if="!isDark">
                <icon name="i-svg:check-box" :size="16" />
              </template>
            </client-only>
          </div>
          <div class="py-[12px] flex items-center justify-between" @click="setTheme(true)">
            <div class="text-color ">
              深色模式
            </div>
            <client-only>
              <template v-if="isDark">
                <icon name="i-svg:check-box" :size="16" />
              </template>
            </client-only>
          </div>
        </div>
      </template>
    </common-layout-center>
  </div>
</template>

<style lang="scss" scoped>

</style>
