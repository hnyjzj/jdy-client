<script lang="ts" setup>
const emit = defineEmits<{
  addto: [id: number] // 具名元组语法
}>()
const addto = () => {
  emit('addto', 1)
}
</script>

<template>
  <div class="addto">
    <NuxtImg src="/images/summary/addto.png" width="56" @click="addto" />
  </div>
</template>

<style lang="scss" scoped>
.addto {
  --uno: 'fixed bottom-78px right-14px w-56px h56px flex justify-center items-center';
}
</style>
