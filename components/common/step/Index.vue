<script setup lang="ts">
interface StepProps {
  title: string
  subs: number
}

const props = defineProps<{
  description: StepProps[]
  activeIndex: number
}>()
</script>

<template>
  <div class="px-4 py-2">
    <!-- Grid：共 steps*2 - 1 列 -->
    <div
      class="grid items-center"
      :style="{ gridTemplateColumns: `repeat(${props.description.length * 2 - 1}, 1fr)` }"
    >
      <!-- 第一行：圆圈 + 线 -->
      <template v-for="(item, index) in props.description" :key="`top-${index}`">
        <!-- 圆圈（在 grid 奇数列） -->
        <div
          class="flex justify-center"
          :style="{ gridColumn: index * 2 + 1 }"
        >
          <div
            class="w-[10px] h-[10px] rounded-full"
            :style="{
              background: index < props.activeIndex
                ? 'linear-gradient(180deg,#1A6BEB,#6EA6FF)'
                : '#909399',
            }"
          />
        </div>

        <!-- 线（在 grid 偶数列） -->
        <template v-if="index !== props.description.length - 1">
          <div
            class="h-[2px]"
            :style="{
              gridColumn: index * 2 + 2,
              background: index < props.activeIndex - 1 ? '#3C9CFF' : '#909399',
            }"
          />
        </template>
      </template>

      <!-- 第二行：文字，只放在圆圈的列 -->
      <template v-for="(item, index) in props.description" :key="`bottom-${index}`">
        <div
          class="text-center text-[12px] text-[#808089] mt-1"
          :style="{ gridColumn: index * 2 + 1 }"
        >
          {{ item.title }}
        </div>
      </template>
    </div>
  </div>
</template>
