<script setup lang="ts">
const props = defineProps<{
  lists: Rule[]
}>()

// 文案信息来源于原始后台。后续按需修改
const rules = ref([
  {
    num: 1,
    desc: '拖动：设置旧料抵扣顺序，设置旧料抵扣成品的顺序；勾选：旧料可抵扣哪些成品大类',
  },
  {
    num: 2,
    desc: '统计业绩时，部分旧料可能还有剩余抵值，比如纯旧料回收业务；同时请将已退货的货品纳入考虑，导出的表格会有标记',
  },
  {
    num: 3,
    desc: '回收类型：回收算业绩，兑换不算业绩',
  },
])

const show = ref(false)
</script>

<template>
  <div>
    <div class="achievement-rule rounded-[24px] border-solid border-[1px] border-[#EFF0F6] overflow-hidden bg-[#fff]">
      <common-header-gradient title="业绩计算规则" align-desc="start">
        <common-help v-model="show" padding="48px">
          <template v-for="(rule, index) in rules" :key="index">
            <li class="font-size-[14px] color-[#333333] mb-[12px]">
              {{ rule.desc }}
            </li>
          </template>
        </common-help>
      </common-header-gradient>
      <div class="content flex flex-col gap-[16px] px-[16px] py-[16px]">
        <template v-for="(list, index) in props.lists" :key="index">
          <finance-achievement-info :data="list" />
        </template>
      </div>
    </div>
  </div>
</template>
