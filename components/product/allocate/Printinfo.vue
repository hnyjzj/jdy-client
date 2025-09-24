<script setup lang="ts">
const props = defineProps<{
  time: string
  font?: string
  printType: string
}>()
const { allocateInfoAll, allocateFilterList, allocateInfoOverview } = storeToRefs(useAllocate())
const { finishedFilterList } = storeToRefs(useFinished())
const { oldFilterList } = storeToRefs(useOld())
</script>

<template>
  <div :style="{ 'font-size': props.font || '14px' }">
    <div class="grid-12 py-[12px] gap-[8px]">
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        调拨单号: {{ allocateInfoAll.id }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        调拨状态: {{ allocateFilterList.status?.preset[allocateInfoAll.status] }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        调出门店: {{ allocateInfoAll.from_store.name }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        调入门店: {{ allocateInfoAll.to_store.name }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        调拨类型: {{ allocateFilterList.method?.preset[allocateInfoAll.method] }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        仓库类型: {{ allocateFilterList.type?.preset[allocateInfoAll.type] }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        调拨原因: {{ allocateFilterList.reason?.preset[allocateInfoAll.reason] }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        操作人: {{ allocateInfoAll.initiator.nickname }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        操作时间: {{ formatIsoToDateTime(props.time) }}
      </div>
    </div>
    <table class="w-full fixed-table" :style="{ 'font-size': props.font || '14px' }">
      <thead>
        <tr>
          <th>汇总项</th>
          <th>总入网费</th>
          <th>总金重</th>
          <th>{{ allocateInfoAll.type === GoodsType.ProductFinish ? '总标价' : '总抵值' }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td />
          <td>{{ allocateInfoAll.product_total_access_fee }}</td>
          <td>{{ allocateInfoAll.product_total_weight_metal }}</td>
          <td>{{ allocateInfoAll.type === GoodsType.ProductFinish ? allocateInfoAll.product_total_label_price : allocateInfoAll.product_total_recycle_price }}</td>
        </tr>
      </tbody>
    </table>
    <template v-if="props.printType === 'all'">
      <div class="" :style="{ 'font-size': props.font || '14px' }">
        <template v-for="(value, key) in allocateInfoOverview" :key="key">
          <div class="py-[8px]">
            {{ key }}
          </div>
          <table class="w-full fixed-table" :style="{ 'font-size': props.font || '14px' }">
            <thead>
              <tr>
                <th>品类</th>
                <th>件数</th>
                <th>金重</th>
                <th>{{ allocateInfoAll.type === GoodsType.ProductFinish ? '总标价' : '抵值' }}</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="([category, item]) in Object.entries(allocateInfoOverview[key])
                  .sort(([a], [b]) => a === '合计' ? 1 : b === '合计' ? -1 : 0)" :key="category">
                <tr>
                  <td>{{ category }}</td>
                  <td>{{ item.件数 }}</td>
                  <td>{{ item.金重 }}</td>
                  <td>{{ allocateInfoAll.type === GoodsType.ProductFinish ? item.总标价 : item.抵值 }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </template>
      </div>
    </template>

    <template v-if="props.printType === 'info'">
      <div class="">
        <table class="w-full fixed-table" :style="{ 'font-size': props.font || '14px' }">
          <thead>
            <tr>
              <th>条码</th>
              <th>所属大类</th>
              <th>货品名称</th>
              <th>品类</th>
              <th> {{ allocateInfoAll.type === GoodsType.ProductFinish ? '零售方式' : '回收方式' }}</th>
              <th>工费</th>
              <th>标签价</th>
              <th>金重(g)</th>
              <th>主石重</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="allocateInfoAll.type === GoodsType.ProductFinish && allocateInfoAll.product_finisheds.length > 0">
              <template v-for="(item, key) in allocateInfoAll.product_finisheds" :key="key">
                <tr>
                  <td>{{ item.code }}</td>
                  <td>{{ finishedFilterList.class?.preset[item.class] }} </td>
                  <td>{{ item.name }}</td>
                  <td>{{ finishedFilterList.category?.preset[item.category] }}</td>
                  <td>{{ realtype(item.retail_type) }}</td>
                  <td>{{ item.labor_fee }}</td>
                  <td>{{ item.label_price }}</td>
                  <td>{{ item.weight_metal }}</td>
                  <td>{{ item.weight_gem }}</td>
                </tr>
              </template>
            </template>
            <template v-else>
              <template v-for="(item, key) in allocateInfoAll.product_olds" :key="key">
                <tr>
                  <td>{{ item.code }}</td>
                  <td>{{ oldFilterList.class?.preset[item.class] }} </td>
                  <td>{{ item.name }}</td>
                  <td>{{ oldFilterList.category?.preset[item.category] }}</td>
                  <td>{{ oldFilterList.recycle_type?.preset[item.recycle_type] }}</td>
                  <td />
                  <td>{{ item?.label_price || '' }}</td>
                  <td>{{ item.weight_metal }}</td>
                  <td>{{ item.weight_gem }}</td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </template>
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
        border-bottom: 1px dashed #000;
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
  td {
    border-top: 1px dashed #000;
  }
  tbody {
    border-bottom: 1px solid #000;
  }
}
</style>
