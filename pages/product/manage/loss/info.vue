<script setup lang="ts">
const { getLossWhere, getLossInfo, convertLoss } = useLoss()
const { lossInfo, lossFilterList, lossFilterListToArray } = storeToRefs(useLoss())

const productName = ref('')
// 成品列表详情
useSeoMeta({
  title: lossInfo.value.name,
})
productName.value = lossInfo.value.name
const { $toast } = useNuxtApp()

const route = useRoute()
const router = useRouter()
const isModel = ref(false)
const convertModel = ref(false)
const selectConvertType = ref()
// 报损原因
if (route.query.code) {
  await getLossInfo(route.query.code as string)
}
await getLossWhere()

function goLoss() {
  isModel.value = true
}

const converOption = ref([{
  label: '成品',
  value: GoodsType.ProductFinish,
}, {
  label: '旧料',
  value: GoodsType.ProductOld,
}])

// 转换
async function convert(type: ProductFinisheds['type']) {
  const res = await convertLoss({ id: lossInfo.value.id, type })
  if (res?.code === HttpCode.SUCCESS) {
    convertModel.value = false
    isModel.value = false
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
        <product-manage-info :product-info="lossInfo" :filter-list="lossFilterList" :filter-list-to-array="lossFilterListToArray" @go-loss="goLoss" />
        <div class="bottom">
          <div class="sm:grid-12">
            <div uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
              <div class="px-2 py-2 flex gap-2">
                <!-- 成品 -->
                <template v-if="lossInfo.type === GoodsType.ProductFinish">
                  <!-- 报损可以转换 成品或者旧料 -->
                  <template v-if="lossInfo.status === GoodsStatus.ProductStatusDamage">
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
                    <common-button-rounded content="编辑" @button-click="jump('/product/manage/edit', { code: lossInfo.code })" />
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
