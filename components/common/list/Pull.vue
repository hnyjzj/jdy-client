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
const loadingShow = ref<boolean>(false)
const onScroll = useDebounceFn((e: any) => {
  const scrollTop = e.target.scrollTop
  const scrollHeight = e.target.scrollHeight
  const offsetHeight = Math.ceil(e.target.getBoundingClientRect().height)
  const currentHeight = scrollTop + offsetHeight
  if (currentHeight + 20 >= scrollHeight) {
    loadingShow.value = true
    emits('pull')
  }
}, 300)
</script>

<template>
  <div
    class="pullList" :style="{ height: `calc(100vh - (${props.distance} + 'px'))` }" @scroll="onScroll">
    <slot name="default" />
    <template v-if="loadingShow && !props.nomore">
      <div class="flex-center-row py-[16px]">
        <van-loading color="#0094ff">
          加载中...
        </van-loading>
      </div>
    </template>
    <template v-else-if="props.nomore">
      <div class="flex-center-row py-[16px] color-[#666] text-[14px]">
        没有更多数据了~
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.pullList {
  --uno: 'px-[16px] pb-10px';
  overflow: auto;
  height: calc(100vh - 62px);
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
