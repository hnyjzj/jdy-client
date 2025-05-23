<script setup lang="ts">
const router = useRouter()

const HINT_TEXT = '返回上一页'

const jumpTo = () => {
  try {
    if (router.currentRoute.value.path !== '/') {
      if (window.history.length > 1) {
        router.back()
      }
      else {
        router.push('/')
      }
    }
  }
  catch (e) {
    console.error('导航出错了！', e)
    router.push('/')
  }
}

useHead({
  title: '无权限',
})
</script>

<template>
  <nuxt-layout>
    <div class="px-[32px] pt-[240px]">
      <div class="flex-center-col gap-[32px]">
        <div
          class="text-[#1D1D1D] font-size-[160px] font-bold dark:text-[#F5F5F5] row-height"
          uno-lg="font-size-[240px]"
        >
          403
        </div>

        <div class="flex-center-col gap-[16px]">
          <div class="font-semibold text-[32px] color-[#333] dark:color-[#F2F2F2] row-height">
            您暂时无权访问!
          </div>
          <div class="font-size-[20px] color-[#333] dark:color-[#F2F2F2] flex-center-col gap-[6px] row-height">
            <span>请联系管理员处理。</span>
          </div>
        </div>

        <div class="operation cursor-pointer bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[36px] shadow-lg shadow-[rgba(57,113,243,0.3)] row-height">
          <div class="font-size-[16px] font-bold text-white px-[40px] py-[8px]" @click="jumpTo">
            {{ HINT_TEXT }}
          </div>
        </div>
      </div>
    </div>
  </nuxt-layout>
</template>

<style lang="scss" scoped>
.operation:hover {
  background: linear-gradient(180deg, #1a6beb 30%, #6ea6ff);
}

.row-height {
  line-height: 100% !important;
}
</style>
