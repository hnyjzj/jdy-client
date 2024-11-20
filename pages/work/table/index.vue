<script setup lang="ts">
import type { Rules } from 'common-form'

const { addWorkbench } = useWorkbenche()
useSeoMeta({
  title: '工作台',
})
const addWorkbenchform = templateRef('addWorkbenchform')
const show = ref(false)
const params = ref<AddWorkbencheReq>({
  parent_id: '',
  title: '',
  icon: '',
  path: '',
})
const rules = ref<Rules<AddWorkbencheReq>>({
  title: [
    {
      message: '标题不能为空',
      validator: 'required',
    },
  ],
  icon: [
    {
      message: '图标不能为空',
      validator: 'required',
    },
  ],
  path: [
    {
      message: '跳转地址不能为空',
      validator: 'required',
    },
  ],
})
const list = ref<WorkTables[]>([
  {
    title: '货品管理',
    id: 1,
    children: [
      {
        title: '成品',
        children: [
          { name: '成品列表', path: '/product/manage/list' },
          { name: '入库单', path: '/product/finished/warehouse' },
          { name: '新增入库单', path: '/product/finished/warehouse/add' },
        ],
      },
      {
        title: '货品',
        children: [
          { name: '货品调拨', path: '/product/goods/transfer' },
          { name: '新增调拨单', path: '/product/goods/transfer/add' },
          { name: '货品盘点', path: '/product/goods/check' },
          { name: '新增盘点单', path: '/product/goods/check/add' },
          { name: '货品更新', path: '/product/goods/update' },
          { name: '货品记录', path: '/product/goods/record' },
        ],
      },
      {
        title: '旧料',
        children: [
          { name: '旧料列表', path: '/product/old/list' },
        ],
      },
      {
        title: '配件',
        children: [
          { name: '配件库存', path: '/product/accessory/stock' },
          { name: '配件入库', path: '/product/accessory/warehouse' },
          { name: '配件调拨', path: '/product/accessory/transfer' },
          { name: '条目管理', path: '/product/accessory/entry' },
          { name: '配件记录', path: '/product/accessory/record' },
        ],
      },
      {
        title: '报损',
        children: [
          { name: '报损列表', path: '/product/loss/list' },
        ],
      },
    ],
  },
  {
    title: '销售管理',
    id: 2,
    children: [
      {
        title: '销售',
        children: [
          { name: '销售单列表', path: '/sale/sales/list' },
          { name: '新增销售单（单店显示）', path: '/sale/sales/add' },
          { name: '销售明细', path: '/sale/sales/details' },
          { name: '退货明细', path: '/sale/sales/refund' },
        ],
      },
      {
        title: '订单金',
        children: [
          { name: '订单金列表', path: '/sale/deposit/list' },
        ],
      },
      {
        title: '维修单',
        children: [
          { name: '维修单列表', path: '/sale/repair/list' },
        ],
      },
      {
        title: '其他收支',
        children: [
          { name: '其他收支单', path: '/sale/other/list' },
          { name: '新增收支单（单店显示）', path: '/sale/other/info' },
        ],
      },
    ],
  },
  {
    title: '客户管理',
    id: 3,
    children: [
      {
        title: '会员',
        children: [
          { name: '会员列表', path: '/sale/search/member' },
          { name: '新增会员', path: '/manage/client/vip/add' },
          { name: '会员通知', path: '/manage/client/vip/notice' },
        ],
      },
      {
        title: '积分',
        children: [
          { name: '积分记录', path: '/manage/client/integral/record' },
        ],
      },
      {
        title: '维护',
        children: [
          { name: '客户维护', path: '/manage/client/maintain' },
        ],
      },
    ],
  },
  {
    title: '员工管理',
    id: 4,
    children: [
      {
        title: '员工',
        children: [
          { name: '员工列表', path: '/manage/staffs/staff/list' },
          { name: '新增员工', path: '/manage/staffs/staff/add' },
        ],
      },
      {
        title: '目标',
        children: [
          { name: '销售目标管理', path: '/manage/staffs/goal/manage' },
          { name: '新建销售目标', path: '/manage/staffs/goal/add' },
        ],
      },
      {
        title: '任务',
        children: [
          { name: '任务系统', path: '/manage/staffs/task/list' },
          { name: '新建任务', path: '/manage/staffs/task/add' },
        ],
      },
    ],
  },
  {
    title: '财务管理',
    id: 5,
    children: [
      {
        title: '收支',
        children: [
          { name: '收支对账表', path: '/finance/income/list' },
        ],
      },
      {
        title: '业绩',
        children: [
          { name: '业绩汇总', path: '/finance/achievement/summary' },
          { name: '业绩计算规则', path: '/finance/achievement/rule' },
        ],
      },
    ],
  },
  {
    title: '数据灯塔',
    id: 6,
    children: [
      {
        title: '统计',
        children: [
          { name: '库存统计', path: '/summary/stock' },
          { name: '进销存一览', path: '/summary/stock/analysis' },
        ],
      },
      {
        title: '分析',
        children: [
          { name: '会员分析', path: '/analyze/vip' },
          { name: '员工分析', path: '/analyze/staff' },
          { name: '营销分析', path: '/analyze/marketing' },
          { name: '生命周期追踪', path: '/analyze/lifecycle' },
        ],
      },
    ],
  },
  {
    title: '系统设置',
    id: 7,
    children: [
      {
        title: '角色',
        children: [
          { name: '角色管理', path: '/system/role/manage' },
          { name: '新增角色', path: '/system/role/add' },
        ],
      },
      {
        title: '门店',
        children: [
          { name: '门店列表', path: '/system/store/list' },
          { name: '门店通知', path: '/system/store/notice' },
        ],
      },
      {
        title: '成品入库模板',
        children: [
          { name: '入库单模板', path: '/system/print/stock' },
        ],
      },
      {
        title: '供应商',
        children: [
          { name: '供应商管理', path: '/system/supplier/manage' },
          { name: '新增供应商', path: '/system/supplier/add' },
        ],
      },
      {
        title: '品牌',
        children: [
          { name: '品牌管理', path: '/system/brand/manage' },
          { name: '新增品牌', path: '/system/brand/add' },
        ],
      },
      {
        title: '条目',
        children: [
          { name: '配件条目', path: '/system/entry/fitting' },
        ],
      },
      {
        title: '单据打印模板',
        children: [
          { name: '销售单', path: '/system/print/sale' },
          { name: '维修单', path: '/system/print/repair' },
          { name: '订单金', path: '/system/print/deposit' },
          { name: '新增模板', path: '/system/print/add' },
        ],
      },
      {
        title: '公众号',
        children: [
          { name: '公众号绑定', path: '/system/official/bind' },
        ],
      },
      {
        title: '支付费率',
        children: [
          { name: '支付费率管理', path: '/system/rates/manage' },
          { name: '修改费率（总店）', path: '/system/rates/change' },
        ],
      },
      {
        title: '其他设置',
        children: [
          { name: '积分清零', path: '/customer/member/clear' },
          { name: '会员等级', path: '/customer/member/level' },
          { name: '会员权益', path: '/customer/member/equity' },
          { name: '会员开单回访', path: '/customer/member/billing' },
          { name: '会员卡', path: '/customer/member/card' },
          { name: '开单设置', path: '/customer/member/set' },
        ],
      },
    ],
  },
])
</script>

