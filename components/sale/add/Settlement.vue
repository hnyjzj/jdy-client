<script lang="ts" setup>
const props = defineProps<{
  goodinfo: any[]
}>()

const actions = [
  { text: '微信' },
  { text: '支付宝' },
  { text: '现金' },
]

const { $toast } = useNuxtApp()

const getInitialItems = () => [{ id: 1, isPopoverVisible: false, actions, selected: '' }]
const items = ref(getInitialItems())
let id = items.value.length + 1

const insertItem = () => {
  if (items.value.length >= 3) {
    $toast({
      msg: '最多可选择3种支付方式',
      type: 'warning',
      ico: 'i-icon:warning',
    })
    return
  }
  // 添加新的支付信息栏并初始化状态
  items.value.push({ id: id++, isPopoverVisible: false, actions, selected: '' })
}

function removeItem(item: { id: number }) {
  const i = items.value.findIndex(i => i.id === item.id)
  if (i > -1) {
    items.value.splice(i, 1)
  }
}
</script>

<template>
  <common-fold title="结算信息">
    <div class="p-[16px]">
      <div class="grid-cols-[1fr] gap-[16px]" uno-lg="grid-cols-[1fr]" uno-md="grid">
        <div class="flex flex-col gap-[12px]">
          <template v-for="(item, index) in props.goodinfo" :key="index">
            <div class="flex items-center justify-between">
              <div class="color-[#333] dark:color-[#FFFFFF] text-[16px] font-medium">
                {{ item.name }}
              </div>
              <common-frame
                v-model="item.num"
              />
            </div>
          </template>
        </div>
      </div>
      <div class="mt-[14px] py-[14px] border-y-[#E6E6E8] border-y-0.4 border-y-solid dark:border-y-[rgba(230,230,232,0.3)]">
        <div class="flex flex-col gap-[10px] items-end">
          <div class="text-[16px] font-semibold text-[#3971F3]">
            <span class="mr-[4px]">实付金额:</span>
            <span>00.00</span>
          </div>
          <div class="text-[16px] font-semibold text-[#3971F3]">
            <span class="mr-[4px]">积分合计:</span>
            <span>00.00</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-[8px] pt-[8px]">
        <label for="remark color-[#333] dark:color-[#fff]">备注信息</label>
        <textarea
          id="remark" name="remark"
          class="remark"
          placeholder="请输入内容"
        />
        <div class="flex">
          <div class="text-[#3971F3] text-[14px] px-[8px] bg-[#F1F5FE] rounded-[8px]">
            常用备注
          </div>
        </div>
      </div>
      <div class="text-[#FF2F2F] text-[16px] font-semibold py-[12px]">
        <span class="mr-[4px]">剩余未支付:</span>
        <span>00.00</span>
      </div>
      <div class="flex flex-col gap-[12px]">
        <TransitionGroup name="operation">
          <template v-for="item in items" :key="item.id">
            <div class="flex flex-row items-end gap-[12px]">
              <van-popover
                v-model:show="item.isPopoverVisible"
                :actions="item.actions"
                @select="(action) => {
                  if (items.some(i => i !== item && i.selected === action.text)) {
                    $toast({
                      msg: '该支付方式已被选择',
                      type: 'warning',
                    })
                    return
                  }
                  item.selected = action.text
                }">
                <template #reference>
                  <div class="refer">
                    <div class="row-left color-[#333] dark:color-[#fff] font-size-[14px] text-nowrap">
                      {{ item.selected || '支付方式' }}
                    </div>
                    <div class="row-right">
                      <van-icon name="arrow-down" color="#333" />
                    </div>
                  </div>
                </template>
              </van-popover>
              <common-frame tip="金额" uno-lg="flex-1" uno-md="flex-1" />
              <template v-if="item.id === 1">
                <sale-plusminus
                  @button-click="insertItem()" />
              </template>
              <template v-else>
                <sale-plusminus
                  :is-add="false"
                  @button-click="removeItem(item)" />
              </template>
            </div>
          </template>
        </TransitionGroup>
      </div>
    </div>
  </common-fold>
</template>

<style lang="scss" scoped>
.refer {
  --uno: 'flex flex-between min-w-[80px] gap-[4px] px-[12px] py-[6px] border-rd-[60px] text-[14px] bg-[#fff] border-[#e6e6e8] border-[1px] border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)]';
}

.remark {
  --uno: 'w-auto border-[#CBCDD1] border border-solid rounded-[8px] px-[4px] pt-[4px] pb-[32px] bg-[#fff] tracking-[1px] text-[14px] dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.3)] color-[#333] dark:color-[#fff] resize-y';
}

textarea::placeholder {
  --uno: 'color-[#cbcdd1]';
}

.operation-enter-active,
.operation-leave-active {
  --uno: 'transition-all ease-in-out duration-500';
}
.operation-enter-from,
.operation-leave-to {
  --uno: 'translate-x-[30px] opacity-0';
}

textarea:focus {
  --uno: 'border border-solid border-[1px] border-[#3971f3] outline-[none]';
}
</style>
