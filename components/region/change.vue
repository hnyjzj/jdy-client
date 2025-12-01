<script setup lang="ts">
const props = withDefaults(defineProps<{
  confirm?: boolean
  maxHeight?: string
}>(), {
  confirm: false,
  maxHeight: '400px',
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

async function changeRegion() {
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
  <div>
    <n-dropdown trigger="click" placement="bottom-start" :options="columns" :style="{ maxHeight: props.maxHeight, overflowY: 'auto' }" @select="handleSelect">
      <div
        class="py-[6px] px-[12px] bg-[#FFFFFF66] border-rd-full h-full flex-center-row  cursor-pointer  "
        @click="changeRegion">
        <client-only>
          <div class="store-name font-bold text-size-[14px] mr-[4px]">
            {{ myRegion.name || '选择区域' }}
          </div>
        </client-only>
        <icon name="i-icon:product-toggle" :size="24" />
      </div>
    </n-dropdown>
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
  width: 80%;
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
