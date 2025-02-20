<script setup lang="ts">
const { checkInfo, checkFilterList } = storeToRefs(useCheck())
const { getCheckInfo, getCheckWhere } = useCheck()
// 盘点单详情
useSeoMeta({
  title: '盘点单详情',
})
const route = useRoute()

if (route.query.id) {
  await getCheckInfo(route.query.id as string)
  await getCheckWhere()
}

/** 多选值 */
function getMultipleVal(key: keyof Where<Check>, val: any) {
  if (!val || !key)
    return ''
  if (!checkFilterList.value[key])
    return ''
  let result = ''
  val.forEach((item: number) => {
    const str = checkFilterList.value[key]?.preset[item]
    result = `${result}${str || ''}`
  })
  return result
}

/** 单选值 */
function getRadioVal(key: keyof Where<Check>, val: any) {
  if (!key || !val)
    return ''
  const preset = checkFilterList.value[key]?.preset

  if (preset[val]) {
    return preset[val]
  }

  return ''
}
</script>

<template>
  <div>
    <div class="grid-12">
      <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
        <div class="rounded-6 bg-white w-auto top">
          <common-gradient title="基础信息">
            <template #body>
              <div class="flex flex-col gap-4">
                <div class="operation-information flex flex-col gap-1">
                  <div class="part">
                    <div class="left">
                      盘点人
                    </div>
                    <div class="right">
                      {{ checkInfo.inventory_person?.nickname }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      监盘人
                    </div>
                    <div class="right">
                      {{ checkInfo.inspector?.nickname }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      盘点单号
                    </div>
                    <div class="right">
                      {{ checkInfo.id }}
                    </div>
                  </div>
                </div>
                <div class="h-0.5 bg-[#E6E6E8]" />
                <div class="other-information flex flex-col gap-1">
                  <div class="part">
                    <div class="left">
                      盘点品牌
                    </div>
                    <div class="right">
                      {{ getMultipleVal('brand', checkInfo.brand) }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      盘点仓库
                    </div>
                    <div class="right">
                      {{ checkInfo.store_id }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      备注
                    </div>
                    <div class="right">
                      {{ checkInfo.remark }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      状态
                    </div>
                    <div class="right">
                      <!-- <common-tags type="lake" :text="statusDesc[checkInfo.status]" /> -->
                    </div>
                  </div>
                </div>
                <div class="h-0.5 bg-[#E6E6E8]" />
                <div class="product-information flex flex-col gap-1">
                  <div class="part">
                    <div class="left">
                      盘点范围
                    </div>
                    <div class="right">
                      {{ getRadioVal('range', checkInfo.range) }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      大类
                    </div>
                    <div class="right">
                      {{ getMultipleVal('class', checkInfo.class) }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      品类
                    </div>
                    <div class="right">
                      {{ getMultipleVal('category', checkInfo.category) }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      工艺
                    </div>
                    <div class="right">
                      {{ getMultipleVal('craft', checkInfo.craft) }}
                    </div>
                  </div>
                </div>
                <div class="h-0.5 bg-[#E6E6E8]" />
                <div class="product-information flex flex-col gap-1">
                  <div class="part">
                    <div class="left">
                      总件数
                    </div>
                    <div class="right">
                      {{ checkInfo.cont_quantity }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      总金重
                    </div>
                    <div class="right">
                      {{ checkInfo.count_weight_metal }}
                    </div>
                  </div>
                  <div class="part">
                    <div class="left">
                      总标价
                    </div>
                    <div class="right">
                      {{ checkInfo.count_price }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </common-gradient>
        </div>
        <!-- <div class="info flex flex-col gap-4 rounded-6 bg-[#fff] w-auto px-4 py-4">
          <div class="flex flex-col gap-3">
            <common-tab-secondary v-model:current-selected="currentSelected" :options="inventoryOptions" />
            <common-step :description="step" :active-index="active" />
          </div>
          <div class="color-[#333333] dark:color-[#FFFFFF] font-normal text-[14px]">
            共{{ getCount() }}条数据
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.part {
  --uno: 'flex-start gap-3 text-sm font-normal';

  .left {
    --uno: 'color-[#666666] dark:color-[#CBCDD1]';
  }

  .right {
    --uno: 'color-[#333333] dark:color-[#FFFFFF]';
  }
}
</style>
