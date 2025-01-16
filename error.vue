<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

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
  title: `${props.error?.statusCode} - ${props.error?.statusMessage}`,
})
</script>

<template>
  <nuxt-layout>
    <div class="grid-12 min-h-screen overflow-hidden">
      <div class="col-8 offset-2 flex-center-col" uno-lg="col-8 offset-2">
        <div class="flex-center-col gap-[32px]">
          <div
            class="text-[#1D1D1D] font-size-[160px] font-bold dark:text-[#F5F5F5] row-height"
            uno-lg="font-size-[240px]"
          >
            {{ props.error?.statusCode }}
          </div>

          <div class="flex-center-col gap-[16px]">
            <template v-if="props.error?.statusCode === 404">
              <div class="font-semibold text-[32px] color-[#333] dark:color-[#F2F2F2] row-height">
                It looks you are lost !
              </div>
              <div class="font-thin text-[20px] color-[#333] dark:color-[#F2F2F2] row-height">
                The page you are looking for on longer exists or has been moved.
              </div>
            </template>
            <template v-else>
              {{ props.error?.message || '未知错误，请稍后再试或联系管理员' }}
            </template>
          </div>

          <div class="operation cursor-pointer bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[36px] shadow-lg shadow-[rgba(57,113,243,0.3)] row-height">
            <div class="font-size-[16px] font-bold text-white px-[40px] py-[8px]" @click="jumpTo">
              {{ HINT_TEXT }}
            </div>
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
