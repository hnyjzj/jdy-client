<script lang="ts" setup>
const props = defineProps<{
  title?: string
}>()

const emits = defineEmits<{
  close: []
}>()
const show = defineModel({ type: Boolean, default: false })
watch(show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden' // 禁止滚动
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
      <div class="flex-1" />
      <div class="content">
        <div class="title">
          <template v-if="props.title">
            <div class="top">
              <div class="name">
                <NuxtImg
                  class="img1"
                  src="/images/model/title1.png"
                  width="80"
                />
                <NuxtImg
                  class="img2"
                  src="/images/model/title2.png"
                  width="176"
                />
                <div class="name">
                  {{ props.title }}
                </div>
              </div>
            </div>
          </template>
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
      --uno: 'relative h-50px border-rd-[20px_20px_0_0] mt-40px';
      background: linear-gradient(to right, rgba(147, 211, 245, 1), rgba(56, 101, 252, 1));
      .close {
        --uno: 'absolute top-[10px] right-[20px]';
      }
      .top {
        --uno: 'absolute bottom-[14px] left-[0px] border-rd-[20px_20px_0_0]';
        background: red;
        .name {
          .img1 {
            --uno: 'absolute bottom-0 z-[3]';
          }
          .img2 {
            --uno: 'z-[2] pl-[58px] absolute bottom-4px';
          }
          .name {
            --uno: 'absolute left-[80px] bottom-[8px] z-[9] text-[rgba(255,255,255,1)] font-bold text-nowrap text-14px';
            transform: skewY(-4deg);
            transform-origin: bottom left;
          }
        }
      }
    }
    .body {
      --uno: 'border-rd-[20px_0_0_0] mt-[-14px] flex-1 blur-bga';
    }
  }
}
</style>
