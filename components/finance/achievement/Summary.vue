<script setup lang="ts">
// 测试table数据。待替换
const finishedColumns = [
  {
    header: '姓名',
    field: 'name',
  },
  {
    header: '年龄',
    field: 'age',
  },
  {
    header: '出生日期',
    field: 'birthday',
  },
  {
    header: '地址',
    field: 'address',
  },
  {
    header: '操作',
    field: 'operation',
  },
]
const oldColumns = [
  {
    header: '大类',
    field: 'category',
  },
  {
    header: '剩余抵值',
    field: 'residue',
  },
  {
    header: '退货金额',
    field: 'returnAmount',
  },
]
const finishedData = [
  {
    name: '小美',
    age: 20,
    birthday: '0',
    address: '0',
    operation: '编辑',
  },
  {
    name: '懒羊羊',
    age: 23,
    birthday: '0',
    address: '0',
    operation: '编辑',
  },
  {
    name: '懒羊羊',
    age: 23,
    birthday: '0',
    address: '0',
    operation: '编辑',
  },
  {
    name: '懒羊羊',
    age: 23,
    birthday: '0',
    address: '0',
    operation: '编辑',
  },
]
const oldData = [
  {
    category: '成品',
    residue: 100,
    returnAmount: 100,
  },
  {
    category: '原料',
    residue: 100,
    returnAmount: 100,
  },
  {
    category: '银料用件',
    residue: 100,
    returnAmount: 100,
  },
]

// 盘点单tab切换选项
const options = computed(() => [
  {
    label: '成品业绩',
    value: 1,
  },
  {
    label: '旧料剩余抵值',
    value: 2,
  },
])

const currentSelected = ref(1)
</script>

<template>
  <div>
    <div>
      <div class="flex flex-col gap-[16px] px-[16px] py-[16px]">
        <div>
          <common-tab-secondary v-model:current-selected="currentSelected" :options="options" />
        </div>
        <div>
          <common-fold :title="currentSelected === 1 ? '成品业绩及对应旧料抵扣' : '旧料剩余抵值'">
            <div class="flex flex-col pt-[16px]">
              <common-table
                :columns="currentSelected === 1 ? finishedColumns : oldColumns"
                :data="currentSelected === 1 ? finishedData : oldData"
              />
            </div>
          </common-fold>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
