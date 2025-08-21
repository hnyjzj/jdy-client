<script setup lang="ts">
const props = defineProps<{
  data: StatisticSalesDetailDailyResp
}>()

const summaryRows = [
  { summarylabel: '销售退款', itemizedlabel: '成品件数', value: props.data.summary?.sales_refund, itemized: props.data.itemized?.finished_quantity },
  { summarylabel: '销售实收', itemizedlabel: '订金抵扣', value: props.data.summary?.sales_received, itemized: props.data.itemized?.deposit_deduction },
  { summarylabel: '其他收入', itemizedlabel: '旧料抵扣', value: props.data.summary?.other_income, itemized: props.data.itemized?.old_deduction },
  { summarylabel: '其他支出', itemizedlabel: '旧料件数', value: props.data.summary?.other_expense, itemized: props.data.itemized?.old_quantity },
  { summarylabel: '订金收入', itemizedlabel: '旧料金重', value: props.data.summary?.deposit_income, itemized: props.data.itemized?.old_weight_metal },
  { summarylabel: '订金退款', itemizedlabel: '旧转成件数', value: props.data.summary?.deposit_refund, itemized: props.data.itemized?.old_to_finished_quantity },
  { summarylabel: '', itemizedlabel: '旧转成抵值', value: '', itemized: props.data.itemized?.old_to_finished_deduction },
  { summarylabel: '', itemizedlabel: '旧转成金重', value: '', itemized: props.data.itemized?.old_to_finished_weight_metal },
  { summarylabel: '', itemizedlabel: '配件金额', value: '', itemized: props.data.itemized?.accessorie_price },
  { summarylabel: '', itemizedlabel: '配件件数', value: '', itemized: props.data.itemized?.accessorie_quantity },
]
const maxRows = Math.max(summaryRows.length, props.data.payment?.length ?? 0)
</script>

<template>
  <div>
    <div class="text-center text-[18px] font-semibold">
      销售报表
    </div>
    <div>
      <common-cell label="销售员:xxxx" label-color="#000" value="开始时间:2025-08-18 00:00:00" val-color="#000" lcol="col-5" rcol="col-7" />
      <common-cell label="打印人:xxxx名称" label-color="#000" value="结束时间:2025-08-18 00:00:00" lcol="col-5" rcol="col-7" val-color="#000" />
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
            <td>{{ '销售应收' }}:{{ props.data.summary?.sales_receivable }}</td>
            <td>{{ '成品应收' }}:{{ props.data.itemized?.finished_receivable }}</td>
            <template v-if="props.data?.payment_total">
              <td>{{ props.data?.payment_total?.name || '' }}{{ props.data?.payment_total?.income || '' }}</td>
              <td>{{ props.data?.payment_total?.expense || '' }}</td>
              <td>{{ props.data?.payment_total?.received || '' }}</td>
            </template>
          </tr>
          <template v-for="index in maxRows" :key="index">
            <tr>
              <td>{{ summaryRows[index - 1]?.summarylabel ? `${summaryRows[index - 1].summarylabel}:${summaryRows[index - 1].value ?? ''}` : '' }}</td>
              <td>{{ summaryRows[index - 1]?.itemizedlabel ? `${summaryRows[index - 1].itemizedlabel}:${summaryRows[index - 1].itemized ?? ''}` : '' }}</td>
              <template v-if="props.data?.payment && props.data?.payment[index - 1]">
                <td>{{ props.data?.payment[index - 1]?.name || '' }}{{ props.data?.payment[index - 1]?.income || '' }}</td>
                <td>{{ props.data?.payment[index - 1]?.expense || '' }}</td>
                <td>{{ props.data?.payment[index - 1]?.received || '' }}</td>
              </template>
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
