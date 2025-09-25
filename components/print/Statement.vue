<script setup lang="ts">
const props = withDefaults(defineProps<{
  salesman: string
  start?: string
  end?: string
  font?: string
  store?: string
  time?: string
}>(), {
  font: '14px',
})
const { printData } = storeToRefs(useStatement())
const { userinfo } = storeToRefs(useUser())

/**
 * 处理销售数据的通用函数
 * @param data - 待处理的数据，格式为 Record<string, Record<string, T>>，可能为 undefined
 * @param summaryKey - 汇总数据的键名，用于识别汇总数据
 * @param sortCondition - 排序条件函数，用于对非汇总数据进行排序
 * @returns 包含普通行数据和汇总行数据的对象
 */
function processSalesData<T>(
  data: Record<string, Record<string, T>> | undefined,
  summaryKey: string,
  sortCondition: (key: string) => boolean,
): { normalRows: { [key: string]: PrintSummaryRow<T>[] }, summary: PrintSummaryRow<T>[] } {
  // 初始化普通行数据，用于存储非汇总数据
  const normalRows: { [key: string]: PrintSummaryRow<T>[] } = {}
  // 初始化汇总行数据，用于存储汇总数据
  const summary: PrintSummaryRow<T>[] = []

  // 如果数据为空，直接返回空的普通行和汇总行数据
  if (!data)
    return { normalRows, summary }

  // 遍历第一层数据
  Object.entries(data).forEach(([firstKey, secondLevel]) => {
    // 如果当前键名是汇总键名，则处理汇总数据
    if (firstKey === summaryKey) {
      // 遍历第二层数据，将数据添加到汇总行中
      Object.entries(secondLevel).forEach(([secondKey, item], index) => {
        summary.push({ firstKey, secondKey, item, index })
      })
    }
    else {
      // 对非汇总数据进行排序
      const sortedEntries = Object.entries(secondLevel).sort(([keyA], [keyB]) => {
        // 如果 keyA 满足排序条件而 keyB 不满足，则 keyA 排在 keyB 前面
        if (sortCondition(keyA) && !sortCondition(keyB))
          return -1
        // 如果 keyA 不满足排序条件而 keyB 满足，则 keyA 排在 keyB 后面
        if (!sortCondition(keyA) && sortCondition(keyB))
          return 1
        // 如果两者都满足或都不满足排序条件，则保持原有顺序
        return 0
      })
      // 将排序后的结果转换为普通行数据
      normalRows[firstKey] = sortedEntries.map(([secondKey, item], index) => ({
        firstKey,
        secondKey,
        item,
        index,
      }))
    }
  })

  // 返回处理后的普通行数据和汇总行数据
  return { normalRows, summary }
}
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

const maxRows = computed(() => Math.max(summaryRows?.value?.length, printData.value?.payment?.length ?? 0))

// 使用通用函数处理成品销售数据
const processedFinishedSales = computed(() =>
  processSalesData<PrintFinishedSalesItem>(
    printData.value?.finished_sales,
    '汇总统计',
    (key: string) => key.includes('合计'),
  ),
)

// 使用通用函数处理旧料销售数据
const oldSales = computed(() =>
  processSalesData<oldSalesClass>(
    printData.value?.old_sales,
    '合计',
    (key: string) => key.includes(''),
  ),
)
// 旧料退货数据
const oldSalesRefund = computed(() =>
  processSalesData<oldSalesClass>(
    printData.value?.old_sales_refund,
    '合计',
    (key: string) => key.includes(''),
  ),
)
// 成品退货数据
const refundData = computed(() =>
  processSalesData<finished_sales_refundItem>(
    printData.value?.finished_sales_refund,
    '汇总统计',
    (key: string) => key.includes(''),
  ),
)
</script>

