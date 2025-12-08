<script setup lang="ts">
const props = withDefaults(defineProps<{
  confirm?: boolean
}>(), {
  confirm: false,
})

const emits = defineEmits(['change'])

const { $toast } = useNuxtApp()

const { getMyRegion, switchRegion } = useRegion()
const { myRegionList, myRegion } = storeToRefs(useRegion())
const columns = ref()
const confirmShow = ref(false)
const getList = async () => await getMyRegion()

if (!myRegion.value || !Object.keys(myRegionList.value).length) {
  await getList()
}

// 使用确认弹窗的方式
const useConfirmFunction = () => {
  confirmShow.value = true
}

const saveRegionId = ref('')
// 确定使用
const ConfirmUse = async () => {
  const regioned = myRegionList.value.find(item => item.id === saveRegionId.value)
  if (regioned) {
    switchRegion(regioned)
    emits('change')
    saveRegionId.value = ''
  }
}
const searchKeyword = ref<string>('')
const filteredColumns = computed(() => {
  if (!searchKeyword.value)
    return columns.value || []
  return (columns.value || []).filter((item: { label: string }) =>
    item.label.toLowerCase().includes(searchKeyword.value.toLowerCase()),
  )
})
const show = ref<boolean>(false)
async function changeRegion() {
  show.value = true
  await getList()
  columns.value = []
  if (!myRegionList.value.length) {
    $toast.error('暂未分配区域')
  }
  myRegionList.value.forEach((item: Region) => {
    columns.value.push({ label: item.name, key: item.id })
  })
}

function handleSelect(id: Stores['id']) {
  saveRegionId.value = id
  if (props.confirm) {
    columns.value = []
    useConfirmFunction()
    return false
  }
  const regioned = myRegionList.value.find(item => item.id === id)
  if (regioned) {
    switchRegion(regioned)
    saveRegionId.value = ''
    emits('change')
  }
}
</script>

<template>
  <div class="">
    <div
      class="py-[8px] px-[12px] border-rd-full h-full flex-center-row  cursor-pointer"
      @click="changeRegion">
      <client-only>
        <div class="store-name font-bold text-size-[14px] mr-[4px]">
          {{ myRegion.name || '选择区域' }}
        </div>
      </client-only>
      <icon name="i-icon:product-toggle" :size="18" />
    </div>
    <common-model v-model="show" title="切换区域" :show-cancel="false">
      <div>
        <div class="py-[16px]">
          <n-input
            v-model:value="searchKeyword"
            placeholder="搜索区域名称"
            clearable
            :item-style="{ background: '#333' }"
          >
            <template #prefix>
              <icon name="i-icon:search" :size="16" />
            </template>
          </n-input>
        </div>
        <div class="h-[270px] overflow-y-auto">
          <template v-for="value in filteredColumns" :key="value.key">
            <div
              class="py-[12px] px-[16px]
                    text-color
                    line-color-b cursor-pointer
                    light:hover:bg-[#f5f5f5]
                    dark:hover:bg-[#1C3A62]
                    hover:rounded-[4px]" @click="handleSelect(value.key)">
              {{ value.label }}
            </div>
          </template>
        </div>
      </div>
    </common-model>
    <common-confirm
      v-model:show="confirmShow"
      title="提示"
      text="是否切换当前区域?"
      textb="切换当前区域则重置下列表单?"
      icon="error"
      cancel-text="否"
      confirm-text="是"
      @submit="ConfirmUse"
      @cancel="confirmShow = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.store-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
</style>
