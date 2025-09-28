<script setup lang="ts">
import { nextTick } from 'vue'

const props = withDefaults(defineProps<{
  confirm?: boolean
  maxHeight?: string
  bg?: boolean
}>(), {
  confirm: false,
  maxHeight: '400px',
  bg: true,
})

const emits = defineEmits(['change'])

const { $toast } = useNuxtApp()

const { getMyStore, switchStore } = useStores()
const { myStoreList, myStore } = storeToRefs(useStores())
const { initObjForm } = useOrder()
const columns = ref()
const confirmShow = ref(false)
const dropdownRef = ref<any>(null) // 👉 用于获取 dropdown DOM
const saveStoreId = ref('')

const getList = async () => await getMyStore()

if (!myStore.value || !Object.keys(myStoreList.value).length) {
  await getList()
}

// 打开确认弹窗
const useConfirmFunction = () => {
  confirmShow.value = true
}

// 确定切换
const ConfirmUse = async () => {
  const stored = myStoreList.value.find(item => item.id === saveStoreId.value)
  if (stored) {
    switchStore(stored)
    emits('change')
    saveStoreId.value = ''
  }
}

// 拉取门店并生成下拉数据
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

// 选择门店
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
}

// 打开下拉时自动滚动到当前选中项
function handleShow(show: boolean) {
  if (show) {
    nextTick(() => {
      const list = dropdownRef.value?.$el?.querySelectorAll('.n-dropdown-option')
      if (!list)
        return
      const current = [...list].find(
        (el: any) => el?.dataset?.key === myStore.value?.id,
      )
      current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    })
  }
}

const renderLabel = (option: any) => {
  return h('span', { style: 'color: #000' }, option.label)
}
</script>

<template>
  <div>
    <n-dropdown
      ref="dropdownRef"
      key="id"
      trigger="click"
      placement="bottom-start"
      :render-label="renderLabel"
      :value="myStore?.id"
      :options="columns"
      :scrollable="true"
      :style="{ maxHeight: props.maxHeight, overflowY: 'auto' }"
      @select="handleSelect"
      @update:show="handleShow"
    >
      <div
        class="py-[6px] px-[12px] border-rd-full h-full flex-center-row cursor-pointer"
        :class="{ 'shadow-lg': props.bg }"
        :style="{ background: props.bg ? '#FFFFFF66' : 'transparent' }"
        @click="changeStoer"
      >
        <client-only>
          <div class="store-name font-bold text-size-[14px] mr-[4px]">
            {{ myStore.alias }}
          </div>
        </client-only>
        <icon name="i-icon:product-toggle" :size="24" />
      </div>
    </n-dropdown>

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
</style>
