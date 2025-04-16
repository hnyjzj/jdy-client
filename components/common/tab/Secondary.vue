<script setup lang="ts">
// 二级tab切换
interface Options {
  label: string
  value: number
  count?: number
  disabled?: boolean
}

const props = defineProps<{
  options: Options[]
  currentSelected: number
}>()

const emits = defineEmits<{
  changeStatus: [searchKey: number]
  clear: []
}>()
function change(val: number) {
  emits('changeStatus', val)
}
</script>

<template>
  <div class="flex-center-between gap-1 bg-[#f1f5fe] border-solid border border-[#E6E6E8] rounded-[24px]">
    <template v-for="item in props.options" :key="item.value">
      <div
        class="flex-center-row flex-1 px-4 py-2 w-auto text-3.5 text-[#666666] font-medium rounded-[24px]"
        :style="{ color: item.value === currentSelected ? '#3971F3' : '#666666', background: item.value === currentSelected ? '#FFFFFF' : '', fontWeight: item.value === currentSelected ? 'bold' : 'normal' }"
        @click="change(item.value)"
      >
        <span class="whitespace-nowrap">
          {{ item.label }}
        </span>
        <template v-if="item.count">
          <span>
            <!-- 插入数量 -->
            {{ item.count || 0 }}
          </span>
        </template>
      </div>
    </template>
  </div>
</template>
