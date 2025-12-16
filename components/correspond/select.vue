<script setup lang="ts">
const props = defineProps<{
  stores: Stores[]
  currentStoreId?: string
}>()

const emits = defineEmits<{
  (e: 'select', id: string): void
}>()

const searchKeyword = ref('')

const mask = defineModel({ type: Boolean, default: false })

const filteredStores = computed(() => {
  if (!searchKeyword.value)
    return props.stores
  return props.stores.filter(item =>
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    || (item.alias ?? '').toLowerCase().includes(searchKeyword.value.toLowerCase()),
  )
})

function handleSelect(id: string) {
  emits('select', id)
  searchKeyword.value = ''
}
</script>

<template>
  <common-model
    v-model="mask"
    title="切换门店"
    :is-mask-close="true"
    :show-cancel="false"
  >
    <div class="py-[16px]">
      <n-input v-model:value="searchKeyword" placeholder="搜索门店名称" clearable>
        <template #prefix>
          <icon name="i-icon:search" :size="16" />
        </template>
      </n-input>
    </div>

    <div class="h-[270px] overflow-y-auto">
      <template v-if="filteredStores.length">
        <div
          v-for="item in filteredStores"
          :key="item.id"
          class="py-[12px] px-[16px] cursor-pointer hover:rounded-[4px]"
          :style="{ color: currentStoreId === item.id ? '#0068FF' : '' }"
          @click="handleSelect(item.id)"
        >
          {{ item.name }}{{ item.alias ? `（${item.alias}）` : '' }}
        </div>
      </template>
      <div v-else class="py-[40px] text-center text-[#999] text-[14px]">
        暂无匹配的门店
      </div>
    </div>
  </common-model>
</template>
