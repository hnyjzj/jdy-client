<script setup lang="ts">
const props = defineProps<{
  data: Member
  consumes: orderInfoProducts[]
  filterList: Where<Member>
}>()
// 企业微信、单聊入口所需页面

const emits = defineEmits<{
  goEdit: [id: string]
  showDetail: [id: string]
}>()

const PERCH = '-- --'

const processDuring = () => {
  if (props.data.created_at) {
    const diffDays = Math.floor((new Date().getTime() - new Date(props.data.created_at).getTime()) / (24 * 3600 * 1000))
    return diffDays
  }
}

const cutOut = (current: string | undefined) => {
  // 截取日期
  if (current) {
    return current.slice(0, 10)
  }
}

const backtrack = () => {
  const { back } = useRouter()
  back()
}

const content = ref('查询中，请稍后...')
const showText = () => {
  if (!props.data.id && props.data.external_user_id) {
    content.value = '该会员信息有缺失！请前往编辑完善'
  }
  else if (!props.data.external_user_id) {
    content.value = '查询中，请稍后...'
  }
}

const OrderStatusTextMap = {
  1: '待付款',
  2: '已取消',
  3: '已完成',
  4: '有退款',
  5: '已退货',
}

const processDate = (date: string) => {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
}

onMounted(() => {
  showText()
})
</script>

