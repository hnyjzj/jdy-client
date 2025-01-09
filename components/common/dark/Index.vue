<script setup lang="ts">
const { $colorMode } = useNuxtApp()
// true: dark, false: light
const mode = computed({
  get() {
    return $colorMode.preference === 'dark'
  },
  set(newValue) {
    $colorMode.preference = newValue ? 'dark' : 'light'
  },
})
</script>

<template>
  <div class="mb-[16px]">
    <van-switch
      v-model="mode" :style="{
        '--van-switch-width': '4.5rem',
        '--van-switch-background': '#8FB8EE',

      }">
      <template #node>
        <div class="h-[26px] line-height-[26px] flex justify-center items-center">
          <template v-if="!mode">
            <icon name="i-svg:sun" size="20" :color="!mode ? '#3971F3' : '#FFF'" />
          </template>
          <template v-else>
            <icon name="i-icon:moon" size="20" :color="mode ? '#3971F3' : '#FFF'" />
          </template>
        </div>
      </template>
      <template #background>
        <template v-if="!mode">
          <span class="span select-none" style="right: 1px;">浅色</span>
        </template>
        <template v-else>
          <span class="span select-none" style="left: 2px;">深色</span>
        </template>
      </template>
    </van-switch>
  </div>
</template>

<style lang="scss" scoped>
.span {
  position: absolute;
  top: 0;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: 0 2px;
}
</style>
