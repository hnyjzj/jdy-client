<script setup lang="ts">
const { getOldInfo, getOldWhere, convertOld } = useOld()
const { oldInfo, oldFilterList, oldFilterListToArray } = storeToRefs(useOld())

const { $toast } = useNuxtApp()
const productName = ref('')
// 成品列表详情
useSeoMeta({
  title: oldInfo.value.name,
})
productName.value = oldInfo.value.name

const route = useRoute()
const router = useRouter()
const isModel = ref(false)
const convertModel = ref(false)
// 报损原因
const reason = ref('')
if (route.query.id) {
  await getOldInfo(route.query.id as string)
}
await getOldWhere()

function goLoss() {
  isModel.value = true
}

// 转换
async function convert(type: ProductFinisheds['type']) {
  const res = await convertOld({ id: oldInfo.value.id, type })
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
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-6 pb-18 px-4">
        <product-manage-info :info="oldInfo" :filter-list="oldFilterList" :filter-list-to-array="oldFilterListToArray" @go-loss="goLoss" />
        <div class="bottom">
          <div class="sm:grid-12">
            <div uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
              <div class="px-2 py-2 flex gap-2">
                <!-- 旧料 转成品 -->
                <div class="flex-1">
                  <common-button-rounded content="转成品" color="#FFF" @button-click="convert(GoodsType.ProductFinish)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </common-layout-center>
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
