<script lang="ts" setup>
const { $toast } = useNuxtApp()
const { goldList } = storeToRefs(useGoldPrice())
const { getGoldPrice, setGoldPrice } = useGoldPrice()
const { getProductWhere } = useProductManage()
const { filterList } = storeToRefs(useProductManage())
const { myStore } = storeToRefs(useStores())
useSeoMeta({
  title: '黄金价格',
})

const recordShow = ref(false)
const changeShow = ref(false)
const goldParams = ref([] as UpdataGoldParams[])
await getProductWhere()
if (myStore.value.id) {
  await getGoldPrice(myStore.value.id)
  await getGlodParams()
}
else {
  $toast.error('请先选择门店')
}

/** 绑定参数 */
async function getGlodParams() {
  goldParams.value = JSON.parse(JSON.stringify(goldList.value.map(item => ({
    price: Number(item.price),
    product_material: item.product_material,
    product_quality: item.product_quality,
    product_type: item.product_type,
    product_brand: item.product_brand,
    store_id: myStore.value.id,
    id: item.id,
  }))))
}
/** 获取下拉消息信息 */
function getOptions(name: keyof Product) {
  const preset = filterList.value[name]?.preset
  return optonsToSelect(preset, true)
}
const productType = {
  0: '全部',
  1: '成品',
  2: '旧料',
  3: '配件',
}
async function submit() {
  const data = await setGoldPrice(goldParams.value)
  if (data.code === HttpCode.SUCCESS) {
    $toast.success('提交今日最新金价成功')
    goldParams.value = []
    await getGoldPrice(myStore.value.id)
    await getGlodParams()
  }
  else {
    $toast.error(data.message ?? '提交失败')
  }
  changeShow.value = false
}
function addGold() {
  goldParams.value.push({
    price: 0,
    product_material: 0,
    product_quality: [],
    product_type: 0,
    product_brand: [],
    store_id: myStore.value.id,
  })
}

function subtract(i: number) {
  goldParams.value.splice(i, 1)
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-4 pb-20">
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
              <div class="grid grid-cols-[60px_auto] pb-4 items-center">
                <div class="text-[rgba(0,104,255,1)] text-[24px] pr-2 flex items-end">
                  {{ item.price }}
                  <span class="pl-[2px]">/g</span>
                </div>
                <div class="flex flex-wrap gap-1 text-color-light">
                  <div>
                    {{ productType[item.product_type] ?? '' }}
                  </div>
                  <div>{{ filterList.material?.preset[item.product_material] ?? '' }}</div>
                  <div>{{ item.product_brand?.map(item => filterList.brand?.preset[item]).join(' ') ?? '' }}</div>
                  <div>{{ item.product_quality.map(quality => filterList.quality?.preset[quality]).join(' ') ?? '' }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </common-layout-center>
    <common-model v-model="changeShow" title="变更金价" :show-ok="true" @confirm="submit">
      <div class="pb-4 min-h-[320px] max-h-[400px] overflow-auto">
        <template v-for="(item, index) in goldParams" :key="index">
          <div class="flex justify-between items-center mb-2">
            <div class="text-color">
              {{ productType[item.product_type] }}
              <span class="text-red">*</span>
            </div>
          </div>
          <div class="grid grid-cols-[auto_72px] gap-2 items-center">
            <div>
              <n-input-number v-model:value="item.price" placeholder="价格" :min="0" />
              <div class="grid grid-cols-[1fr_1fr] gap-2 mt-2">
                <n-select v-model:value="item.product_material" placeholder="材质" :options="getOptions('material')" />
                <n-select v-model:value="item.product_type" placeholder="类型" :options="getOptions('type')" />
              </div>
              <div class="mt-2">
                <n-select v-model:value="item.product_brand" placeholder="品牌(多选),不选默认为全部品牌" multiple :options="getOptions('brand')" />
              </div>
              <div class="my-2">
                <n-select v-model:value="item.product_quality" placeholder="成色(多选)" multiple :options="getOptions('quality')" />
              </div>
            </div>
            <div class="flex gap-1">
              <div class="w-[32px] h-[32px] rounded-full bg-[#FFF] flex justify-center items-center" @click="subtract(index)">
                <icon name="i-svg:subtract" size="16" />
              </div>
              <template v-if="index === goldParams.length - 1">
                <div class="w-[32px] h-[32px] rounded-full bg-[#FFF] flex justify-center items-center" @click="addGold">
                  <icon name="i-svg:add" size="16" />
                </div>
              </template>
            </div>
          </div>
        </template>
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
    <common-button-bottom confirm-text="变更金价" cancel-text="操作记录" @confirm="getGlodParams();changeShow = true" @cancel="recordShow = true" />
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
