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
  <div>
    <div class="px-[12px] bg-[#FFFFFF66] border-rd-full text-size-[20px] shadow-lg flex items-center">
      <div class=" left-[10px] top-[6px]">
        <icon name="i-icon:search" size="12" />
      </div>
      <div class="text-size-[14px] line-height-[20px] flex-1">
        <input
          v-model="searchKey" type="search" autocomplete="off" class="bg-transparent text-[#FFF] w-full border-0 placeholder-text-[#fff] flex-1 py-[6px] pl-[4px] line-height-[24px]" :placeholder="props.placeholder"
          @focus="focus"
          @keyup.enter="subsearch()">
      </div>
      <div v-if="searchKey" @click="clear()">
        <icon name="i-icon:search-close" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
}
</style>