<template>
  <div class="grid-12 pb-[80px]">
    <template v-if="props.data.id">
      <div class="col-12 flex flex-col gap-[16px] px-[16px] py-[16px]" uno-lg="col-8 offset-2">
        <div>
          <common-gradient title="基础信息" theme="gradient" :italic="true" :foldable="true">
            <template #body>
              <div class="grid grid-cols-1 gap-[12px]" uno-md="grid-cols-2" uno-lg="grid-cols-2">
                <div class="flex flex-row gap-[32px]">
                  <div class="base flex flex-1 flex-col gap-[8px]">
                    <div class="item">
                      <div class="item-left">
                        姓名
                      </div>
                      <div class="item-right">
                        {{ props.data.name || PERCH }}
                      </div>
                    </div>
                    <div class="item">
                      <div class="item-left">
                        昵称
                      </div>
                      <div class="item-right">
                        {{ props.data.nickname || PERCH }}
                      </div>
                    </div>
                    <div class="item">
                      <div class="item-left">
                        手机号
                      </div>
                      <div class="item-right">
                        {{ props.data.phone || PERCH }}
                      </div>
                    </div>
                    <div class="item">
                      <div class="item-left">
                        会员等级
                      </div>
                      <div class="item-right">
                        <!-- <common-level :desc="getTarget('level', 'level')" /> -->
                        {{ props.filterList.level?.preset[props.data.level] || PERCH }}
                      </div>
                    </div>
                    <div class="item">
                      <div class="item-left">
                        生日
                      </div>
                      <div class="item-right">
                        {{ props.data.birthday || PERCH }}
                      </div>
                    </div>
                    <div class="item">
                      <div class="item-left">
                        纪念日
                      </div>
                      <div class="item-right">
                        {{ props.data.anniversary || PERCH }}
                      </div>
                    </div>
                    <div class="item">
                      <div class="item-left">
                        性别
                      </div>
                      <div class="item-right">
                        {{ props.data.gender === 1 ? '男' : props.data.gender === 2 ? '女' : '未知' }}
                      </div>
                    </div>
                    <div class="item">
                      <div class="item-left">
                        身份证号
                      </div>
                      <div class="item-right">
                        {{ props.data.id_card
                          ? (`${props.data.id_card.slice(0, 6)}********${props.data.id_card.slice(-4)}`)
                          : PERCH }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="secendary flex flex-1 flex-col gap-[8px]">
                  <div class="item">
                    <div class="item-left">
                      入会门店
                    </div>
                    <div class="item-right">
                      {{ props.data.store?.name || PERCH }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-left">
                      入会时间
                    </div>
                    <div class="item-right">
                      {{ cutOut(props.data.created_at) || PERCH }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-left">
                      常去门店
                    </div>
                    <div class="item-right">
                      {{ PERCH }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-left">
                      来源
                    </div>
                    <div class="item-right">
                      {{ PERCH }}
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
                      <span>
                        {{ processDuring() || PERCH }}
                      </span>
                      <span class="font-size-[12px] color-[#333] dark:color-[#fff]">
                        /天
                      </span>
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-left">
                      邀请人
                    </div>
                    <div class="item-right">
                      {{ PERCH }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-left">
                      专属顾问
                    </div>
                    <div class="item-right">
                      {{ props.data.consultant?.nickname || PERCH }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-left">
                      当前积分
                    </div>
                    <div class="item-right">
                      {{ props.data.integral || PERCH }}
                    </div>
                  </div>
                </div>

                <div class="secendary flex flex-1 flex-col gap-[8px]">
                  <div class="item">
                    <div class="item-left">
                      累计积分
                    </div>
                    <div class="item-right">
                      {{ PERCH }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-left">
                      参与活动
                    </div>
                    <div class="item-right">
                      <span>
                        {{ props.data.event_count }}
                      </span>
                      <span class="font-size-[12px] color-[#333] dark:color-[#fff]">
                        /次
                      </span>
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-left">
                      累计消费
                    </div>
                    <div class="item-right">
                      <span>
                        {{ props.data.event_count }}
                      </span>
                      <span class="font-size-[12px] color-[#333] dark:color-[#fff]">
                        /元
                      </span>
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
                      <common-frame :disabled-style="true" :tip="props.data.name || PERCH" />
                    </div>
                  </div>
                  <div class="secondary">
                    <div class="secondary-top">
                      联系方式
                    </div>
                    <div class="secondary-bottom">
                      <common-frame :disabled-style="true" :tip="props.data.phone || PERCH" />
                    </div>
                  </div>
                  <div class="secondary">
                    <div class="secondary-top">
                      地址
                    </div>
                    <div class="secondary-bottom">
                      <textarea name="textarea" placeholder="该会员暂无地址" rows="5" cols="30" disabled class="area" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </common-gradient>

          <common-gradient title="消费记录" theme="gradient" :italic="true" :foldable="true">
            <template #body>
              <template v-if="props.consumes.length > 0">
                <div class="flex flex-col gap-[12px]">
                  <template v-for="(item, index) in props.consumes" :key="index">
                    <common-gradient :title="`订单号：${item.order_id}`" theme="solid" :foldable="true" font-size="14px">
                      <template #right>
                        <div class="butt" @click="emits('showDetail', item.order_id)">
                          查看详情
                        </div>
                      </template>
                      <template #body>
                        <div class="grid grid-cols-1 gap-[8px]" uno-md="grid-cols-2" uno-lg="grid-cols-2">
                          <div class="base flex flex-1 flex-col gap-[8px]">
                            <div class="item">
                              <div class="item-left">
                                所属门店
                              </div>
                              <div class="item-right">
                                {{ item.store.name || PERCH }}
                              </div>
                            </div>
                            <div class="item">
                              <div class="item-left">
                                销售单号
                              </div>
                              <div class="item-right">
                                {{ item.order_id }}
                              </div>
                            </div>
                          </div>

                          <div class="secendary flex flex-1 flex-col gap-[8px]">
                            <div class="item">
                              <div class="item-left">
                                订单状态
                              </div>
                              <div class="item-right">
                                {{ OrderStatusTextMap[item.status as OrderStatusText] }}
                              </div>
                            </div>
                            <div class="item">
                              <div class="item-left">
                                销售时间
                              </div>
                              <div class="item-right">
                                {{ processDate(item.created_at) }}
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
                <common-emptys text="暂无消费记录" />
              </template>
            </template>
          </common-gradient>
        </div>
      </div>
    </template>
    <template v-else>
      <common-emptys text="查询用户中" />
    </template>
  </div>

  <template v-if="props.data.id || props.data.external_user_id">
    <common-button-One text="编辑" @confirm="() => emits('goEdit', props.data.id)" @cancel="backtrack" />
  </template>
</template>

<style scoped lang="scss">
.item {
  --uno: 'flex-center-row flex-start gap-[12px] items-center';

  &-left {
    --uno: 'font-size-[14px] color-[#666666] font-normal dark:color-[#cbcdd1]';
  }

  &-right {
    --uno: 'font-size-[14px] color-[#333333] font-normal dark:color-[#fff]';
  }
}

.secondary {
  --uno: 'flex flex-col gap-[8px]';

  &-top {
    --uno: 'font-size-[14px] color-[#333333] dark:color-[#fff]';
  }
}

.area {
  --uno: 'rounded-[8px] bg-[rgba(222,222,222,0.5)] dark:bg-[rgba(255,255,255,0.1)] min-w-full max-h-[80px] px-[12px] py-[10px] font-size-[14px] border-solid border-[#E6E6E8] dark:border-[rgba(239,240,246,0.3)]';
}
</style>
