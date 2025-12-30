<script setup lang="ts">
import type { CSSProperties } from 'vue'

const colorMode = useColorMode()
const mode = computed({
  get() {
    return colorMode.preference === 'dark'
  },
  set(newValue) {
    colorMode.preference = newValue ? 'dark' : 'light'
  },
})

function railStyle({
  checked,
}: {
  focused: boolean
  checked: boolean
}) {
  const style: CSSProperties = {}
  if (checked) {
    style.background = 'rgba(0, 0, 0, 0.6)'
  }
  else {
    style.background = '#D7E3F3'
  }
  return style
}
</script>

<template>
  <client-only>
    <n-switch
      v-model:value="mode"
      size="large"
      :rail-style="railStyle"
    >
      <template #icon>
        <template v-if="!mode">
          <div class="w-full h-full bg-[#ABC8FF] rounded-full flex items-center justify-center">
            <div class="w-[12px] h-[12px] bg-[#fff] rounded-full" />
          </div>
        </template>
        <template v-else>
          <div class="w-full h-full flex items-center justify-center">
            <div class="w-[12px] h-[12px] bg-[#263A6D] rounded-full" />
          </div>
        </template>
      </template>
      <template #checked>
        <span class="ml-1 text-sm select-none">深色</span>
      </template>
      <template #unchecked>
        <span class="ml-1 text-sm select-none color-[#61A2F6]">浅色</span>
      </template>
    </n-switch>
  </client-only>
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
:deep(.n-switch .n-switch__rail .n-switch__button) {
  background-color: rgba($color: #3875c5, $alpha: 0.8) !important;
}
</style>
