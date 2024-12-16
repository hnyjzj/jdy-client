<script lang="ts" setup>
const props = withDefaults(defineProps<{
  nomore?: boolean
}>(), {
  nomore: false,
})
const emits = defineEmits<{
  scrollToBottom: []
}>()
const loadingShow = ref<boolean>(false)
const onScroll = useDebounceFn((e: any) => {
  const scrollTop = e.target.scrollTop
  const scrollHeight = e.target.scrollHeight
  const offsetHeight = Math.ceil(e.target.getBoundingClientRect().height)
  const currentHeight = scrollTop + offsetHeight
  if (currentHeight + 20 >= scrollHeight) {
    loadingShow.value = true
    emits('scrollToBottom')
  }
}, 500)
</script>

<template>
  <div class="pullList" @scroll="onScroll">
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
  height: calc(100vh - 60px);
}
</style>
