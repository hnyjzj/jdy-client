<script setup lang="ts">
interface Props {
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '加载中',
})
const show = defineModel({ type: Boolean, default: false })

watch(show, (val) => {
  if (val) {
    // 禁止滚动
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = ''
  }
})

/** 销毁时 */
onBeforeUnmount(() => {
  show.value = false
  document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="show" class="popup">
    <div class="content">
      <div class="cirque" />
      <div>
        {{ props.title }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.popup {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(#000, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
  }

  .cirque {
    width: 48px;
    height: 48px;
    border: 4px solid #fff;
    border-color: #fff transparent #fff transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 12px;
  }
}
</style>
