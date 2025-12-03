<script lang="ts" setup>
const { $toast } = useNuxtApp()
const { goldList } = storeToRefs(useGoldPrice())
const { getGoldPrice, setGoldPrice } = useGoldPrice()
const { getFinishedWhere } = useFinished()
const { finishedFilterList } = storeToRefs(useFinished())
const { getStoreDetail } = useStores()
const { myStore } = storeToRefs(useStores())
useSeoMeta({
  title: '今日金价',
})
const route = useRoute()

const changeShow = ref(false)
const goldParams = ref([] as UpdataGold[])
const deleteArr = ref([] as GoldPrices['id'][])
await getFinishedWhere()

if (route.query.store_id) {
  await getStoreDetail(route.query.store_id as string, true)
}
if (myStore.value.id) {
  await getGoldPrice(myStore.value.id)
  await getGoldParams()
}
else {
  $toast.error('请先选择门店')
}

/** 绑定参数 */
async function getGoldParams() {
  if (goldList.value?.length) {
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
  else {
    goldParams.value = [{
      product_quality: [],
      product_type: undefined,
      product_brand: [],
      store_id: myStore.value.id,
    }]
  }
}
/** 获取下拉消息信息 */
function getOptions(name: keyof ProductFinisheds) {
  const preset = finishedFilterList.value[name]?.preset
  if (!preset)
    return []
  return optonsToSelect(preset)
}
const productType = {
  0: '全部',
  1: '成品',
  2: '旧料',
  3: '配件',
}
async function submit() {
  const params: UpdataGoldParams = { options: goldParams.value }
  /** 删除金价 */
  if (deleteArr.value.length) {
    params.deletes = deleteArr.value
  }
  const data = await setGoldPrice(params)
  if (data?.code === HttpCode.SUCCESS) {
    $toast.success('提交今日最新金价成功')
    goldParams.value = []
    deleteArr.value = []
    await getGoldPrice(myStore.value.id)
    await getGoldParams()
  }
  else {
    $toast.error(data?.message ?? '提交失败')
  }
  changeShow.value = false
}
function addGold() {
  goldParams.value.push({
    price: undefined,
    product_quality: [],
    product_type: undefined,
    product_brand: [],
    store_id: myStore.value.id,
  })
}

/** 删除单个金价设置 */
function subtract(i: number, id: GoldPrices['id']) {
  if (id) {
    deleteArr.value.push(id)
  }
  goldParams.value.splice(i, 1)
}
</script>

<template>
  <div>
    <div class="blur-bgc">
      <common-layout-center>
        <div class="grid-12 color-[#fff]">
          <div class="col-5" uno-sm="col-3" uno-lg="col-2">
            <product-manage-company />
          </div>
        </div>
      </common-layout-center>
    </div>
    <common-layout-center>
      <div class="mx-4 pt-4 pb-20">
        <common-card-info title="金价历史">
          <template #info>
            <div class="blur-bgc rounded-[16px] cursor-pointer">
              <div class="col-8 flex pb-1">
                <div class="updata-time">
                  最近更新：
                  {{ formatTimestampToDateTime(goldList[0]?.updated_at ?? '') }}
                </div>
              </div>
              <div class="p-3">
                <template v-if="goldList.length">
                  <template v-for="item in goldList" :key="item.id">
                    <div class="grid grid-cols-[100px_auto] items-start pb-5">
                      <div class="text-[rgba(0,104,255,1)] text-[20px] pr-2 flex items-end">
                        {{ Number(item.price).toFixed(2) }}
                      </div>
                      <div>
                        <div class="pb-1 flex gap-2 text-color">
                          <div class="font-bold">
                            {{ productType[item.product_type] ?? '' }}
                          </div>
                          <div>{{ finishedFilterList.material?.preset[item.product_material] ?? '' }}</div>
                        </div>
                        <div class="gap-1 text-color">
                          <div>{{ item.product_brand?.map(item => finishedFilterList.brand?.preset[item]).join(' ') ?? '' }}</div>
                          <div>{{ item.product_quality.map(quality => finishedFilterList.quality?.preset[quality]).join(' ') ?? '' }}</div>
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div>
                    <common-empty text="暂未设置金价" size="100" />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </common-card-info>
      </div>
    </common-layout-center>
    <common-model v-model="changeShow" title="变更金价">
      <div class="pb-4 h-[300px] overflow-auto">
        <template v-for="(item, index) in goldParams" :key="index">
          <div class="flex justify-between items-center mb-2 mt-2">
            <div class="text-color">
              金价{{ index + 1 }}
              <span class="text-red">*</span>
            </div>
          </div>
          <div class="grid grid-cols-[auto_72px] gap-2 items-center">
            <div>
              <n-input-number v-model:value="item.price" placeholder="价格" :min="0" @focus="focus" />
              <div class="grid grid-cols-[1fr_1fr] gap-2 mt-2">
                <n-select v-model:value="item.product_material" placeholder="材质" :options="getOptions('material')" @focus="focus" />
                <n-select v-model:value="item.product_type" placeholder="类型" :options="optonsToSelect(typePreset)" @focus="focus" />
              </div>
              <div class="mt-2">
                <n-select v-model:value="item.product_brand" class="no-radius" placeholder="品牌(多选),不选默认为全部品牌" multiple :options="getOptions('brand')" @focus="focus" />
              </div>
              <div class="my-2">
                <n-select v-model:value="item.product_quality" class="no-radius" placeholder="成色(多选)" multiple :options="getOptions('quality')" @focus="focus" />
              </div>
            </div>
            <div class="flex gap-1">
              <div class="w-[32px] h-[32px] rounded-full bg-[#FFF] flex justify-center items-center" @click="subtract(index, item.id)">
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
      <template #footer>
        <div class="w-[100%]">
          <div class="bottom-fun grid grid-cols-[26%_26%_auto] gap-2">
            <div class="cursor-pointer cancel-btn" @click="changeShow = false">
              取消
            </div>
            <div class="cursor-pointer cancel-btn" @click="getGoldParams">
              重置
            </div>
            <div class="cursor-pointer confirm-btn" @click="submit">
              确定
            </div>
          </div>
        </div>
      </template>
    </common-model>
    <common-button-one text="变更金价" @confirm="getGoldParams();changeShow = true" />
  </div>
</template>

<style>
.no-radius .n-base-tag {
  border-radius: 16px !important;
}
</style>

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
  --uno: 'bg-[rgba(199,218,255,1)] py-[4px] px-4 text-[rgba(75,87,109,1)] rounded-full';
}
.confirm-btn {
  --uno: 'py-[6px] text-center flex-1 border-rd-[36px] text-[16px] text-[#fff] font-bold ';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
  box-shadow: rgba(57, 113, 243, 0.24) 0px 8px 8px 0;
}
.cancel-btn {
  --uno: 'py-[6px] text-center flex-1 border-rd-[36px] text-[16px] text-[#1a6beb] font-bold';
  background: #fff;
  box-shadow: rgba(82, 130, 241, 0.24) 0px 8px 8px 0;
}
.bottom-fun {
  --uno: 'flex-between pt-4';
  border-top: rgba(230, 230, 232, 1) solid 1px;
}
</style>
