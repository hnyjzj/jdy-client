<script lang="ts" setup>
const props = withDefaults(defineProps<{
  nomore?: boolean
  distance?: number
}>(), {
  nomore: false, // 没有更多数据了
  distance: 60, // 减去上下的距离
})
const emits = defineEmits<{
  // 触底
  pull: []
}>()
const infoShow = defineModel('infoShow', { default: false })
const loading = useTemplateRef('loading')
const targetIsVisible = useElementVisibility(loading)
watch(targetIsVisible, (val) => {
  if (val) {
    emits('pull')
  }
})
</script>

<template>
  <div
    class="pullList">
    <slot name="default" />
    <common-popup v-model="infoShow" placement="left" width="90%" title="订单详情">
      <slot name="info" />
      <template #footer>
        <slot name="footer" />
      </template>
    </common-popup>
    <template v-if="!props.nomore">
      <div ref="loading" class="flex-center-row py-[16px]">
        加载中...
      </div>
    </template>
    <template v-else-if="props.nomore">
      <div class="flex-center-row py-[16px] color-[#333] text-[14px]">
        没有更多数据了~
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.pullList {
  --uno: 'px-[16px] pb-10px min-h-[80vh] bg-gradient-linear-[180deg,#3875C5,#F1F5FE] dark:bg-gradient-linear-[180deg,#3875C5,#07111F]';
  overflow: auto;
}

@media screen and (min-width: 768px) {
  .pullList::-webkit-scrollbar-corner {
    width: 0;
  }
  .pullList::-webkit-scrollbar {
    width: 14px;
    height: 14px;
    background: transparent;
  }
  // 滚动条轨道样式
  .pullList::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0);
    border-left: 1px solid rgba(244, 244, 244, 0);
  }
  .pullList::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 4px solid transparent;
    background-clip: content-box;
    background-color: #bfbfbf;
  }
}
</style>
