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
  searchKeyword.value = ''
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
}

const clickChange = async () => {
  await changeStoer()
  mask.value = true
}
</script>

<template>
  <div>
    <div
      class="py-[6px] px-[16px] border-rd-full h-full flex-center-row cursor-pointer text-color"
      :style="{ background: 'transparent', color: props.isWhite ? '#fff' : '' }" @click="clickChange">
      <icon name="i-icon:location" :size="24" class="mr-[4px]" />
      <div class="store-name font-bold text-size-[14px] mr-[4px] z-1">
        {{ myStore.alias }}
      </div>
      <icon name="i-icon:product-toggle" :size="18" />
    </div>

    <correspond-select v-model="mask" :stores="myStoreList" :current-store-id="myStore.id" @select="handleSelect" />

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
