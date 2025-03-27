<script setup lang="ts">
const { getFinishedInfo, getFinishedWhere, damageFinished, convertFinished } = useFinished()
const { finishedInfo, finishedFilterList, finishedFilterListToArray } = storeToRefs(useFinished())

const { $toast } = useNuxtApp()
const productName = ref('')
// 成品列表详情
useSeoMeta({
  title: finishedInfo.value.name,
})
productName.value = finishedInfo.value.name

const route = useRoute()
const router = useRouter()
const isModel = ref(false)
const convertModel = ref(false)
const selectConvertType = ref()
const converOption = ref([{
  label: '成品',
  value: GoodsType.ProductFinish,
}, {
  label: '旧料',
  value: GoodsType.ProductOld,
}])
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

// 转换
async function convert(type: ProductFinisheds['type']) {
  const res = await convertFinished({ id: finishedInfo.value.id, type })
  if (res?.code === HttpCode.SUCCESS) {
    convertModel.value = false
    isModel.value = false
    reason.value = ''
    $toast.success('转换成功', 1000)
    setTimeout(() => {
      router.back()
    }, 1000)
  }
  else {
    $toast.error(res?.message ?? '转换失败')
  }
}

function submitConvert() {
  if (!selectConvertType.value) {
    $toast.error('请选择转换类型')
    return
  }
  convert(selectConvertType.value)
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
                <!-- 旧料 转成品 -->
                <template v-if="finishedInfo.type === GoodsType.ProductOld">
                  <div class="flex-1">
                    <common-button-rounded content="转成品" color="#000" bgc="#FFF" @button-click="convert(GoodsType.ProductFinish)" />
                  </div>
                </template>
                <!-- 成品 -->
                <template v-if="finishedInfo.type === GoodsType.ProductFinish">
                  <!-- 报损可以转换 成品或者旧料 -->
                  <template v-if="finishedInfo.status === GoodsStatus.ProductStatusDamage">
                    <div class="flex-1">
                      <common-button-rounded content="转成品/旧料" color="#000" bgc="#FFF" @button-click="convertModel = true" />
                    </div>
                  </template>
                  <template v-else>
                    <div class="flex-1">
                      <common-button-rounded content="报损" color="#000" bgc="#FFF" @button-click="goLoss" />
                    </div>
                  </template>
                  <div class="flex-1">
                    <common-button-rounded content="编辑" @button-click="jump('/product/manage/edit', { code: finishedInfo.code })" />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </common-layout-center>
    <common-model v-model="convertModel" title="转成品/旧料" :show-ok="true" @confirm="submitConvert">
      <div class="min-h-[100px]">
        <n-select
          v-model:value="selectConvertType"
          menu-size="large"
          placeholder="转换为成品或旧料"
          :options="converOption"
        />
      </div>
    </common-model>
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
            <van-icon name="arrow" color="#808089" />
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
