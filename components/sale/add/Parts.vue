<script setup lang="ts">
const Props = defineProps<{
  partList: AccessorieCategory[]
  where: FilterWhere<AccessorieCategory>[]
}>()
const emits = defineEmits<{
  search: [val: string, type: string]
  openProductList: []
}>()
// 搜索商品 名称name 和 条码code   编号number
const searchType = ref('number')
const showPartsList = defineModel<AccessorieCategory[]>('list', { default: [] })
const showModal = ref(false)
const searchParts = ref('')
const hasCheck = ref(false)
const changeType = (type: 'name' | 'code' | 'number') => {
  searchType.value = type
  searchParts.value = ''
//   emits('openProductList')
}

const placeholderText = computed(() => {
  switch (searchType.value) {
    case 'number':
      return '请输入配件编号'
    case 'code':
      return '请输入配件条码'
    default:
      return '请输入配件名称'
  }
})

// 预设选中状态的配置列表
const prePartsList = ref<AccessorieCategory[]>([])
// 设置选中状态
const selectPart = (part: AccessorieCategory) => {
  // 如果已经选中，则取消选中
  if (prePartsList.value.includes(part)) {
    prePartsList.value = prePartsList.value.filter(item => item !== part)
  }
  else {
    prePartsList.value.push(part)
  }
}
const confirmParts = () => {
  // 判断 showPartsList 是否存在 prePartsList 中的元素 ，如果存在则不添加
  prePartsList.value.forEach((item) => {
    if (!showPartsList.value.includes(item)) {
      showPartsList.value.push(item)
    }
  })
  prePartsList.value = []
  showModal.value = false
}
// 删除展示的配件
const deleteParts = (id: string) => {
  showPartsList.value.splice(showPartsList.value.findIndex(item => item.id === id), 1)
}
</script>

