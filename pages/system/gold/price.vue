<script lang="ts" setup>
const { $toast } = useNuxtApp()
const { goldList } = storeToRefs(useGoldPrice())
const { getGoldPrice } = useGoldPrice()
const { getProductWhere } = useProductManage()
const { filterList } = storeToRefs(useProductManage())
const { myStore } = storeToRefs(useStores())
useSeoMeta({
  title: '黄金价格',
})

const recordShow = ref(false)
const changeShow = ref(false)
const newGoldPrice = ref()
await getProductWhere()
console.log('mystore.id', myStore.value.id)

if (myStore.value.id) {
  await getGoldPrice(myStore.value.id)
}

const productType = {
  0: '全部',
  1: '成品',
  2: '旧料',
  3: '配件',
}
async function submit() {
  if (!newGoldPrice.value || newGoldPrice.value <= 0) {
    $toast.error('请输入有效的金价')
  }
//   const data = await setGoldPrice(newGoldPrice.value)
//   if (data.code === HttpCode.SUCCESS) {
//     $toast.success('提交今日最新金价成功')
//   }
//   else {
//     $toast.error(data.message ?? '提交失败')
//   }
//   changeShow.value = false
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-4">
        <div class="mx-4 mb-4 text-[#fff]">
          <product-manage-company />
        </div>
        <div class="blur-bgc rounded-[16px] cursor-pointer mx-4">
          <div class="grid-12 ">
            <div
              class="skew col-4">
              <div class="skew-right" />
              <div class="skew-text history">
                金价历史
              </div>
            </div>
            <div class="col-8 flex justify-end pt-6 pr-6">
              <div class="updata-time">
                最近更新：
                {{ formatTimestampToDateTime(goldList[0]?.updated_at ?? '') }}
              </div>
            </div>
          </div>
          <div class="p-3">
            <template v-for="item in goldList" :key="item.id">
              <div class="grid grid-cols-[60px_auto] pb-4">
                <div class="text-[rgba(0,104,255,1)] text-[24px] pr-2">
                  {{ item.price }}
                </div>
                <div class="flex gap-1">
                  <div>
                    {{ productType[item.product_type] ?? '' }}
                  </div>
                  <div>{{ filterList.material?.preset[item.product_material] ?? '' }}</div>
                  <div>{{ item.product_brand?.map(item => filterList.material?.preset[item]).join(' ') ?? '' }}</div>
                  <div>{{ filterList.quality?.preset[item.product_quality] ?? '' }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </common-layout-center>
    <common-model v-model="changeShow" title="变更金价" :show-ok="true" @confirm="submit">
      <div>
        <div class="flex justify-between items-center mb-2">
          <div>
            金价1
            <span class="text-red">*</span>
          </div>
          <div class="w-[32px] h-[32px] rounded-full bg-[#FFF]" />
        </div>
        <n-input-number placeholder="价格" />
        <div>
          <n-select />
        </div>
      </div>
    </common-model>
    <common-model v-model="recordShow" :show-cancel="false" title="操作记录">
      <div class="flex overflow-x-scroll">
        <template v-if="goldList.length">
          <div>
            <table>
              <thead>
                <tr class="text-color">
                  <th class="text">
                    金价
                  </th>
                  <th class="text">
                    类型
                  </th>
                  <th class="text">
                    材质
                  </th>
                  <th class="text">
                    成色
                  </th><th class="text">
                    品牌
                  </th>
                  <th class="text">
                    操作人
                  </th>
                  <th class="text">
                    操作时间
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in goldList" :key="index" class="my-1 text-color-light" />
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </common-model>
    <common-button-bottom confirm-text="变更金价" cancel-text="操作记录" @confirm="changeShow = true" @cancel="recordShow = true" />
  </div>
</template>

<style lang="scss" scoped>
.gold {
  --uno: 'p-4';
  .gold-price {
    --uno: 'px-4 py-3 rounded-[16px] blur-bgc flex justify-between items-center p4 text-color';
  }
  .change {
    --uno: 'bg-[rgba(0,104,255,1)] py-2 px-4 rounded-[14px] text-sm flex items-center text-#fff';
  }
}
.history {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text {
  --uno: 'px-2 text-center';
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
::-webkit-scrollbar {
  /* 隐藏Webkit浏览器的滚动条 */
  display: none;
}
.updata-time {
  --uno: 'bg-[rgba(199,218,255,1)] px-[10px] py-[4px] text-[rgba(75,87,109,1)] rounded-full';
}
</style>
