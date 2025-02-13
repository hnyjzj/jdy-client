<script lang="ts" setup>
const { $toast } = useNuxtApp()
const { goldPrice, goldList, totalPage } = storeToRefs(useGoldPrice())
const { getGoldPrice, getGoldPriceList, setGoldPrice } = useGoldPrice()

useSeoMeta({
  title: '黄金价格',
})

const approvedStatus = ref(['待审批', '已审批', '已驳回'])
const show = ref(false)
const page = ref(1)
const newGoldPrice = ref()
try {
  await getGoldPrice()
  await getGoldPriceList({ page: page.value, limit: 20 })
}
catch (error) {
  throw new Error(`加载数据失败: ${error || '未知错误'}`)
}

async function getMore() {
  page.value++
  await getGoldPriceList({ page: page.value, limit: 20 })
}

async function submit() {
  if (!newGoldPrice.value || newGoldPrice.value <= 0) {
    $toast.error('请输入有效的金价')
    return
  }
  const data = await setGoldPrice(newGoldPrice.value)
  if (data.code === HttpCode.SUCCESS) {
    $toast.success('提交今日最新金价成功')
  }
  else {
    $toast.error(data.message ?? '提交失败')
  }
  show.value = false
}

const { run, stop } = addMouseEvent(`#list`)
onMounted(() => {
  run()
})
onBeforeUnmount(() => {
  stop()
})
</script>

<template>
  <common-layout-center>
    <div>
      <div class="gold">
        <div class="gold-price">
          <div>
            当前金价：
            <span>{{ goldPrice }}</span>
            元/克
          </div>
          <div class="change" @click="show = true">
            <icon name="i-icon:product-toggle" :size="18" color="#FFF" />
            <div class="pl-1">
              变更金价
            </div>
          </div>
        </div>
      </div>

      <div class="blur-bgc rounded-[16px] cursor-pointer mx-4">
        <div class="grid-12">
          <div
            class="skew col-4">
            <div class="skew-right" />
            <div class="skew-text history">
              金价历史
            </div>
          </div>
        </div>
        <div class="p-3">
          <div id="list" class="flex overflow-x-scroll">
            <template v-if="goldList.length">
              <div>
                <table>
                  <thead>
                    <tr class="text-color">
                      <th class="text">
                        发起人
                      </th>
                      <th class="text">
                        金价
                      </th>
                      <th class="text">
                        状态
                      </th>
                      <th class="text">
                        审批人
                      </th>
                      <th class="text">
                        审批时间
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in goldList" :key="index" class="my-1 text-color-light">
                      <td class="text" style="padding-left: 0;">
                        {{ item.initiator?.nickname }}
                      </td>
                      <td class="text">
                        {{ item.price }}
                      </td>
                      <td class="text">
                        {{ approvedStatus[item.status] }}
                      </td>
                      <td class="text">
                        {{ item.approver?.nickname }}
                      </td>
                      <td class="text">
                        {{ formatTimestampToDateTime(item?.approved_at) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
          <template v-if="page < totalPage">
            <div class="text-center text-[rgba(0,104,255,1)] decoration-underline" @click="getMore">
              更多历史
            </div>
          </template>
        </div>
        <template v-if="!goldList.length">
          <common-empty text="暂无历史数据" />
        </template>
      </div>
      <common-model v-model="show" title="变更金价" :show-ok="true" @confirm="submit">
        <div class="min-h-[80px]">
          <common-frame v-model="newGoldPrice" type="number" tip="请输入新的金价" />
        </div>
      </common-model>
    </div>
  </common-layout-center>
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
#list {
  max-height: calc(100vh - 140px);
}
</style>
