<script setup lang="ts">
const props = withDefaults(defineProps<{
  confirm?: boolean
  maxHeight?: string
  isWhite?: boolean
}>(), {
  confirm: false,
  maxHeight: '400px',
  isWhite: false,
})

const emits = defineEmits(['change'])

const { $toast } = useNuxtApp()

const { getMyStore, switchStore } = useStores()
const { myStoreList, myStore } = storeToRefs(useStores())
const { initObjForm } = useOrder()
const columns = ref<{ label: string, key: string }[]>([])
const confirmShow = ref(false)

const mask = ref<boolean>(false)

const searchKeyword = ref('') // 搜索关键词
const filteredColumns = computed(() => {
  if (!searchKeyword.value)
    return columns.value || []
  return (columns.value || []).filter((item: { label: string }) =>
    item.label.toLowerCase().includes(searchKeyword.value.toLowerCase()),
  )
})
const getList = async () => await getMyStore()

if (!myStore.value || !Object.keys(myStoreList.value).length) {
  await getList()
}

// 使用确认弹窗的方式
const useConfirmFunction = () => {
  confirmShow.value = true
}

const saveStoreId = ref('')
// 确定使用
const ConfirmUse = async () => {
  const stored = myStoreList.value.find(item => item.id === saveStoreId.value)
  if (stored) {
    switchStore(stored)
    emits('change')
    saveStoreId.value = ''
  }
}

async function changeStoer() {
  await getList()
  columns.value = []
  if (!myStoreList.value.length) {
    $toast.error('暂未分配门店')
  }
  myStoreList.value.forEach((item: Stores) => {
    columns.value.push({
      label: `${item.name}${item.alias ? `（${item.alias}）` : ''}`,
      key: item.id,
    })
  })
}

function handleSelect(id: Stores['id']) {
  saveStoreId.value = id
  mask.value = false
  if (props.confirm) {
    columns.value = []
    useConfirmFunction()
    return false
  }
  const stored = myStoreList.value.find(item => item.id === id)
  if (stored) {
    switchStore(stored)
    saveStoreId.value = ''
    initObjForm()
    emits('change')
  }
  mask.value = false
}

const clickChange = async () => {
  await changeStoer()
  mask.value = true
}
</script>

<template>
  <div class="z-10">
    <div
      class="py-[6px] px-[16px] border-rd-full h-full flex-center-row cursor-pointer text-color"
      :style="{ background: 'transparent', color: isWhite ? '#fff' : '' }" @click="clickChange">
      <icon name="i-icon:location" :size="24" class="mr-[4px]" />
      <div class="store-name font-bold text-size-[14px] mr-[4px]">
        {{ myStore.alias }}
      </div>
      <icon name="i-icon:product-toggle" :size="18" />
    </div>
    <common-model v-model="mask" title="切换门店" :show-cancel="false">
      <div>
        <div class="py-[16px]">
          <n-input
            v-model:value="searchKeyword"
            placeholder="搜索门店名称"
            clearable
            :item-style="{ background: '#333' }"
          >
            <template #prefix>
              <icon name="i-icon:search" :size="16" />
            </template>
          </n-input>
        </div>

        <div class="h-[270px] overflow-y-auto">
          <template v-if="filteredColumns.length">
            <template v-for="item in filteredColumns" :key="item.key">
              <div
                class="py-[12px] px-[16px]
                    text-color
                    line-color-b cursor-pointer
                    light:hover:bg-[#f5f5f5]
                    dark:hover:bg-[#1C3A62]
                    hover:rounded-[4px]"
                @click="handleSelect(item.key)">
                {{ item.label }}
              </div>
            </template>
          </template>
          <div v-else class="py-[40px] text-center color-[#999] text-[14px]">
            暂无匹配的门店
          </div>
        </div>
      </div>
    </common-model>

    <common-confirm
      v-model:show="confirmShow"
      title="提示"
      text="是否切换当前门店?"
      textb="切换当前门店则重置下列表单?"
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
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
</style>
