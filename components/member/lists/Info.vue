<script setup lang="ts">
const props = defineProps<{
  data: Member
}>()

const emit = defineEmits<{
  goEdit: [id: string]
}>()

const PERCH = '-- --'

const { getMemberWhere } = useMemberManage()
await getMemberWhere()

const memberParams = props.data

const { filterListToArray } = storeToRefs(useMemberManage())

const showInfo = filterListToArray.value

const getTarget = (keyword: string, type: 'gender' | 'level') => {
  const targetOption = showInfo?.find(p => p.name === keyword)
  const targetPreset = targetOption?.preset
  return targetPreset[memberParams[type]]
}

const processDuring = () => {
  if (memberParams.created_at) {
    const diffDays = Math.floor((new Date().getTime() - new Date(memberParams.created_at).getTime()) / (24 * 3600 * 1000))
    return diffDays
  }
}

const cutOut = (current: string | undefined) => {
  if (current) {
    return current.slice(0, 10)
  }
}

const backtrack = () => {
  const { back } = useRouter()
  back()
}
</script>

<template>
  <div class="grid-12 pb-[80px]">
    <div class="col-12 flex flex-col gap-[16px] px-[16px] py-[16px]" uno-lg="col-8 offset-2">
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
                    {{ memberParams.name || PERCH }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    昵称
                  </div>
                  <div class="item-right">
                    {{ memberParams.nickname || PERCH }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    手机号
                  </div>
                  <div class="item-right">
                    {{ memberParams.phone || PERCH }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    会员等级
                  </div>
                  <div class="item-right">
                    <common-level :desc="getTarget('level', 'level')" />
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    生日
                  </div>
                  <div class="item-right">
                    {{ memberParams.birthday || PERCH }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    纪念日
                  </div>
                  <div class="item-right">
                    {{ memberParams.anniversary || PERCH }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    性别
                  </div>
                  <div class="item-right">
                    {{ getTarget('gender', 'gender') || PERCH }}
                  </div>
                </div>
                <div class="item">
                  <div class="item-left">
                    身份证号
                  </div>
                  <div class="item-right">
                    {{ memberParams.id_card
                      ? (`${memberParams.id_card.slice(0, 6)}********${props.data.id_card.slice(-4)}`)
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
                  {{ memberParams.store?.name || PERCH }}
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  入会时间
                </div>
                <div class="item-right">
                  {{ cutOut(memberParams.created_at) || PERCH }}
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  常去门店
                </div>
                <div class="item-right">
                  {{ memberParams.store?.name || PERCH }}
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  来源
                </div>
                <div class="item-right">
                  {{ memberParams.store?.name || PERCH }}
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
                  <common-frame :disabled-style="true" :tip="memberParams.name || PERCH" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  联系方式
                </div>
                <div class="secondary-bottom">
                  <common-frame :disabled-style="true" :tip="memberParams.phone || PERCH" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  地址
                </div>
                <div class="secondary-bottom">
                  <textarea
                    name="textarea"
                    placeholder="该会员暂无地址"
                    rows="5"
                    cols="30"
                    disabled
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
                  {{ memberParams.consultant?.nickname || PERCH }}
                </div>
              </div>
              <div class="item">
                <div class="item-left">
                  当前积分
                </div>
                <div class="item-right">
                  {{ memberParams.integral || PERCH }}
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
                    {{ memberParams.event_count }}
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
                    {{ memberParams.event_count }}
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
    </div>
  </div>
  <common-button-bottom
    confirm-text="编辑"
    cancel-text="返回"
    @confirm="() => emit('goEdit', memberParams.id)"
    @cancel="backtrack"
  />
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
