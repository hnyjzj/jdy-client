<script lang="ts" setup>
interface FoldProps {
  title?: string
  /**
   * 标题字体大小
   */
  size?: string
  /**
   * 渐变方向
   */
  direction?: 'left' | 'right'
  /**
   * 渐变起始颜色
   */
  fromColor?: string
  /**
   * 渐变结束颜色
   */
  toColor?: string
  /**
   * 是否展开折叠
   */
  isCollapse?: boolean
}

const props = withDefaults(defineProps<FoldProps>(), {
  size: '14px',
  direction: 'right',
  fromColor: 'rgba(71, 126, 245, 0)',
  toColor: 'rgba(130, 208, 250, 0.8)',
  isCollapse: true,
})

const isShow = ref<boolean>(true)

function toggleShow() {
  if (!props.isCollapse)
    return
  isShow.value = !isShow.value
}
</script>

<template>
  <div class="collapse-item overflow-hidden">
    <div class="rounded-t-[24px] ">
      <div class="title rounded-t-[24px]  cursor-pointer" :style="`background: linear-gradient(to ${direction}, ${fromColor}, ${toColor});font-size:${size};`" @click="toggleShow">
        <template v-if="$slots.title">
          <slot name="title" />
        </template>
        <template v-else>
          <div>{{ props.title }}</div>
        </template>

        <template v-if="isCollapse">
          <div>
            <template v-if="!isShow">
              <icon name="i-icon:arrow" />
            </template>
            <template v-else>
              <icon name="i-icon:arrow-down" size="10" />
            </template>
          </div>
        </template>
      </div>
      <Transition mode="out-in">
        <template v-if="isShow">
          <div class="bg-[#fff] rounded-b-[24px] dark:bg-[rgba(239,240,246,0.1)] overflow-hidden">
            <slot />
          </div>
        </template>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collapse-item {
  --uno: 'flex flex-col bg-[#fff] dark:bg-[rgb(245,245,245,0.1)] border-solid border-1 border-[#EFF0F6] dark:border-[rgb(239,240,246,0.1)] rounded-[24px] ';
  box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.04);

  border-radius: 24px;
  .title {
    --uno: 'flex justify-between items-center py-8px px-16px text-14px font-600 h-[44px] text-#333333 dark:text-#FFFFFF';
  }
}
.collapse-item .v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
