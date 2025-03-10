<script lang="ts" setup>
const emits = defineEmits<{
  goAdd: []
  batch: []
}>()
const isModel = defineModel<boolean>('isModel', { default: false, required: true })
function batchFun() {
  isModel.value = false
  emits('batch')
}
</script>

<template>
  <div>
    <common-model v-model="isModel" title="入库">
      <div class="mb-8 min-h-[60px] flex">
        <div class="box" @click="batchFun">
          <div class="batch green">
            <img class="block" src="/images/icon/export.png" width="24" height="24">
          </div>
          <div class="export-text">
            批量导入
          </div>
        </div>
        <div class="box ml-2" @click="emits('goAdd')">
          <div class="batch yellow">
            <img class="block" src="/images/icon/export.png" width="24" height="24">
          </div>
          <div class="export-text">
            手动添加
          </div>
        </div>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>
.box {
  --uno: 'flex flex-col items-center w-[104px] h-[82px] rounded-[18px] bg-[rgba(255,255,255,1)] dark:bg-[rgba(0,0,0,0.3)]';
}
.batch {
  --uno: 'flex justify-center items-center w-36px h-36px rounded-full mt-3';
  background: linear-gradient(90deg, rgba(26, 107, 235, 1), rgba(110, 166, 255, 1));
}
.green {
  background: linear-gradient(90deg, rgba(26, 107, 235, 1), rgba(110, 166, 255, 1));
}
.yellow {
  background: linear-gradient(90deg, rgba(11, 193, 150, 1), rgba(28, 232, 133, 1));
}
.export-text {
  --uno: 'text-color text-14px pb-2 pt-2.5';
}
</style>
