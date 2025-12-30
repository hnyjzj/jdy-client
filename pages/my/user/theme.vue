<script lang="ts" setup>
const colorMode = useColorMode()
const { followSystem } = storeToRefs(useThemeStore())
const mode = computed({
  get() {
    return colorMode.preference === 'dark'
  },
  set(newValue) {
    colorMode.preference = newValue ? 'dark' : 'light'
  },
})

function setMode(newValue: boolean) {
  if (followSystem.value) {
    return
  }
  mode.value = newValue
}
function systemSet(newValue: boolean) {
  colorMode.preference = newValue ? 'dark' : 'light'
}
</script>

<template>
  <div>
    <div class="bg-[#fff] dark:bg-[#1D2C60] flex flex-center-between px-[16px] py-[8px]">
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
          <n-switch v-model:value="followSystem" size="medium" @update:value="systemSet" />
        </client-only>
      </div>
    </div>
    <div class="text-[14px] line-height-[24px] color-[#91929E] font-bold p-[16px]">
      手动选择
    </div>
    <div class="bg-[#fff] dark:bg-[#1D2C60] px-[16px] ">
      <div class="py-[12px] line-color-b  flex items-center justify-between" @click="setMode(false)">
        <div class="text-color ">
          浅色模式
        </div>
        <client-only>
          <template v-if="!mode">
            <icon name="i-svg:check-box" :size="16" />
          </template>
        </client-only>
      </div>
      <div class="py-[12px] flex items-center justify-between" @click="setMode(true)">
        <div class="text-color ">
          深色模式
        </div>
        <client-only>
          <template v-if="mode">
            <icon name="i-svg:check-box" :size="16" />
          </template>
        </client-only>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
