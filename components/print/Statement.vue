<script setup lang="ts">
const props = defineProps<{
  salesman: string
  start?: string
  end?: string
}>()
const { printData } = storeToRefs(useStatement())
const { userinfo } = storeToRefs(useUser())
const summaryRows = computed(() => [
  { summarylabel: '销售退款', itemizedlabel: '成品件数', value: printData.value.summary?.sales_refund, itemized: printData.value.itemized?.finished_quantity },
  { summarylabel: '销售实收', itemizedlabel: '订金抵扣', value: printData.value.summary?.sales_received, itemized: printData.value.itemized?.deposit_deduction },
  { summarylabel: '其他收入', itemizedlabel: '旧料抵扣', value: printData.value.summary?.other_income, itemized: printData.value.itemized?.old_deduction },
  { summarylabel: '其他支出', itemizedlabel: '旧料件数', value: printData.value.summary?.other_expense, itemized: printData.value.itemized?.old_quantity },
  { summarylabel: '订金收入', itemizedlabel: '旧料金重', value: printData.value.summary?.deposit_income, itemized: printData.value.itemized?.old_weight_metal },
  { summarylabel: '订金退款', itemizedlabel: '旧转成件数', value: printData.value.summary?.deposit_refund, itemized: printData.value.itemized?.old_to_finished_quantity },
  { summarylabel: '', itemizedlabel: '旧转成抵值', value: '', itemized: printData.value.itemized?.old_to_finished_deduction },
  { summarylabel: '', itemizedlabel: '旧转成金重', value: '', itemized: printData.value.itemized?.old_to_finished_weight_metal },
  { summarylabel: '', itemizedlabel: '配件金额', value: '', itemized: printData.value.itemized?.accessorie_price },
  { summarylabel: '', itemizedlabel: '配件件数', value: '', itemized: printData.value.itemized?.accessorie_quantity },
])
const maxRows = computed(() => Math.max(summaryRows.value.length, printData.value.payment?.length ?? 0))
// 处理成品销售数据，分离汇总统计行并按项目分组处理合计行
// 计算属性，用于处理成品销售数据，分离汇总统计行并按项目分组处理合计行
const processedFinishedSales = computed(() => {
  // 用于存储普通的销售数据，键为项目名称，值为该项目下的销售数据数组
  const normalRows: { [key: string]: PrintSummaryRow[] } = {}
  // 用于存储 "汇总统计" 行的销售数据
  const summary: { firstKey: string, secondKey: string, item: PrintFinishedSalesItem, index: number }[] = []
  // 遍历成品销售数据的一级键值对
  Object.entries(printData.value?.finished_sales).forEach(([firstKey, secondLevel]) => {
    // 如果一级键为 '汇总统计'，则处理汇总统计行的数据
    if (firstKey === '汇总统计') {
      // 遍历汇总统计行下的二级键值对
      Object.entries(secondLevel).forEach(([secondKey, item], index) => {
        // 将汇总统计行的数据添加到 summaryRows 数组中
        summary.push({
          firstKey,
          secondKey,
          item,
          index,
        })
      })
    }
    // 处理非汇总统计行的普通项目数据
    else {
      // 先对secondLevel条目进行排序，将包含'合计'的放到最后
      const sortedEntries = Object.entries(secondLevel).sort(([keyA], [keyB]) => {
        // 如果 keyA 包含 '合计' 而 keyB 不包含 '合计'，则将 keyA 排在 keyB 后面
        if (keyA.includes('合计') && !keyB.includes('合计')) {
          return -1
        }
        // 如果 keyA 不包含 '合计' 而 keyB 包含 '合计'，则将 keyA 排在 keyB 前面
        if (!keyA.includes('合计') && keyB.includes('合计')) {
          return 1
        }
        // 如果 keyA 和 keyB 都包含 '合计' 或者都不包含 '合计'，则保持原有顺序
        return 0
      })
      // 将排序后的条目映射为包含一级键、二级键、数据和索引的对象数组，并存储到 normalRows 中
      normalRows[firstKey] = sortedEntries.map(([secondKey, item], index) => ({
        firstKey,
        secondKey,
        item,
        index,
      }))
    }
  })

  // 返回处理后的普通项目数据和汇总统计行数据
  return { normalRows, summary }
})
</script>

