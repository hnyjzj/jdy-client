<script lang="ts" setup>
const porps = defineProps<{
  storeList: Stores[]
}>()
const emits = defineEmits<{
  getStoreList: []
  handleSelect: [id: Stores['id']]
}>()
const { $toast } = useNuxtApp()
// 门店选择列表
const columns = ref()
const store = defineModel('store', { default: { name: '' } })
// 选择门店
const choiceStore = () => {
  columns.value = []
  emits('getStoreList')
  if (!porps.storeList.length) {
    $toast.error('暂未分配门店')
  }
  porps.storeList.forEach((item: Stores) => {
    columns.value.push({ label: item.name, key: item.id })
  })
}
</script>

<template>
  <div>
    <div class="pb-[16px]">
      <div class="blur-bgc rounded-[16px] py-[8px] px-[16px] flex-between items-center">
        <div class="flex-1 dark:color-[#fff]">
          {{ store.name }}
        </div>
        <n-dropdown trigger="click" :options="columns" @select="(e) => { emits('handleSelect', e) }">
          <div class="bg-[#0068FF] py-[10px] px-[16px] rounded-[40px] color-[#fff] flex items-center w-auto" @click="choiceStore">
            <icon name="i-icon:product-toggle" :size="16" /> <div class="pl-[4px]">
              切换门店
            </div>
          </div>
        </n-dropdown>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
