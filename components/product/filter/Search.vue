<script setup lang="ts">
const props = withDefaults(defineProps<{
  placeholder?: string
}>(), {
  placeholder: '搜索',
})
const emits = defineEmits<{
  submit: [searchKey: string]
  clear: []
}>()
const searchKey = defineModel<string>('searchKey', { required: false, default: '' })
const subsearch = () => {
  emits('submit', searchKey.value)
}
const clear = () => {
  searchKey.value = ''
  emits('clear')
}
</script>

<template>
  <div class="pt-[12px]">
    <div class="bg-[#F1F5FE] px-[18px] border-rd-full text-size-[20px] shadow-lg flex items-center">
      <div class="left-[10px] top-[6px]" @click="subsearch()">
        <icon name="i-icon:search" size="12" color="#808089" />
      </div>
      <div class="text-size-[14px] line-height-[20px] flex-1">
        <input
          v-model="searchKey" type="search" autocomplete="off" class="bg-[#F1F5FE] text-[#808089] w-full border-0 placeholder-text-[#808089] flex-1 py-[6px] pl-[4px] line-height-[24px]" :placeholder="props.placeholder"
          @keyup.enter="subsearch()">
      </div>
      <div v-if="searchKey" @click="clear()">
        <icon name="i-icon:search-close" color="#666" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
}
</style>