<template>
  <div>
    <div class="text-center text-[18px] font-semibold">
      销售报表
    </div>
    <div>
      <common-cell :font="props.font" :label="`门店: ${props.store || '全部'}`" label-color="#000" :value="`开始时间: ${formatIsoToDateTime(props.start ?? '') || ''}`" val-color="#000" lcol="col-5" rcol="col-7" />
      <common-cell :font="props.font" :label="`销售员: ${props.salesman || '全部'}`" label-color="#000" :value="`结束时间: ${formatIsoToDateTime(props.end ?? '') || ''}`" lcol="col-5" rcol="col-7" val-color="#000" />
      <common-cell :font="props.font" :label="`打印人: ${userinfo.nickname || ''}${userinfo.phone || ''}`" label-color="#000" :value="`打印时间: ${formatIsoToDateTime(props.time ?? '')}`" lcol="col-5" rcol="col-7" val-color="#000" />
    </div>
    <div>
      <table class="w-full fixed-table" :style="{ 'font-size': props.font }">
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
            <td>{{ '销售应收' }}: {{ printData.summary?.sales_receivable }}</td>
            <td>{{ '成品应收' }}: {{ printData.itemized?.finished_receivable }}</td>
            <template v-if="printData?.payment_total">
              <td>{{ `${printData?.payment_total?.name}: ` || '' }}{{ `${printData?.payment_total?.income}` || '' }}</td>
              <td>{{ `${printData?.payment_total?.expense}` || '' }}</td>
              <td>{{ `${printData?.payment_total?.received}` || '' }}</td>
            </template>
          </tr>
          <template v-for="index in maxRows" :key="index">
            <tr>
              <td>{{ summaryRows[index - 1]?.summarylabel ? `${summaryRows[index - 1].summarylabel}: ${summaryRows[index - 1].value ?? ''}` : '' }}</td>
              <td>{{ summaryRows[index - 1]?.itemizedlabel ? `${summaryRows[index - 1].itemizedlabel}: ${summaryRows[index - 1].itemized ?? ''}` : '' }}</td>
              <template v-if="printData?.payment && printData?.payment[index - 1]">
                <td>{{ `${printData?.payment[index - 1]?.name}: ` || '' }}{{ `${printData?.payment[index - 1]?.income}` || '' }}</td>
                <td>{{ `${printData?.payment[index - 1]?.expense}` || '' }}</td>
                <td>{{ `${printData?.payment[index - 1]?.received}` || '' }}</td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
      <table class="w-full fixed-table" :style="{ 'font-size': props.font }">
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
      <table class="w-full fixed-table" :style="{ 'font-size': props.font }">
        <thead>
          <tr>
            <th>旧料</th>
            <th>材质成色主石/明细</th>
            <th>抵值</th>
            <th>金重</th>
            <th>主石重</th>
            <th>件数</th>
            <th>标价</th>
            <th>工费</th>
            <th>转成品抵值</th>
            <th>转成品金重</th>
            <th>转成品件数</th>
            <th>剩余金重</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(projectRows, projectName) in oldSales.normalRows" :key="projectName">
            <template v-for="rows in projectRows" :key="`${rows.firstKey}-${rows.secondKey}`">
              <tr>
                <td>{{ rows.index === 0 ? rows.firstKey : '' }}</td>
                <td>{{ rows.item.name }}</td>
                <td>{{ rows.item.deduction }}</td>
                <td>{{ rows.item.weight_metal }}</td>
                <td>{{ rows.item.weight_gem }}</td>
                <td>{{ rows.item.quantity }}</td>
                <td>{{ rows.item.label_price }}</td>
                <td>{{ rows.item.labor_fee }}</td>
                <td>{{ rows.item.to_finished_deduction }}</td>
                <td>{{ rows.item.to_finished_weight_metal }}</td>
                <td>{{ rows.item.to_finished_quantity }}</td>
                <td>{{ rows.item.surplus_weight }}</td>
              </tr>
            </template>
          </template>
          <template v-for="(rows, index) in oldSales.summary" :key="index">
            <tr>
              <td>{{ rows.firstKey }}</td>
              <td />
              <td>{{ rows.item.deduction }}</td>
              <td>{{ rows.item.weight_metal }}</td>
              <td>{{ rows.item.weight_gem }}</td>
              <td>{{ rows.item.quantity }}</td>
              <td>{{ rows.item.label_price }}</td>
              <td>{{ rows.item.labor_fee }}</td>
              <td>{{ rows.item.to_finished_deduction }}</td>
              <td>{{ rows.item.to_finished_weight_metal }}</td>
              <td>{{ rows.item.to_finished_quantity }}</td>
              <td>{{ rows.item.surplus_weight }}</td>
            </tr>
          </template>
        </tbody>
      </table>
      <table class="w-full fixed-table" :style="{ 'font-size': props.font }">
        <thead>
          <tr>
            <th>配件</th>
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
      <table class="w-full fixed-table" :style="{ 'font-size': props.font }">
        <thead>
          <tr>
            <th>成品(退货)</th>
            <th>大类品类工艺</th>
            <th>退款金额</th>
            <th>标签价</th>
            <th>金重</th>
            <th>工费</th>
            <th>件数</th>
          </tr>
        </thead>
        <tbody>
          <!-- 按项目渲染，已排序的普通行和合计行 -->
          <template v-for="(projectRows, projectName) in refundData.normalRows" :key="projectName">
            <template v-for="row in projectRows" :key="`${row.firstKey}-${row.secondKey}`">
              <tr>
                <td>{{ row.index === 0 ? row.firstKey : '' }}</td>
                <td>{{ row.secondKey }}</td>
                <td>{{ row.item?.refunded || '' }}</td>
                <td>{{ row.item?.price || '' }}</td>
                <td>{{ row.item?.weight_metal || '' }}</td>
                <td>{{ row.item?.labor_fee || '' }}</td>
                <td>{{ row.item?.quantity }}</td>
              </tr>
            </template>
          </template>
          <!-- 汇总统计行 -->
          <template v-for="row in refundData.summary" :key="`${row.firstKey}-${row.secondKey}`">
            <tr>
              <td>{{ row.index === 0 ? row.firstKey : '' }}</td>
              <td>{{ row.secondKey }}</td>
              <td>{{ row.item?.refunded || '' }}</td>
              <td>{{ row.item?.price || '' }}</td>
              <td>{{ row.item?.weight_metal || '' }}</td>
              <td>{{ row.item?.labor_fee || '' }}</td>
              <td>{{ row.item?.quantity }}</td>
            </tr>
          </template>
        </tbody>
      </table>
      <table class="w-full fixed-table" :style="{ 'font-size': props.font }">
        <thead>
          <tr>
            <th>旧料(退货)</th>
            <th>材质成色主石/明细</th>
            <th>退款</th>
            <th>金重</th>
            <th>主石重</th>
            <th>件数</th>
            <th>标价</th>
            <th>工费</th>
            <th>条码</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(projectRows, projectName) in oldSalesRefund.normalRows" :key="projectName">
            <template v-for="rows in projectRows" :key="`${rows.firstKey}-${rows.secondKey}`">
              <tr>
                <td>{{ rows.index === 0 ? rows.firstKey : '' }}</td>
                <td>{{ rows.item.name }}</td>
                <td>{{ rows.item.refunded }}</td>
                <td>{{ rows.item.weight_metal }}</td>
                <td>{{ rows.item.weight_gem }}</td>
                <td>{{ rows.item.quantity }}</td>
                <td>{{ rows.item.label_price }}</td>
                <td>{{ rows.item.labor_fee }}</td>
                <td>{{ rows.item.code }}</td>
              </tr>
            </template>
          </template>
          <template v-for="(rows, index) in oldSalesRefund.summary" :key="index">
            <tr>
              <td>{{ rows.firstKey }}</td>
              <td />
              <td>{{ rows.item.refunded }}</td>
              <td>{{ rows.item.weight_metal }}</td>
              <td>{{ rows.item.weight_gem }}</td>
              <td>{{ rows.item.quantity }}</td>
              <td>{{ rows.item.label_price }}</td>
              <td>{{ rows.item.labor_fee }}</td>
              <td>{{ rows.item.code }}</td>
            </tr>
          </template>
        </tbody>
      </table>
      <table class="w-full fixed-table" :style="{ 'font-size': props.font }">
        <thead>
          <tr>
            <th>配件(退货)</th>
            <th>退款</th>
            <th>数量</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="([name, item]) in Object.entries(printData.accessorie_sales_refund).filter(([n]) => !n.includes('合计'))" :key="name">
            <tr>
              <td>{{ name }}</td>
              <td>{{ item.refunded }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </template>
          <template v-for="([name, item]) in Object.entries(printData.accessorie_sales_refund).filter(([n]) => n.includes('合计'))" :key="name">
            <tr>
              <td>{{ name }}</td>
              <td>{{ item.refunded }}</td>
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
  table-layout: auto;
  border-collapse: collapse; // 关键：合并边框，去除间隙
  thead {
    tr {
      th {
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
        font-weight: normal;
      }
    }
  }
  th,
  td {
    text-align: left;
    padding: 6px 0;
    word-break: break-all;
  }
}
.row {
  display: flex;
  border-top: 1px centerd #000;
  border-bottom: 1px solid #000;
  padding: 4px 0;
  margin-bottom: 20px;
}
</style>
