<script lang="ts" setup>
const emits = defineEmits<{
  close: []
}>()
const show = defineModel({ type: Boolean, default: false })
watch(show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'// 禁止滚动
  }
  else {
    document.body.style.overflow = ''
  }
})

function close() {
  show.value = false
  emits('close')
}
</script>

<template>
  <div v-if="show" class="popup">
    <div class="flex h-full justify-between">
      <div class="flex-1" @touchmove.prevent.stop @mousemove.prevent.stop />
      <div class="content" @touchmove.prevent.stop @mousemove.prevent.stop>
        <div class="title">
          <div class="close" @click="close">
            <van-icon name="cross" color="#fff" size="14" />
          </div>
        </div>
        <div class="body overflow-y-auto">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  --uno: 'fixed left-0 right-0 top-0 bottom-0 w-[100vw] h-[100vh] z-999 overflow-hidden';
  background: rgba($color: #000, $alpha: 0.3);
  .content {
    --uno: 'h-[100%] w-[86%] sm:w-[86%] md:w-[86%] lg:w-[66%] flex flex-col';
    .title {
      --uno: 'relative h-50px border-rd-[20px_20px_0_0] mt-20px';
      background: linear-gradient(to right, rgba(147, 211, 245, 1), rgba(56, 101, 252, 1));
      .close {
        --uno: 'absolute top-[10px] right-[20px]';
      }
    }
    .body {
      --uno: 'border-rd-[20px_0_0_0] mt-[-14px] flex-1 blur-bga';
    }
  }
}
</style>
