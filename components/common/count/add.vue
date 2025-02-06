<script lang="ts" setup>
const emits = defineEmits<{
  click: []
}>()
</script>

<template>
  <div class="text-[20px] wh-[20px] flex-center-row color-[#666] dark:color-[#fff] mr-[6px]" @click="emits('click')">
    +
  </div>
</template>
