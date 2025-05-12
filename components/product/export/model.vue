<script lang="ts" setup>
const show = defineModel({ type: Boolean, default: false })

const funlist = ref([
  {
    icon: '',
    name: '导出数据',
    color: 'linear-gradient(#1a6beb, #6ea6ff)',
  },
  {
    icon: '',
    name: '导出无图货品',
    color: 'linear-gradient(#0BC196, #1CE885)',
  },
  {
    icon: '',
    name: '批量查条码',
    color: 'linear-gradient(#FFA78F, #F23E2C)',
  },
  {
    icon: '',
    name: '批量报损',
    color: 'linear-gradient(#1a6beb, #6ea6ff)',
  },
  {
    icon: '',
    name: '货品更新',
    color: 'linear-gradient(#0BC196, #1CE885)',
  },
])
</script>

<template>
  <div>
    <common-model v-model="show" title="导出">
      <div class="flex">
        <template v-for="(item, i) in funlist" :key="i">
          <div class="fun">
            <div class="fun-icon" :style="{ background: item.color }" />
            <div class="text-[14px]">
              {{ item.name }}
            </div>
          </div>
        </template>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>
.fun {
  --uno: 'px-[8px] py-[10px] flex flex-col items-center blur-bga border-rd-[16px] mb-[16px] mx-[8px]';
  .fun-icon {
    --uno: 'w-36px h-36px border-rd-[50%] mb-[10px]';
  }
}
</style>
