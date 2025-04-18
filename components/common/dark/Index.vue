<script setup lang="ts">
const { $colorMode } = useNuxtApp()
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
    <n-switch
      v-model:value="mode"
      size="large"
    >
      <template #icon>
        <template v-if="!mode">
          <icon name="i-svg:sun" :size="20" :color="!mode ? '#3971F3' : '#FFF'" />
        </template>
        <template v-else>
          <icon name="i-icon:moon" :size="20" :color="mode ? '#3971F3' : '#FFF'" />
        </template>
      </template>
      <template #checked>
        <span class="ml-1 text-sm select-none">深色</span>
      </template>
      <template #unchecked>
        <span class="ml-1 text-sm select-none">浅色</span>
      </template>
    </n-switch>
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
