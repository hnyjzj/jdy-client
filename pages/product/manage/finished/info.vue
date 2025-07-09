<script setup lang="ts">
import { AuthVerify } from '#components'

const { getFinishedInfo, getFinishedWhere } = useFinished()
const { damageFinished } = useLoss()
const { finishedInfo, finishedFilterList, finishedFilterListToArray } = storeToRefs(useFinished())
const { $toast } = useNuxtApp()
const productName = ref('')
// 成品列表详情
useSeoMeta({
  title: finishedInfo.value.name,
})
productName.value = finishedInfo.value?.name || ''

const route = useRoute()
const router = useRouter()
const isModel = ref(false)
// 报损原因
const reason = ref('')
if (route.query.code) {
  await getFinishedInfo(route.query.code as string)
}
await getFinishedWhere()

function goLoss() {
  isModel.value = true
}
// 报损
async function loss() {
  if (!reason.value) {
    $toast.error('请输入报损原因')
    return
  }
  const res = await damageFinished({ code: finishedInfo.value.code, reason: reason.value })
  if (res?.code === HttpCode.SUCCESS) {
    isModel.value = false
    reason.value = ''
    $toast.success('报损成功', 1000)
    setTimeout(() => {
      router.back()
    }, 1000)
  }
  else {
    $toast.error(res?.message ?? '报损失败')
  }
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-6 pb-18">
        <product-manage-info :info="finishedInfo" :filter-list="finishedFilterList" :filter-list-to-array="finishedFilterListToArray" @go-loss="goLoss" />
        <div class="bottom">
          <div class="sm:grid-12">
            <div uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
              <div class="px-2 py-2 flex gap-2">
                <div class="flex-1">
                  <common-button-rounded content="报损" color="#000" bgc="#FFF" @button-click="goLoss" />
                </div>
                <!-- 身份总部以上有编辑权限 -->
                <AuthVerify :min="UserLevel.IdentityHeadquarters">
                  <div class="flex-1">
                    <common-button-rounded content="编辑" @button-click="jump('/product/manage/edit', { code: finishedInfo.code })" />
                  </div>
                </AuthVerify>
              </div>
            </div>
          </div>
        </div>
      </div>
    </common-layout-center>
    <common-model v-model="isModel" title="报损" :show-ok="true" @confirm="loss">
      <div>
        <div class="title">
          数量
        </div>
        <div class="block w-[96px]">
          {{ finishedInfo.num_gem }}
        </div>
      </div>
      <div class="my-4">
        <div class="title">
          条码
        </div>
        <div class="block flex justify-between items-center">
          <div>
            {{ finishedInfo.code }}
          </div>
          <div>
            <icon name="i-icon:arrow" size="12" color="#808089" />
          </div>
        </div>
      </div>
      <div class="mb-4">
        <div class="title">
          原因
        </div>
        <textarea v-model="reason" resize="none" class="area" rows="4" cols="36" name="" />
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>
.title {
  --uno: 'text-color mb-2';
}
.block {
  --uno: 'text-14px px-3 py-10px rounded-[36px] color-[#333] bg-[#EFF0F6] dark:color-[#fff] border-[rgba(230,230,232,0.5)] border-1px border-solid dark:bg-[rgba(230,230,232,0.3)] dark:border-[rgba(230,230,232,0.3)]';
}
.area {
  --uno: 'bg-[#EFF0F6] dark:bg-[rgba(230,230,232,0.3)] border-none p-2 rounded-2';
}

.bottom {
  --uno: 'fixed bottom-0 left-0 right-0 blur-bgc';
}
</style>
