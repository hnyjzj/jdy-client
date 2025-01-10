<script setup lang="ts">
interface Props {
  /**
   * 标签主题色
   * ‘orange’ | ‘red’ | ‘green’ | ‘lake’ | ‘pink’ | ‘greyblue’ | ‘grey’ | ‘black’
   */
  type?: colors
  /**
   * 文本内容
   */
  text: string
  /**
   * 是否为异形标签
   */
  isOval?: boolean
}

// 接收一个标签主题色
const props = withDefaults(defineProps<Props>(), {
  type: 'orange',
})

type Tags = {
  backgroundColor?: string
  color?: string
} & Partial<Props>

type colors =
  | 'orange'
  | 'red'
  | 'green'
  | 'lake'
  | 'pink'
  | 'greyblue'
  | 'grey'
  | 'black'

const tagStyle: { [key in colors]: Tags } = {
  orange: {
    // 标签背景色
    backgroundColor: '#fff4cd',
    // 标签字体颜色
    color: '#dd9200',
  },
  red: {
    backgroundColor: '#ffd5d8',
    color: '#cc0000',
  },
  green: {
    backgroundColor: '#baffd6',
    color: '#106633',
  },
  lake: {
    backgroundColor: '#a2f5f0',
    color: '#2b6662',
  },
  pink: {
    backgroundColor: '#fbe2ff',
    color: '#cc00b8',
  },
  greyblue: {
    backgroundColor: '#c7daff',
    color: '#4b576d',
  },
  grey: {
    backgroundColor: '#e6e6e8',
    color: '#4b576d',
  },
  black: {
    backgroundColor: '#333333',
    color: '#ffffff',
  },
}
</script>

<template>
  <div
    class="flex-start px-[8px] text-size-[16px] min-w-fit"
    :style="{
      backgroundColor: tagStyle[props.type].backgroundColor,
      color: tagStyle[props.type].color,
      borderRadius: props.isOval ? '100px 10px / 120px' : '8px',
    }"
  >
    {{ props.text }}
  </div>
</template>
