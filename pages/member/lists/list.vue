<script setup lang="ts">
useSeoMeta({
  title: '会员列表',
})

// 测试数据。待替换
const memberList: MemberInfo[] = [
  {
    id: 1,
    nickname: '',
    compellation: '李女士',
    phone: '15000000000',
    email: '16532000000@qq.com',
    birthday: '1990-01-25',
    gender: 1,
    integral: 798798797,
    level: 1,
    buyCount: 3,
    isFollow: 1,
    source: '洛阳某某店',
    adviser: '沈易',
    store: 'XXXXXXXXXX',
    totalBuyCount: 9,
    activityCount: 0,
    createTime: '2022-01-01 12:00:00',
    joinTime: '2022-01-01 12:00:00',
    lastVisitTime: '2022-06-29 12:00:00',
    receiving: {
      name: '成为羊',
      address: '杭州市滨江区XXX',
      phone: '19000000000',
    },
    status: 1,
  },
  {
    id: 2,
    nickname: '',
    compellation: '李旻',
    phone: '13799000000',
    email: '16532000000@qq.com',
    birthday: '1990-01-25',
    gender: 1,
    integral: 798798797,
    level: 3,
    buyCount: 3,
    isFollow: 1,
    source: '洛阳某某店',
    adviser: '曹春花',
    store: 'XXXXXXXXXX',
    totalBuyCount: 9,
    activityCount: 0,
    createTime: '2022-01-01 12:00:00',
    joinTime: '2022-01-01 12:00:00',
    lastVisitTime: '2022-06-29 12:00:00',
    receiving: {
      name: '成为羊',
      address: '杭州市滨江区XXX',
      phone: '19000000000',
    },
    status: 3,
  },
]

const actions = [
  { id: 1, text: '增加' },
  { id: 2, text: '减少' },
]

const getInitialItems = () => [{ id: 1, isPopoverVisible: false, actions, selected: '' }]
const items = ref(getInitialItems())

const userJump = () => {
  jump('/member/lists/info')
}

const show = ref(false)
const adjustment = () => {
  show.value = !show.value
}

const capture = defineModel()
const adjustWay = ref(0)
const showTo = ref(0)

const afterAdjusting = (initValue: number, adjustValue: number) => {
  return adjustWay.value === 1 ? initValue + adjustValue : initValue - adjustValue
}

const updateShowTo = () => {
  if (adjustWay.value !== 0 && capture.value !== undefined && capture.value !== '') {
    const adjustValue = Number(capture.value)
    showTo.value = afterAdjusting(250, adjustValue)
  }
}
</script>

<template>
  <div class="grid-12">
    <common-model v-model:model-value="show" :show-ok="true" title="调整积分">
      <div class="pb-[16px] flex flex-col gap-[16px]">
        <div class="flex flex-row justify-between gap-[16px]">
          <div class="item flex-1">
            <div class="item-caption">
              当前积分
            </div>
            <div class="item-specific">
              <div class="disabled">
                250
              </div>
            </div>
          </div>
          <div class="item flex-1">
            <div class="item-caption">
              调整后积分
            </div>
            <div class="item-specific">
              <div class="disabled">
                <div class="show">
                  <input v-model="showTo" class="border-none bg-[#fff] bg-opacity-0" disabled>
                </div>
                <template v-if="adjustWay !== 0 && capture !== undefined && capture !== ''">
                  <div class="variational">
                    <div v-if="adjustWay === 1" class="increase color-[#2ED653]">
                      +
                    </div>
                    <div v-else class="decrease color-[#FF2F2F]">
                      -
                    </div>
                    <div class="capture" :style="{ color: adjustWay === 1 ? '#2ED653' : '#FF2F2F' }">
                      {{ capture }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-caption">
            调整类型
          </div>
          <div class="item-specific">
            <div>
              <template v-for="(item, index) in items" :key="index">
                <div class="flex flex-row justify-between items-center gap-[8px]">
                  <van-popover
                    v-model:show="item.isPopoverVisible"
                    :actions="item.actions"
                    @select="(action) => {
                      item.selected = action.text
                      adjustWay = action.id
                      updateShowTo()
                    }"
                  >
                    <template #reference>
                      <div class="refer">
                        <div
                          class="row-left dark:color-[#fff] font-size-[14px] text-nowrap"
                          :style="{ color: item.selected ? '#191919' : '#808089' }"
                        >
                          {{ item.selected || '调整方式' }}
                        </div>
                        <div class="row-right">
                          <van-icon :name="!item.isPopoverVisible ? 'arrow' : 'arrow-down'" color="#808089" size="14px" />
                        </div>
                      </div>
                    </template>
                  </van-popover>
                  <input
                    v-model="capture"
                    placeholder="请输入积分数量"
                    class="input"
                    @blur="updateShowTo"
                  >
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-caption">
            调整原因
          </div>
          <div class="item-specific">
            <textarea
              name="textarea"
              rows="5"
              cols="30"
              wrap="soft"
              placeholder="非必填"
              class="area"
            />
          </div>
        </div>
      </div>
    </common-model>
    <div class="flex flex-col gap-[16px] px-[16px] py-[16px] col-12" uno-lg="col-8 offset-2">
      <div class="flex flex-row items-center justify-between gap-[32px]">
        <product-filter-search class="color-[#fff] flex-1" />
        <product-filter-senior class="color-[#fff]" />
      </div>
      <member-lists-list :info="memberList" @go-info="userJump" @change-integral="adjustment" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.item {
  --uno: 'flex flex-col gap-[6px]';

  &-caption {
    --uno: 'font-size-[14px] color-[#333333]';
  }

  &-specific {
    --uno: 'font-size-[14px] color-[#666] flex-1';
  }
}

.disabled {
  --uno: 'flex flex-row justify-between font-size-[14px] text-[#808089] rounded-[60px] bg-[rgba(222,222,222,0.5)] border-solid border-[1px] border-[rgba(230,230,232,0.7)] px-[10px] py-[8px] flex flex-row justify-items-start';

  .variational {
    --uno: 'flex-center-row gap-[2px]';
  }
}

.refer {
  --uno: 'flex flex-between h-[34px] min-w-[80px] gap-[4px] px-[12px] border-rd-[60px] text-[14px] bg-[#fff] border-[#e6e6e8] border-[1px] border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)] cursor-pointer';
}

.area {
  --uno: 'rounded-[8px] bg-[#fff] text-[#333] min-w-full max-h-[80px] px-[12px] py-[8px] font-size-[14px] border-solid border-[#E6E6E8] focus:border-[#3971F3] resize-none';
}

.input {
  --uno: 'flex-1 w-auto h-[34px] font-size-[14px] px-[12px] rounded-[60px] bg-[#fff] border-[#e6e6e8] border-[1px] border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)] focus:border-[#3971F3]';
}
</style>
