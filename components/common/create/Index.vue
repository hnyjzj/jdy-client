<script lang="ts" setup>
const emits = defineEmits(['create'])
const create = () => {
  emits('create')
}
</script>

<template>
  <div class="createbox cursor-pointer" @click="create">
    <div
      class="create2">
      <div class="row" />
      <div
        class="cols" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.createbox {
  --uno: 'pos-fixed bottom-[77px] right-[14px] wh-[56px] bg-gradient-linear-[40deg,#236CFA,#0085FFC3,#59C6E5] rounded-full flex justify-center items-center';
}
.create2 {
  --uno: 'pos-fixed wh-[52px] bg-gradient-linear-[40deg,#005BFF,#0085FFC3,#49BEE6] rounded-full flex justify-center items-center pos-relative';
}
.row {
  --uno: 'w-[20px] h-[4px] rounded-full bg-gradient-linear-[40deg,#FFFFFF,#BCCEFF]';
}
.cols {
  --uno: 'w-[20px] h-[4px] rounded-full bg-gradient-linear-[40deg,#FFFFFF,#BCCEFF] pos-absolute rotate-90';
}
</style>
