<script setup lang="ts">
useSeoMeta({
  title: '会员通知',
})

// 充值弹窗
const show = ref(false)
const rechargePop = () => {
  show.value = !show.value
}

// 测试通知弹窗
const testing = ref(false)
const beta = () => {
  testing.value = !testing.value
}

// 积分清零通知弹窗
const notice = ref(false)
const noticePop = () => {
  notice.value = !notice.value
}

const per = ref([
  {
    id: 1,
    name: '100条',
    price: 100,
    discount: 0.95,
  },
  {
    id: 2,
    name: '200条',
    price: 200,
  },
  {
    id: 3,
    name: '300条',
    price: 250,
    discount: 0.6,
  },
])

/**
 * 测试弹窗提醒文本
 */
const tips = ref([
  {
    id: 1,
    label: '1、关注门店公众号',
  },
  {
    id: 2,
    label: '2、用手机号绑定成为门店会员',
  },
])

/**
 * 积分清零弹窗提醒文本
 */
const warnPhrase = [
  {
    id: 1,
    label: '1、该类提醒，用于积分清零前，提醒顾客到店使用积分;',
  },
  {
    id: 2,
    label: '2、若使用短信提醒，请根据会员数量、确保短信条数。若短信条数不足，会发送失败;',
  },
  {
    id: 3,
    label: '3、请仅在需要通知顾客时使用该功能。临近清零前会每天自动发送提醒一次。',
  },
]

const rechargeWay = ref()

const pushMode = ref(['official'])

const counter = useState('counter', () => 0)

const process = (val: number) => {
  return counter.value = val * 10
}
</script>

<template>
  <div class="grid-12">
    <common-model v-model:model-value="show" :show-ok="true" title="短信充值">
      <div class="inner">
        <div class="options model">
          <div class="top">
            充值条数
          </div>
          <template v-for="item in per" :key="item.id">
            <div class="part">
              <div class="flex-center-row gap-[16px] flex-start">
                <div class="flex-center-row gap-[8px]">
                  <n-radio-group v-model:value="rechargeWay">
                    <n-radio :value="item.id" icon-size="18px" />
                  </n-radio-group>

                  <div class="font-size-[14px] color-[#333] dark:color-[#fff]">
                    {{ item.name }}
                  </div>
                </div>

                <template v-if="item.discount">
                  <div class="flex-center-row gap-[2px] italic">
                    <span class="color-[#FFAA04] text-[14px]">
                      {{ process(item.discount) }}
                    </span>
                    <span class="color-[#FFAA04] text-[14px]">
                      折
                    </span>
                  </div>
                </template>
              </div>

              <div>
                <span class="color-[#3971F3] dark:color-[#FFFFFF] text-[14px]">
                  {{ item.price }}
                </span>
                <span class="color-[#666] dark:color-[#FFFFFF] text-[14px]">
                  /元
                </span>
              </div>
            </div>
          </template>
        </div>

        <div class="count model">
          <div class="top">
            充值金额
          </div>

          <div>
            <common-frame :is-disabled="true" tip="168元" />
          </div>
        </div>

        <div class="methed model">
          <div class="top">
            充值方式
          </div>

          <div>
            <common-frame :is-disabled="true" tip="微信支付" />
          </div>
        </div>
      </div>
    </common-model>

    <common-model v-model:model-value="testing" :show-ok="true" title="测试通知">
      <div class="inner">
        <div class="flex flex-col gap-[12px]">
          <div class="font-size-[14px] color-[#333] dark:color-[#fff]">
            发送测试前，请确认完成以下操作：
          </div>

          <div class="ordered flex flex-col gap-[8px]">
            <template v-for="item in tips" :key="item.id">
              <div class="font-size-[14px] color-[#333] dark:color-[#fff]">
                {{ item.label }}
              </div>
            </template>
          </div>
        </div>

        <div>
          <common-frame tip="请输入用户手机号" />
        </div>
      </div>
    </common-model>

    <common-model v-model:model-value="notice" :show-ok="true" title="积分清零通知">
      <div class="inner">
        <div class="flex flex-col gap-[6px]">
          <template v-for="item in warnPhrase" :key="item.id">
            <div class="font-size-[14px] color-[#666] dark:color-[#cbcdd1] italic">
              {{ item.label }}
            </div>
          </template>
        </div>

        <div class="flex flex-col gap-[8px]">
          <div class="font-size-[14px] color-[#333] dark:color-[#fff]">
            清零时间
          </div>

          <div>
            <common-frame tip="单位/天数" />
          </div>
        </div>

        <div class="flex flex-col gap-[8px]">
          <div class="font-size-[14px] color-[#333] dark:color-[#fff]">
            门店名
          </div>

          <div>
            <common-frame tip="请输入门店名称" />
          </div>
        </div>

        <div class="flex flex-col gap-[8px]">
          <div class="font-size-[14px] color-[#333] dark:color-[#fff]">
            联系电话
          </div>

          <div>
            <common-frame tip="请输入用户手机号" />
          </div>
        </div>

        <div class="flex flex-col gap-[8px]">
          <div class="font-size-[14px] color-[#333] dark:color-[#fff]">
            发送方式
          </div>

          <div>
            <n-checkbox-group v-model:value="pushMode">
              <n-space>
                <n-checkbox
                  value="a"
                  label="公众号"
                  :style="{
                    '--n-color-checked': '#0068ff',
                    '--n-border-color-active': '#0068ff',
                    '--n-check-mark-color': 'white',
                  }"
                />
                <n-checkbox
                  value="b"
                  label="短信"
                  :style="{
                    '--n-color-checked': '#0068ff',
                    '--n-border-color-active': '#0068ff',
                    '--n-check-mark-color': 'white',
                  }"
                />
              </n-space>
            </n-checkbox-group>
          </div>
        </div>
      </div>
    </common-model>

    <div class="col-12 px-[16px] py-[16px]" uno-lg="col-8 offset-2">
      <member-lists-inform @recharge="rechargePop" @testing="beta" @send="noticePop" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.model {
  --uno: 'flex flex-col gap-[8px]';
}
.top {
  --uno: 'font-size-[14px] color-[#333] dark:color-[#fff]';
}

.part {
  --uno: 'flex flex-row justify-between items-center px-[16px] py-[16px] bg-[#fff] dark:bg-[rgba(255,255,255,0.05)] rounded-[8px] shadow shadow-md';
}

.inner {
  --uno: 'flex flex-col gap-[16px] pb-[32px]';
}
</style>
