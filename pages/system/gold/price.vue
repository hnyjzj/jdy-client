<script lang="ts" setup>
const { $toast } = useNuxtApp()
const { goldPrice, goldList } = storeToRefs(useGoldPrice())
const { getGoldPrice, getGoldPriceList, setGoldPrice } = useGoldPrice()

useSeoMeta({
  title: '工作台',
})

const show = ref(false)
const newGoldPrice = ref()
await getGoldPrice()
await getGoldPriceList({ page: 1, limit: 20 })
async function submit() {
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
const approvedStatus = ref(['待审批', '已审批', '已驳回'])
</script>

<template>
  <div>
    <div class="gold">
      <div class="gold-price">
        <div>
          当前金价：
          <span>{{ goldPrice }}</span>
          元/克
        </div>
        <div class="change" @click="show = true">
          <icon name="i-icon:change" :size="12" color="#FFF" />
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
      <div id="list" class="flex overflow-x-scroll gap-[20px]">
        <div class="px-4 py-3">
          <table>
            <thead>
              <tr>
                <th class="text">
                  申请人
                </th>
                <th class="text">
                  金价
                </th>
                <th class="text">
                  状态
                </th>
                <th class="text">
                  审批时间
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in goldList" :key="index">
                <td class="text">
                  {{ item.approver.nickname }}
                </td>
                <td class="text">
                  {{ item.price }}
                </td>
                <td class="text">
                  {{ approvedStatus[item.status] }}
                </td>
                <td class="text">
                  {{ item.approved_at }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <common-model v-model="show" title="变更金价" :show-ok="true" @confirm="submit">
        <div class="min-h-[80px]">
          <common-frame v-model="newGoldPrice" type="number" tip="请输入新的金价" />
        </div>
      </common-model>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gold {
  --uno: 'p-4';
  .gold-price {
    --uno: 'px-4 py-3 rounded-[16px] bg-[rgba(255,255,255,0.8)] flex justify-between items-center';
  }
  .change {
    --uno: 'bg-[rgba(0,104,255,1)] py-2 px-4 rounded-[14px] text-white text-sm flex items-center';
  }
}
.history {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text {
  --uno: 'px-2';
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
::-webkit-scrollbar {
  /* 隐藏Webkit浏览器的滚动条 */
  display: none;
}
</style>
