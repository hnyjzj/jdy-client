<script setup lang="ts">
const props = defineProps<{
  details?: PrintDetail
  where: Where<StatementWhere>
}>()

const PLACEHOLDER = '--'
</script>

<template>
  <div>
    <div class="title w-full flex-center-row font-size-[20px] font-700">
      销售明细表
    </div>

    <div class="head class flex-col gap-[8px] p-[16px]">
      <div class="def">
        <div>网点：</div>
        <div>
          {{ props.details?.currentShop }}
        </div>
      </div>

      <div class="def">
        <div>操作员：</div>
        <div>
          {{ props.details?.currentOperator }}
        </div>
      </div>

      <div class="def">
        <div>打印时间：</div>
        <div>
          {{ props.details?.currentTime }}
        </div>
      </div>
    </div>

    <div class="table">
      <table cellspacing="0" style="width: 100%; border-top: 2px solid rgb(0, 0, 0); border-bottom: 2px solid rgb(0, 0, 0); table-layout: fixed; font-size: 12px;">
        <thead>
          <tr>
            <th class="table-header" style="width: 190px;">
              销售单号
            </th>
            <th class="table-header" style="width: 40px;">
              类型
            </th>
            <th class="table-header" style="width: 80px;">
              所属大类
            </th>
            <th class="table-header" style="width: 60px;">
              货品名称
            </th>
            <th class="table-header" style="width: 60px;">
              应付/抵扣
            </th>
            <th class="table-header" style="width: 60px;">
              折扣
            </th>
            <th class="table-header" style="width: 50px;">
              金重
            </th>
            <th class="table-header" style="width: 60px;">
              标签价
            </th>
            <th class="table-header" style="width: 40px;">
              数量
            </th>
            <th class="table-header" style="width: 110px;">
              条码
            </th>
            <th class="table-header" style="width: 110px;">
              旧料编号
            </th>
            <th class="table-header" style="width: 80px;">
              销售时间
            </th>
            <th class="table-header" style="width: 40px;">
              状态
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in props.details?.printData" :key="index">
            <td class="table-body">
              {{ item.order_id }}
            </td>
            <td class="table-body">
              {{ item.type }}
            </td>
            <td class="table-body">
              {{ item.finished.product?.name }}
            </td>
            <td class="table-body">
              {{ item.finished.product?.label_price }}
            </td>
            <td class="table-body">
              {{ item.order.price }}
            </td>
            <td class="table-body">
              {{ item.order.price }}
            </td>
            <td class="table-body">
              {{ }}
            </td>
            <td class="table-body">
              {{ item.order.price }}
            </td>
            <td class="table-body">
              {{ }}
            </td>
            <td class="table-body">
              {{ item.code || PLACEHOLDER }}
            </td>
            <td class="table-body">
              {{ item.old.code || PLACEHOLDER }}
            </td>
            <td class="table-body">
              {{ item.created_at }}
            </td>
            <td class="table-body">
              {{ props.where.status?.preset[item.status] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.def {
  --uno: 'flex flex-row gap-[2px]';
}

.table-header {
  padding: 5px 2px;
  line-height: 1;
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  overflow-wrap: break-word;
  word-break: break-all;
}

.table-body {
  padding: 5px 2px;
  border-top: 1px dashed rgb(0, 0, 0);
  text-align: left;
  line-height: 1;
  font-size: 12px;
  overflow-wrap: break-word;
  word-break: break-all;
}
</style>