<template>
  <div class="flex flex-col">
    <div class="color-[#fff] grid-12 px-[16px] py-[12px]">
      <div class="col-4" uno-sm="col-3 offset-1" uno-lg="col-2 offset-2" uno-xl="col-1 offset-3">
        <product-manage-company />
      </div>
      <div class="col-7 offset-5" uno-sm="col-6 offset-5" uno-lg="col-5 offset-5" uno-xl="col-4 offset-5">
        <product-filter-search />
      </div>
      <div @click="show = true">
        加
      </div>
      <!-- 工作台入口 -->
      <div class="mt-6 col-12" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
        <work-bench :list="list" />
      </div>
    </div>
    <common-model v-model:model-value="show" title="新增" :show-ok="true" @confirm="() => addWorkbenchform?.submit()">
      <div class="py-[16px]">
        <common-form ref="addWorkbenchform" v-model="params" :rules="rules" @submit="(val) => addWorkbench(val)">
          <template #title="{ label }">
            <div class="pb-[16px]">
              <div class="flex-between border-b-[#E6E6E8] border-b-solid border-b-[1px] pb-[16px]">
                <div>标题</div>
                <input v-model="params[label]" type="text" class="border-none bg-transparent" placeholder="输入标题">
              </div>
            </div>
          </template>
          <template #icon="{ label }">
            <div class="pb-[16px]">
              <div class="flex-between border-b-[#E6E6E8] border-b-solid border-b-[1px] pb-[16px]">
                <div>图标</div>
                <input v-model="params[label]" type="text" class="border-none bg-transparent" placeholder="输入图标">
              </div>
            </div>
          </template>
          <template #path="{ label }">
            <div class="pb-[16px]">
              <div class="flex-between border-b-[#E6E6E8] border-b-solid border-b-[1px] pb-[16px]">
                <div>跳转地址</div>
                <input v-model="params[label]" type="text" class="border-none bg-transparent" placeholder="输入跳转地址">
              </div>
            </div>
          </template>
        </common-form>
      </div>
    </common-model>
    <common-tabbar text="table" />
  </div>
</template>
