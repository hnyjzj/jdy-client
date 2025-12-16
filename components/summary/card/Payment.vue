<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  goldPrice?: string
  payments: Record<string, string>
}>(), {
  title: '',
})

const emit = defineEmits<{
  clickTitle: []
}>()

const id = useId()
const { run, stop } = addMouseEvent(`#${id}`)
onMounted(() => {
  run()
})
onBeforeUnmount(() => {
  stop()
})

const unit = (value: string) => {
  if (value.includes('件数')) {
    return '件'
  }
  if (value.includes('金额')) {
    return '元'
  }
  if (value.includes('笔数')) {
    return '笔'
  }
  if (value.includes('金重')) {
    return 'g'
  }
}
</script>

<template>
  <div>
    <summary-card-layout :title="props.title" @title-click="emit('clickTitle')">
      <template #default>
        <div :id="id" class="grid-12 gap-[12px]">
          <template v-for="(item, key) in props.payments" :key="key">
            <div class="w-[1/4] col-3">
              <div class="color-[#333] dark:color-[#fff] flex justify-center gap-[6px] font-semibold pb-[6px] line-height-[24px] text-center">
                <common-tooltip :val="item" placement="top" /> <span class="text-[12px] font-normal">{{ unit(key) }}</span>
              </div>
              <div class="text-center">
                <div class="color-[#808089] dark:color-[#fff]  text-[12px]  line-height-[24px] ">
                  {{ key }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </summary-card-layout>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
