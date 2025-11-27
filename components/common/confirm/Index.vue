<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title?: string
  text?: string
  textb?: string
  icon?: string
  cancelText?: string
  confirmText?: string
  isCountdown?: boolean
  countdownSeconds?: number
}>(), {
  title: '提示',
  text: '确认删除此数据吗',
  icon: 'none',
  cancelText: '取消',
  confirmText: '确认',
  isCountdown: false,
  countdownSeconds: 5,
})

const emits = defineEmits<{
  submit: []
  cancel: []
}>()

const show = defineModel('show', { default: false })

const timeLeft = ref(props.countdownSeconds)
let timer: ReturnType<typeof setInterval> | null = null

const startCountdown = () => {
  if (!props.isCountdown)
    return
  timeLeft.value = props.countdownSeconds
  timer && clearInterval(timer)
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer!)
      timer = null
    }
  }, 1000)
}

watch(
  () => show.value,
  (val) => {
    if (val) {
      startCountdown()
    }
    else {
      timer && clearInterval(timer)
      timer = null
    }
  },
)

onBeforeUnmount(() => {
  timer && clearInterval(timer)
})

const submit = () => {
  if (props.isCountdown && timeLeft.value > 0)
    return
  emits('submit')
  show.value = false
}

const cancle = () => {
  show.value = false
  emits('cancel')
}
</script>

<template>
  <div v-if="show" class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex-center-row z-[999]">
    <div class="w-[312px]  rounded-[8px] blur-bga">
      <div class="py-[16px] flex-center-col gap-[16px] text-[14px] font-semibold">
        <div class="flex-center-row">
          <template v-if="props.icon === 'none'">
            <div class="bg-[#3075FF] rounded-[50%] wh-[24px] flex-center-row mr-[8px]">
              <Icon name="i-icon:help" color="#fff" :size="16" />
            </div>
          </template>
          <template v-if="props.icon === 'success'">
            <div class="bg-[#30D554] rounded-[50%] wh-[24px] flex-center-row mr-[8px]">
              <Icon name="i-icon:success" color="#fff" :size="16" />
            </div>
          </template>
          <template v-if="props.icon === 'error'">
            <div class="bg-[#FF2F2F] rounded-[50%] wh-[24px] flex-center-row mr-[8px]">
              <Icon name="i-icon:error" color="#fff" :size="16" />
            </div>
          </template>
          <template v-if="props.icon === 'warning'">
            <div class="bg-[#FDB830] rounded-[50%] wh-[24px] flex-center-row mr-[8px]">
              <Icon name="i-icon:warning" color="#fff" :size="16" />
            </div>
          </template>
          <div class="font-semibold line-height-[20px] color-[#333] dark:color-[#fff]">
            {{ props.title }}
          </div>
        </div>
        <div class="line-height-[24px] color-[#333] dark:color-[#fff]  text-center">
          {{ props.text }}
        </div>
        <template v-if="props.textb">
          <div class="line-height-[24px] color-[#333] dark:color-[#fff] text-center">
            {{ props.textb }}
          </div>
        </template>
      </div>
      <div class="flex gap-[16px] px-[16px] py-[12px] shadow-[0px_-1px_15px_0px_rgba(0,0,0,0.1)]">
        <div class="base cancle" @click="cancle">
          {{ props.cancelText }}
        </div>
        <div
          class="base confirm"
          :class="{ 'opacity-40 cursor-not-allowed': props.isCountdown && timeLeft > 0 }"
          @click="submit"
        >
          <template v-if="props.isCountdown && timeLeft > 0">
            {{ props.confirmText }} ({{ timeLeft }}s)
          </template>
          <template v-else>
            {{ props.confirmText }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base {
  --uno: 'cursor-pointer  px-[51px] py-[6px] font-semibold line-height-[24px] rounded-3xl text-[14px]';
}
.confirm {
  --uno: ' color-[#fff] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] ';
}
.cancle {
  --uno: ' color-[#3971F3] bg-[#fff] border-[1px] border-solid border-[#3971F3]';
}
</style>
