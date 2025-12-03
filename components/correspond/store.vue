<script lang="ts" setup>
const props = defineProps<{
  correspondIds: Array<string>
}>()

const { switchStore, hasStored } = useStores()
const { myStoreList, myStore } = storeToRefs(useStores())
/** 是否要切换选择门店 */
const isGoChangestore = ref(false)

if (props.correspondIds?.length) {
  // 是否有该门店的权限
  const isPermissions = await hasStored(props.correspondIds)
  /**
   * 单门店不参与切换门店的操作 因为默认第一个门店会自动切换到该门店
   * 有权限并且当前门店不是需操作的门店
   */
  if (myStoreList.value.length !== 1 && isPermissions && !props.correspondIds.filter(Boolean).includes(myStore?.value?.id)) {
    isGoChangestore.value = true
  }
}

const changeStore = ref()

async function change(store: Stores) {
  changeStore.value = store
}

async function confirm() {
  if (changeStore.value) {
    await switchStore(changeStore.value)
  }
  isGoChangestore.value = false
}
</script>

<template>
  <div>
    <template v-if="isGoChangestore">
      <div class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex-center-row z-[999]">
        <div class="w-[327px] rounded-[24px] px-[16px] py-[24px]  bg-[#f3f3f3]">
          <div class="flex-center-row">
            <div class="font-semibold line-height-[20px] color-[#333] dark:color-[#fff] text-[14px] text-center text-[14px]">
              提醒
            </div>
          </div>
          <div class="line-height-[20px] color-[#333] dark:color-[#fff] py-[16px] text-center">
            当前门店与操作门店不匹配，是否切换门店?
          </div>
          <div class="flex pb-4 items-center justify-center">
            <div class="pr-2">
              切换门店
            </div>
            <correspond-change max-height="260px" @change="change" />
          </div>
          <div class="flex justify-center">
            <div class="cancle" @click="isGoChangestore = false">
              取消
            </div>
            <div class="confirm" @click="confirm">
              确认
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.confirm {
  --uno: 'shadow-[0px_8px_8px_0px_rgba(57,113,243,0.24)] cursor-pointer shadow-[0px_8px_8px_0px_rgba(57,113,243,0.24)] py-[6px] px-[44px] text-[16px] font-semibold line-height-[24px] text-center color-[#fff] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-3xl';
}
.cancle {
  --uno: 'shadow-[0px_8px_8px_0px_rgba(57,113,243,0.24)] cursor-pointer px-[44px] py-[6px] text-[16px] font-semibold mr-2 line-height-[24px] color-[#3971F3] bg-[#fff] rounded-3xl  shadow-[0px_8px_8px_0px_rgba(57,113,243,0.24)]';
}
</style>
