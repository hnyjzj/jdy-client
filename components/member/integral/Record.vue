<script setup lang="ts">
const props = defineProps<{
  data: IntegralRecord[]
}>()

const ChangeType = [
  {
    value: 1,
    label: '消费',
  },
  {
    value: 2,
    label: '充值',
  },
  {
    value: 3,
    label: '兑换',
  },
  {
    value: 4,
    label: '退款',
  },
  {
    value: 5,
    label: '取消兑换',
  },
  {
    value: 6,
    label: '取消退款',
  },
  {
    value: 7,
    label: '人工调整',
  },
]

const PERCH = '-- --'

const cutOut = (current: string | undefined) => {
  if (current) {
    return current.replace('T', ' ').replace(/\+\d{2}:\d{2}/, '')
  }
  return PERCH
}

const disposeType = (type: number) => {
  if (type < 0) {
    return '减积分'
  }
  else {
    return '加积分'
  }
}

const changeTypeDesc = (type: number) => {
  const target = ChangeType.find(p => p.value === type)
  if (target) {
    return target.label
  }
  return ''
}

const absoluteValue = (value: number) => {
  return Math.abs(value)
}
</script>

<template>
  <div class="grid-12">
    <div class="col-12 gap-[20px]" uno-lg="col-8 offset-2">
      <template v-if="props.data.length">
        <div class="grid grid-cols-1 gap-[16px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
          <template v-for="(item, index) in props.data" :key="index">
            <common-gradient :title="cutOut(item.created_at)" theme="gradient">
              <template #body>
                <div>
                  <div class="mod">
                    <div class="flex flex-col gap-[8px]">
                      <div class="title">
                        基础信息
                      </div>
                      <div class="replenish">
                        <div class="item">
                          <div class="left">
                            变更原因
                          </div>
                          <div class="right break-all">
                            {{ item.remark || PERCH }}
                          </div>
                        </div>
                        <div class="item">
                          <div class="left">
                            变更类型
                          </div>
                          <div class="right">
                            {{ changeTypeDesc(item.change_type) }}
                          </div>
                        </div>
                        <div class="item">
                          <div class="left">
                            创建时间
                          </div>
                          <div class="right">
                            {{ cutOut(item.created_at) }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="h-0.4 bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />

                    <div class="flex flex-col gap-[8px]">
                      <div class="title">
                        数值信息
                      </div>
                      <div class="replenish">
                        <div class="item">
                          <div class="left">
                            记录类型
                          </div>
                          <div class="right">
                            {{ disposeType(item.change) }}
                          </div>
                        </div>
                        <div class="item">
                          <div class="left">
                            变更数额
                          </div>
                          <div class="right">
                            {{ absoluteValue(item.change) }}
                          </div>
                        </div>
                        <div class="item">
                          <div class="left">
                            变更前
                          </div>
                          <div class="right">
                            {{ item.before }}
                          </div>
                        </div>
                        <div class="item">
                          <div class="left">
                            变更后
                          </div>
                          <div class="right">
                            {{ item.after }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </common-gradient>
          </template>
        </div>
      </template>

      <template v-else>
        <div class="pt-[160px] py-[32px]">
          <common-empty
            deg="45deg"
            size="120px"
            :is-shadow="false"
            text="该用户暂无积分记录" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  --uno: 'flex flex-row items-center justify-between gap-[32px]';

  .left {
    --uno: 'font-size-[14px] color-[#666] text-nowrap dark:color-[#CBCDD1]';
  }

  .right {
    --uno: 'font-size-[14px] color-[#333] dark:color-[#fff]';
  }
}

.mod {
  --uno: 'flex flex-col gap-[10px]';
}

.title {
  --uno: 'color-[#333] font-size-[14px] font-bold dark:color-[#fff]';
}

.replenish {
  --uno: 'flex flex-col gap-[6px]';
}
</style>
