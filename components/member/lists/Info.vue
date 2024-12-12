<script setup lang="ts">
const props = defineProps<{
  data: MemberInfo
}>()

const genderMap = {
  1: '男',
  2: '女',
  3: '未知',
}

const levelDesc = {
  1: '银卡',
  2: '金卡',
  3: '钻石卡',
}

const orderStatusMap = {
  1: '已售',
  2: '已完成',
  3: '已回收',
}

const statusType = (status: number) => {
  return status === 1 ? 'orange' : status === 2 ? 'green' : 'grey'
}

const goInfo = () => {
  jump('/sale/sales/order')
}
</script>

<template>
  <div class="grid-12">
    <div class="col-12 flex flex-col gap-[16px] px-[16px] py-[16px]" uno-lg="col-8 offset-2">
      <common-gradient title="基础信息" theme="gradient" :italic="true" :foldable="true">
        <template #body>
          <div class="flex flex-col gap-[12px]">
            <div class="flex flex-row gap-[32px]">
              <div class="avatar">
                <common-avatar :size="48" rounded="60px" />
              </div>
              <div class="base flex flex-1 flex-col gap-[8px]">
                <div class="item">
                  <div class="item-left">
                    姓名
                  </div>
                  <div class="item-right">
                    {{ props.data.compellation }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    昵称
                  </div>
                  <div class="item-right">
                    {{ props.data.nickname || '-- --' }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    手机号
                  </div>
                  <div class="item-right">
                    {{ props.data.phone }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    生日
                  </div>
                  <div class="item-right">
                    {{ props.data.birthday }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    性别
                  </div>
                  <div class="item-right">
                    {{ genderMap[props.data.gender || 3] }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    身份证号
                  </div>
                  <div class="item-right">
                    -- --
                  </div>
                </div>
              </div>
            </div>

            <div class="h-0.4 bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />

            <div class="secendary flex flex-1 flex-col gap-[8px] px-[80px]">
              <div class="item">
                <div class="item-left">
                  姓名
                </div>
                <div class="item-right">
                  {{ props.data.compellation }}
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  昵称
                </div>
                <div class="item-right">
                  {{ props.data.nickname || '-- --' }}
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  手机号
                </div>
                <div class="item-right">
                  {{ props.data.phone }}
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  生日
                </div>
                <div class="item-right">
                  {{ props.data.birthday }}
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  性别
                </div>
                <div class="item-right">
                  {{ genderMap[props.data.gender || 3] }}
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  身份证号
                </div>
                <div class="item-right">
                  -- --
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  常去门店
                </div>
                <div class="item-right">
                  某某某某店
                </div>
              </div>
            </div>
          </div>
        </template>
      </common-gradient>

      <common-gradient title="收货地址" theme="gradient" :italic="true" :foldable="true">
        <template #body>
          <div class="flex flex-col gap-[12px]">
            <div class="base flex flex-1 flex-col gap-[12px]">
              <div class="secondary">
                <div class="secondary-top">
                  姓名
                </div>
                <div class="secondary-bottom">
                  <common-frame :disabled-style="true" :tip="props.data.receiving?.name" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  联系方式
                </div>
                <div class="secondary-bottom">
                  <common-frame :disabled-style="true" :tip="props.data.receiving?.phone" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  地址
                </div>
                <div class="secondary-bottom">
                  <textarea
                    name="textarea"
                    rows="5"
                    cols="30"
                    disabled
                    :placeholder="props.data.receiving?.address"
                    class="area"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </common-gradient>

      <common-gradient title="详细信息" theme="gradient" :italic="true" :foldable="true">
        <template #body>
          <div class="grid grid-cols-1 gap-[8px]" uno-md="grid-cols-2" uno-lg="grid-cols-2">
            <div class="base flex flex-1 flex-col gap-[8px]">
              <div class="item">
                <div class="item-left">
                  会员年限
                </div>
                <div class="item-right">
                  213298793729
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  会员等级
                </div>
                <div class="item-right">
                  <common-level :desc="levelDesc[props.data.level]" />
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  手机号
                </div>
                <div class="item-right">
                  {{ props.data.phone }}
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  邀请人
                </div>
                <div class="item-right">
                  -- --
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  专属顾问
                </div>
                <div class="item-right">
                  {{ props.data.adviser }}
                </div>
              </div>
            </div>

            <div class="secendary flex flex-1 flex-col gap-[8px]">
              <div class="item">
                <div class="item-left">
                  当前积分
                </div>
                <div class="item-right">
                  -5
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  累计积分
                </div>
                <div class="item-right">
                  -2
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  累计消费
                </div>
                <div class="item-right">
                  89000
                </div>
              </div>
            </div>
          </div>
        </template>
      </common-gradient>

      <common-gradient title="消费记录" theme="gradient" :italic="true" :foldable="true">
        <template #body>
          <div class="grid grid-cols-1 gap-[8px]" uno-md="grid-cols-2" uno-lg="grid-cols-2 gap-[16px]">
            <template v-for="(item, index) in props.data.consumeRecords" :key="index">
              <common-gradient :title="item.goodsName" theme="solid" :italic="false" :foldable="true">
                <template #body>
                  <div class="flex flex-col gap-[12px]">
                    <div class="base flex flex-1 flex-col gap-[8px]">
                      <div class="item">
                        <div class="item-left">
                          应付款
                        </div>
                        <div class="item-right">
                          {{ item.shouldPay }}
                        </div>
                      </div>
                      <div class="item">
                        <div class="item-left">
                          消费门店
                        </div>
                        <div class="item-right">
                          {{ item.store }}
                        </div>
                      </div>
                      <div class="item">
                        <div class="item-left">
                          订单编号
                        </div>
                        <div class="item-right">
                          {{ item.orderId }}
                        </div>
                      </div>
                      <div class="item">
                        <div class="item-left">
                          状态
                        </div>
                        <div>
                          <common-tags :text="orderStatusMap[item.status]" :type="statusType(item.status)" />
                        </div>
                      </div>
                    </div>

                    <div class="h-0.4 bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
                  </div>
                </template>

                <template #footer>
                  <div class="flex flex-row justify-between items-center gap-[12px] px-[16px] pb-[16px]">
                    <div class="flex-center-row flex-start gap-[2px] items-center">
                      <div class="item-left">
                        实付款
                      </div>
                      <div class="font-size-[14px] font-normal color-[#FF2F2F]">
                        {{ item.payAmount }}
                      </div>
                    </div>

                    <div class="opration">
                      <!-- 跳转至销售单详情页 -->
                      <div class="font-size-[14px] color-[#3971F3] font-semibold cursor-pointer" @click="goInfo">
                        查看详情
                      </div>
                    </div>
                  </div>
                </template>
              </common-gradient>
            </template>
          </div>
        </template>
      </common-gradient>
    </div>
  </div>
  <div class="h-[80px]">
    <common-button-bottom confirm-text="编辑" cancel-text="返回" />
  </div>
</template>

<style scoped lang="scss">
.item {
  --uno: 'flex-center-row flex-start gap-[12px] items-center';

  &-left {
    --uno: 'font-size-[14px] color-[#666666] font-normal';
  }
  &-right {
    --uno: 'font-size-[14px] color-[#333333] font-normal';
  }
}

.secondary {
  --uno: 'flex flex-col gap-[8px]';

  &-top {
    --uno: 'font-size-[14px] color-[#333333]';
  }
}

.area {
  --uno: 'rounded-[8px] bg-[rgba(222,222,222,0.5)] min-w-full max-h-[80px] px-[12px] py-[10px] font-size-[14px] border-solid border-[#E6E6E8]';
}
</style>
