<script lang="ts" setup>
import type { DropdownOption } from 'naive-ui'

const options = [
  {
    label: '你好.我是',
    key: '1',
  },
  {
    label: '麻烦您了',
    key: '2',
  },
  {
    label: '谢谢',
    key: '3',
  },
  {
    label: '回头见',
    key: '4',
  },

]
const handleSelect = (_: string, option: DropdownOption) => {
  console.log(option.label)
}
</script>

<template>
  <div class="flex items-center">
    <n-dropdown trigger="hover" :options="options" @select="handleSelect">
      <div class="phrasebtn cursor-pointer">
        常用语
      </div>
    </n-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.phrasebtn {
  width: fit-content;
  padding: 6px 12px;
  background-color: #2572ec;
  color: #fff;
  border-radius: 30px;

  margin-right: 6px;
}
</style>
