<script lang="ts" setup>
const props = defineProps<{
  goodinfo: any[]
}>()

const { $toast } = useNuxtApp()

const options = [
  {
    label: '支付宝',
    value: '支付宝',
  },
  {
    label: '微信',
    value: '微信',
  },
  {
    label: '银联',
    value: '银联',
  },
]

const getInitialItems = () => [{ id: 1, multiple: '支付信息', isPopoverVisible: false, options, selected: '' }]
const items = ref(getInitialItems())
let id = items.value.length + 1

const insertItem = () => {
  if (items.value.length >= 11) {
    $toast.warning('最多添加11种支付方式')
    return
  }
  // 添加新的支付信息栏并初始化状态
  items.value.push({ id: id++, multiple: '支付信息', isPopoverVisible: false, options, selected: '' })
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
              <div class="color-[#333] dark:color-[#FFFFFF] text-[14px] font-normal">
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
        <div class="font-size-[14px] font-normal color-[#333] dark:color-[#fff]">
          备注信息
        </div>
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
      <div class="flex flex-col gap-[12px] w-full">
        <TransitionGroup name="operation">
          <template v-for="item in items" :key="item.id">
            <div class="flex flex-row items-end items-center gap-[12px]">
              <div class="select-item">
                <n-popselect
                  v-model:value="item.multiple"
                  :options="item.options"
                  size="medium"
                  scrollable
                  trigger="click"
                  @update:value="() => {
                    item.selected = item.multiple
                    const isExist = items.some(i => i !== item && i.selected === item.multiple)
                    if (isExist) {
                      item.multiple = '支付信息'
                      item.selected = ''
                      $toast.warning('该支付方式已被选择')
                      return
                    }
                  }"
                >
                  <n-button style="width: auto; min-width: 100px; color: #333;">
                    {{ item.multiple }}
                  </n-button>
                </n-popselect>
              </div>

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

<style>
.n-button {
  border-radius: 60px;
  height: 42px;
}

.n-border-hover {
  border-color: #3971f3;
}

.n-border-focus {
  border-color: #3971f3;
}
</style>

<style lang="scss" scoped>
.refer {
  --uno: 'flex flex-between min-w-[80px] gap-[4px] px-[12px] py-[6px] border-rd-[60px] text-[14px] bg-[#fff] border-[#e6e6e8] border-[1px] border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)]';
}

.remark {
  --uno: 'w-auto border-[#E6E6E8] border border-solid rounded-[8px] px-[4px] pt-[4px] pb-[32px] bg-[#fff] tracking-[1px] text-[14px] dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.3)] color-[#333] dark:color-[#fff] resize-y';
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
