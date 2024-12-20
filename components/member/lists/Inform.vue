<script setup lang="ts">
const emits = defineEmits(['recharge', 'testing', 'send'])

const rules = ref([
  {
    num: 1,
    desc: '顾客需要关注门店公众号，才能收到公众号通知',
  },
  {
    num: 2,
    desc: '非必须的情况下请勿开启太多通知，否则顾客可能会因为过多通知而取关公众号',
  },
  {
    num: 3,
    desc: '若同时勾选了公众号和短信推送，顾客可能会同时收到两条通知',
  },
])

const showRecharge = () => {
  emits('recharge')
}

const userTesting = () => {
  emits('testing')
}

const sendMessage = () => {
  emits('send')
}

const checked = ref(['a'])

const themeVars = reactive({
  checkboxLabelColor: '#666',
})

const jumpRecord = () => {
  jump('/member/lists/historia')
}
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <common-gradient title="通道状态" theme="gradient" :italic="true">
      <template #right>
        <div
          class="button bg-[#0068FF] color-[#fff] hover:bg-[#1A77FF] active:bg-[#0052CC]"
          @click="jumpRecord"
        >
          短信记录
        </div>
      </template>

      <template #body>
        <div class="flex flex-col gap-[16px]">
          <div class="base flex flex-1 flex-col gap-[12px]">
            <div class="secondary">
              <div class="secondary-top">
                公众号
              </div>
              <div class="secondary-bottom">
                <common-tags text="正常" />
              </div>
            </div>
            <div class="secondary">
              <div class="secondary-top">
                短信
              </div>
              <div class="secondary-bottom">
                <common-tags text="正常" />
              </div>
            </div>

            <div class="h-0.4 bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />

            <div class="count flex flex-row justify-between gap-[8px]">
              <div class="flex flex-row items-center justify-start gap-[2px]">
                <span class="font-size-[14px] color-[#333]">
                  剩余短信条数
                </span>
                <span class="help">
                  <common-help :size="16">
                    <template v-for="(rule, index) in rules" :key="index">
                      <li class="font-size-[14px] color-[#333333] mb-[12px]">
                        {{ rule.desc }}
                      </li>
                    </template>
                  </common-help>
                </span>
              </div>
              <div class="secondary-bottom">
                <div class="flex flex-row items-center justify-start gap-[8px]">
                  <div class="flex flex-row items-center gap-[4px]">
                    <span class="font-size-[16px] color-[#333333]">
                      98
                    </span>
                    <span class="font-size-[14px] color-[#666]">
                      /条
                    </span>
                  </div>
                  <div class="recharge" @click="showRecharge">
                    充值
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </common-gradient>

    <common-gradient title="通知详情" theme="gradient" :italic="true" :foldable="true">
      <template #body>
        <div class="info grid grid-cols-1 gap-[16px]" uno-lg="grid-cols-1 gap-[16px]">
          <common-gradient title="订金单核销" theme="solid" :foldable="true" :has-shadow="true">
            <template #body>
              <div class="box flex flex-col gap-[12px]">
                <div class="item">
                  <div class="left">
                    通知内容
                  </div>

                  <div class="right">
                    订金单核销
                  </div>
                </div>

                <div class="item">
                  <div class="left">
                    推送对象
                  </div>

                  <div class="right">
                    关注公众号+绑定手机
                  </div>
                </div>

                <div class="item">
                  <div class="left">
                    通知说明
                  </div>

                  <div class="right">
                    订金单核销成功后通知顾客
                  </div>
                </div>

                <div class="item">
                  <div class="left">
                    推送方式
                  </div>

                  <div class="right">
                    <van-config-provider :theme-vars="themeVars" class="font-size-[14px]">
                      <van-checkbox-group v-model="checked" direction="horizontal">
                        <van-checkbox name="a" icon-size="16px">
                          公众号
                        </van-checkbox>
                        <van-checkbox name="b" icon-size="16px">
                          短信
                        </van-checkbox>
                      </van-checkbox-group>
                    </van-config-provider>
                  </div>
                </div>

                <div class="h-0.4 bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
              </div>
            </template>

            <template #footer>
              <div class="operation flex flex-row items-center justify-end gap-[16px] px-[16px] pb-[16px]">
                <div class="button color-[#0068FF] hover:bg-[#F1F5FE] hover:color-[#3971F3] active:bg-[#D9E4FF]" @click="sendMessage">
                  发送
                </div>

                <div class="button bg-[#0068FF] color-[#fff] hover:bg-[#1A77FF] active:bg-[#0052CC]" @click="userTesting">
                  测试
                </div>
              </div>
            </template>
          </common-gradient>
        </div>
      </template>
    </common-gradient>
  </div>
</template>

<style scoped lang="scss">
.secondary {
  --uno: 'flex flex-row items-center justify-start gap-[8px]';

  &-top {
    --uno: 'font-size-[14px] color-[#333333]';
  }
}

.item {
  --uno: 'flex flex-row items-center justify-between gap-[16px]';

  .left {
    --uno: 'font-size-[14px] color-[#333333]';
  }

  .right {
    --uno: 'font-size-[14px] color-[#666666]';
  }
}

.platform {
  --uno: 'flex flex-row items-center gap-[8px] px-[20px] py-[16px] bg-[#F1F5FE] flex-1 rounded-[8px] shadow shadow-sm';
}

.recharge {
  --uno: 'px-[16px] py-[6px] font-size-[14px] color-[#3971F3] bg-[#F1F5FE] rounded-[60px] cursor-pointer hover:bg-[#E6F0FF] active:bg-[#D9E4FF]';
}

.button {
  --uno: 'flex-center-row px-[20px] py-[4px] font-size-[14px] rounded-[8px] border-[1px] border-solid border-[#0068FF] cursor-pointer';
}
</style>
