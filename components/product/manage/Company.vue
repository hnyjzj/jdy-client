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
  <div class="">
    <div
      class="py-[6px] px-[16px] border-rd-full h-full flex-center-row cursor-pointer text-color"
      :style="{ background: 'transparent', color: isWhite ? '#fff' : '' }" @click="clickChange">
      <icon name="i-icon:location" :size="24" class="mr-[4px]" />
      <div class="store-name font-bold text-size-[14px] mr-[4px]">
        {{ myStore.alias }}
      </div>
      <icon name="i-icon:product-toggle" :size="18" />
    </div>
    <template v-if="mask">
      <div class="mask" uno-sm="flex justify-center items-center">
        <div class="content text-color blur-bgc w-full py-[12px] px-[16px] fixed bottom-0" uno-sm="w-394px relative">
          <div class=" flex justify-between items-center">
            <div class="flex-center-row gap-[6px]">
              <div class="w-[4px] h-[16px] rounded-2xl bg-[#1A6DD8]" />
              <div class="color-[#1A6DD8] text-[16px] line-height-[24px] font-bold">
                切换门店
              </div>
            </div>
            <div class=" hover:color-[#1A6DD8] cursor-pointer" @click.stop="mask = false">
              <icon name="i-icon:close" :size="24" />
            </div>
          </div>
          <div class="py-[16px]">
            <n-input
              v-model:value="searchKeyword"
              placeholder="搜索门店名称"
              clearable
              :item-style="{ backgroud: '#333' }"
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
      </div>
    </template>

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

<style lang="scss">
.n-dropdown-option:nth-child(odd) {
  background-color: #fafafa;
}
.n-dropdown-option:nth-child(even) {
  background-color: #ffffff;
}
.n-dropdown-option-body__label {
  display: flex;
  align-items: center;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  .content {
    --uno: ' rounded-[8px]';
  }
}
</style>