<template>
  <div>
    <div class="text-center text-[18px] font-semibold">
      销售报表
    </div>
    <div>
      <common-cell :label="`销售员:${props.salesman || '全部'}`" label-color="#000" :value="`开始时间:${formatIsoToDateTime(props.start ?? '') || ''}`" val-color="#000" lcol="col-5" rcol="col-7" />
      <common-cell :label="`打印人:${userinfo.nickname + userinfo.phone || ''}`" label-color="#000" :value="`结束时间:${formatIsoToDateTime(props.end ?? '') || ''}`" lcol="col-5" rcol="col-7" val-color="#000" />
    </div>
    <div>
      <table class="w-full fixed-table">
        <thead>
          <tr>
            <th>汇总项</th>
            <th>分项</th>
            <th>收入</th>
            <th>支出</th>
            <th>实收</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ '销售应收' }}:{{ printData.summary?.sales_receivable }}</td>
            <td>{{ '成品应收' }}:{{ printData.itemized?.finished_receivable }}</td>
            <template v-if="printData?.payment_total">
              <td>{{ `${printData?.payment_total?.name}:` || '' }}{{ `${printData?.payment_total?.income}` || '' }}</td>
              <td>{{ `${printData?.payment_total?.expense}` || '' }}</td>
              <td>{{ `${printData?.payment_total?.received}` || '' }}</td>
            </template>
          </tr>
          <template v-for="index in maxRows" :key="index">
            <tr>
              <td>{{ summaryRows[index - 1]?.summarylabel ? `${summaryRows[index - 1].summarylabel}:${summaryRows[index - 1].value ?? ''}` : '' }}</td>
              <td>{{ summaryRows[index - 1]?.itemizedlabel ? `${summaryRows[index - 1].itemizedlabel}:${summaryRows[index - 1].itemized ?? ''}` : '' }}</td>
              <template v-if="printData?.payment && printData?.payment[index - 1]">
                <td>{{ `${printData?.payment[index - 1]?.name}:` || '' }}{{ `${printData?.payment[index - 1]?.income}` || '' }}</td>
                <td>{{ `${printData?.payment[index - 1]?.expense}` || '' }}</td>
                <td>{{ `${printData?.payment[index - 1]?.received}` || '' }}</td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
      <table class="w-full fixed-table">
        <thead>
          <tr>
            <th>成品</th>
            <th>大类品类工艺</th>
            <th>应收</th>
            <th>标签价</th>
            <th>金重</th>
            <th>工费</th>
            <th>件数</th>
          </tr>
        </thead>
        <tbody>
          <!-- 按项目渲染，已排序的普通行和合计行 -->
          <template v-for="(projectRows, projectName) in processedFinishedSales.normalRows" :key="projectName">
            <template v-for="row in projectRows" :key="`${row.firstKey}-${row.secondKey}`">
              <tr>
                <td>{{ row.index === 0 ? row.firstKey : '' }}</td>
                <td>{{ row.secondKey }}</td>
                <td>{{ row.item?.receivable || '' }}</td>
                <td>{{ row.item?.price || '' }}</td>
                <td>{{ row.item?.weight_metal || '' }}</td>
                <td>{{ row.item?.labor_fee || '' }}</td>
                <td>{{ row.item?.quantity || '' }}</td>
              </tr>
            </template>
          </template>
          <!-- 汇总统计行 -->
          <template v-for="row in processedFinishedSales.summary" :key="`${row.firstKey}-${row.secondKey}`">
            <tr>
              <td>{{ row.index === 0 ? row.firstKey : '' }}</td>
              <td>{{ row.secondKey }}</td>
              <td>{{ row.item?.receivable || '' }}</td>
              <td>{{ row.item?.price || '' }}</td>
              <td>{{ row.item?.weight_metal || '' }}</td>
              <td>{{ row.item?.labor_fee || '' }}</td>
              <td>{{ row.item?.quantity || '' }}</td>
            </tr>
          </template>
        </tbody>
      </table>

      <table class="w-full fixed-table">
        <thead>
          <tr>
            <th>配件名称</th>
            <th>实收</th>
            <th>应收</th>
            <th>单价</th>
            <th>件数</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="([name, item]) in Object.entries(printData.accessorie_sales).filter(([n]) => !n.includes('合计'))" :key="name">
            <tr>
              <td>{{ name }}</td>
              <td>{{ item.received }}</td>
              <td>{{ item.receivable }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </template>
          <template v-for="([name, item]) in Object.entries(printData.accessorie_sales).filter(([n]) => n.includes('合计'))" :key="name">
            <tr>
              <td>{{ name }}</td>
              <td>{{ item.received }}</td>
              <td>{{ item.receivable }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fixed-table {
  table-layout: fixed;
  border-collapse: collapse; // 关键：合并边框，去除间隙
  thead {
    tr {
      th {
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
      }
    }
  }
  th,
  td {
    text-align: center;
    padding: 6px 0;
    word-break: break-all;
  }
}
.row {
  display: flex;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  padding: 4px 0;
  margin-bottom: 20px;
}
</style>
