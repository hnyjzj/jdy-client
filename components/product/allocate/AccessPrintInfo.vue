<script setup lang="ts">
const props = withDefaults(defineProps<{
  time: string
  font?: string
}>(), {
  font: '14px',
})
const { accessorieAllocateInfoTotal, accessorieAllocateFilterList } = storeToRefs(useAccessorieAllocate())
</script>

<template>
  <div :style="{ 'font-size': props.font }">
    <div class="grid-12 py-[12px] gap-[8px]">
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        调拨单号: {{ accessorieAllocateInfoTotal.id }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        调出门店: {{ accessorieAllocateInfoTotal.from_store.alias }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        调入门店: {{ accessorieAllocateInfoTotal.to_store.alias }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        调拨类型: {{ accessorieAllocateFilterList.method?.preset[accessorieAllocateInfoTotal.method] }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        操作人: {{ accessorieAllocateInfoTotal.initiator.nickname }}
      </div>
      <div class="col-12" uno-sm="col-6" uno-md="col-4">
        操作时间: {{ formatIsoToDateTime(props.time) }}
      </div>
    </div>
    <table class="w-full fixed-table" :style="{ 'font-size': props.font }">
      <thead>
        <tr>
          <th>汇总项</th>
          <th>总种类数</th>
          <th>总件数</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td />
          <td>{{ accessorieAllocateInfoTotal.product_count }}</td>
          <td>{{ accessorieAllocateInfoTotal.product_total }}</td>
        </tr>
      </tbody>
    </table>

    <div class="">
      <table class="w-full fixed-table" :style="{ 'font-size': props.font }">
        <thead>
          <tr>
            <th>配件名称</th>
            <th>件数</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, key) in accessorieAllocateInfoTotal.products" :key="key">
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.stock }}</td>
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