<template>
  <common-fold title="配件" :is-collapse="false">
    <div class="p-[16px]">
      <div class="btn grid-12">
        <div
          class="btn-left col-span-4 offset-4 cursor-pointer py-[10px]" @click="showModal = true">
          <icon name="i-icon:search" color="#FFF" :size="12" />
          <div class="ml-2">
            搜索
          </div>
        </div>
      </div>
    </div>
    <template v-if="false">
      <div class="flex justify-center">
        <div class="w-[30%]">
          <common-empty :show-r-t="false" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="px-[16px] py-[8px]">
        <template v-for="(obj, ix) in showPartsList" :key="ix">
          <div class="pb-[12px]">
            <sale-order-nesting v-model="hasCheck" title="">
              <template #left>
                <common-tags type="pink" :text="Props.where.filter((item) => item.name === 'type_part')[0].preset[obj.type_part]" :is-oval="true" />
              </template>
              <template #info>
                <div class="flex flex-col gap-[12px] px-[16px]">
                  <common-cell label="编号" :value="obj?.id" />
                  <common-cell label="名称" :value="obj?.name" />
                  <common-cell label="条码" :value="obj?.code" />
                  <common-cell label="零售方式" :value="Props.where.filter((item) => item.name === 'retail_type')[0].preset[obj.retail_type]" />
                  <common-cell label="标价" :value="obj?.label_price" />
                  <common-cell label="重量" :value="obj?.weight" />
                  <div class="h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
                  <div class="pb-[16px]">
                    <n-grid :cols="24" :x-gap="8">
                      <n-form-item-gi :span="12" label="应付金额">
                        <n-input-number
                          v-model:value="obj.pay"
                          :show-button="false"
                          placeholder="请输入应付金额"
                          :default-value="Number(obj?.label_price) || 0"
                          round
                          :precision="2"
                        >
                          <template #suffix>
                            元
                          </template>
                        </n-input-number>
                      </n-form-item-gi>
                      <n-form-item-gi :span="12" label="数量">
                        <div class="flex items-center justify-between">
                          <div class="w-full">
                            <n-input-number
                              v-model:value="obj.quantity"
                              placeholder="请输入数量"
                              :default-value="1"
                              round
                              min="1"
                              :precision="0"
                              :show-button="false"
                              @blur="() => {
                                obj.quantity ? obj.quantity : obj.quantity = 1
                              }"
                            />
                          </div>
                          <div class="flex items-center justify-between">
                            <div
                              class="wh-[32px] ml-[5px] bg-[#F1F5FE] rounded-[24px] flex-center-row color-[#3971F3] text-[26px]"
                              @click="() => {
                                obj.quantity ? obj.quantity++ : obj.quantity = 1
                              }">
                              +
                            </div>
                            <div
                              class="wh-[32px] ml-[5px] bg-[#F1F5FE] rounded-[24px] flex-center-row color-[#3971F3]  text-[26px]"
                              @click="() => {
                                if (obj.quantity && obj.quantity > 1)
                                  obj.quantity ? obj.quantity-- : obj.quantity = 1
                              }">
                              <div class="w-[10px] h-[2px] bg-[#3971F3]" />
                            </div>
                          </div>
                        </div>
                      </n-form-item-gi>
                    </n-grid>
                    <div class="flex justify-between items-center">
                      <div>
                        <div class="p-[8px] col-2 flex-center-row cursor-pointer" @click="deleteParts(obj?.id)">
                          <icon name="i-svg:delete" :size="16" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </sale-order-nesting>
          </div>
        </template>
      </div>
    </template>

    <common-model v-model="showModal" title="选择配件" :show-ok="true" :show-cancel="true" @confirm="confirmParts">
      <div class="grid-12">
        <div class="col-12">
          <div>
            <div class="flex justify-around py-[12px]">
              <div
                class="flex-center-col"
                @click="changeType('number')">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: searchType === 'number' ? '#333' : '#53565C' }">
                  编号搜索
                </div>
                <div class="w-[32px] h-[4px] rounded " :style="{ background: searchType === 'number' ? '#2080F0' : '' }" />
              </div>
              <div
                class="flex-center-col"
                @click="changeType('name')">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: searchType === 'name' ? '#333' : '#53565C' }">
                  名称搜索
                </div>
                <div class="w-[32px] h-[4px] rounded " :style="{ background: searchType === 'name' ? '#2080F0' : '' }" />
              </div>
              <div
                class="flex-center-col"
                @click="changeType('code')">
                <div class="text-[16px] pb-[2px] font-semibold line-height-[24px]" :style="{ color: searchType === 'code' ? '#333' : '#53565C' }">
                  条码搜索
                </div>
                <div class="w-[32px] h-[4px] rounded" :style="{ background: searchType === 'code' ? '#2080F0' : '' }" />
              </div>
            </div>
          </div>
          <div class="flex items-center pb-[16px]">
            <div class="flex-1">
              <n-input
                v-model:value="searchParts"
                type="text"
                clearable
                :placeholder="placeholderText" />
            </div>
            <div class="pl-[16px] flex">
              <n-button type="info" round @click="emits('search', searchParts, searchType)">
                搜索
              </n-button>
            </div>
          </div>
          <div class="overflow-x-auto max-w-[400px]">
            <div class=" color-[#333] font-semibold !text-[16px] flex">
              <div class="w-[180px] pl-[8px] flex-shrink-0">
                编号
              </div>
              <div class="w-[100px] flex-shrink-0">
                名称
              </div>
              <div class="w-[100px] flex-shrink-0">
                条码
              </div>
              <div class="w-[40px] flex-shrink-0">
                类型
              </div>
              <div class="w-[40px] flex-shrink-0">
                标价
              </div>
              <div class="w-[40px] flex-shrink-0">
                库存
              </div>
            </div>
            <div class="h-[300px] py-[16px]">
              <template v-for="(item, index) in Props.partList" :key="index">
                <div
                  class="py-[12px]  rounded-2xl mb-[8px] flex w-[fit-content]" :style="{
                    'background-color': prePartsList.includes(item) ? 'white' : '',
                    'color': prePartsList.includes(item) ? '#328AF1' : '#000',
                  }"
                  @click="selectPart(item)"
                >
                  <div class="w-[180px] pl-[8px] flex-shrink-0">
                    {{ item.id }}
                  </div>
                  <div class="w-[100px] flex-shrink-0">
                    {{ item.name }}
                  </div>
                  <div class="w-[100px] flex-shrink-0">
                    {{ item.code }}
                  </div>
                  <div class="w-[40px] flex-shrink-0">
                    {{ item.type_part }}
                  </div>
                  <div class="w-[40px] flex-shrink-0">
                    {{ item.label_price }}
                  </div>
                  <div class="w-[40px] flex-shrink-0">
                    {{ item?.product?.stock || 0 }}
                  </div>
                </div>
              </template>
              <template v-if="Props.partList.length === 0">
                <common-emptys text="暂无数据" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </common-model>
  </common-fold>
</template>

<style lang="scss" scoped>
.btn-left {
  --uno: 'text-[16px] border-none rounded-[36px] text-[#FFFFFF] flex justify-center items-center';
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
}
.btn-right {
  --uno: 'text-[16px] py-[9px] text-[#1a6beb] rounded-[36px] bg-[transparent] flex justify-center items-center border-[1px] border-solid border-[#1a6beb]';
}

.activeBtn {
  --uno: 'bg-[#2080F0] color-[#fff]';
}
.defaultBtn {
  --uno: 'bg-[#F3F3F3] color-[#000]';
}
.n-input-number {
  width: 100%;
}
</style>
