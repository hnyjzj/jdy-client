<script lang="ts" setup>
const props = defineProps<{
  total: number
  limit: number
}>()

const page = defineModel('page', { default: 1 })
const pageCount = computed(() => {
  // 总数 除以  请求条数 =  页数
  return Math.ceil(props.total / props.limit)
})
// 回到顶部  点击分页触发
const goTop = () => {
  document.documentElement.scrollIntoView({
    block: 'start',
  })
}
const updatePage = (p: number) => {
  goTop()
  page.value = p
}
</script>

<template>
  <div>
    <div class="py-[16px] flex-center-row">
      <n-pagination
        v-model:page="page"
        :style="{
          '--n-item-text-color-active': '#4678B9',
          '--n-item-border-active': '1px solid #2976EF',
          '--n-item-text-color-hover': '#333',
        }" :page-count="pageCount"
        :page-slot="6"

        size="large"
        @update:page="updatePage"
      />
    </div>
  </div>
</template>
