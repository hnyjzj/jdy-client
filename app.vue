<script setup lang="ts">
import { darkTheme, dateZhCN, type GlobalThemeOverrides, zhCN } from 'naive-ui'

const { wx } = storeToRefs(useWxworkStore())
const { useWxWork } = useWxworkStore()
const { isLoading } = storeToRefs(useLoading())

onMounted(async () => {
  await nextTick()
  if (wx?.value) {
    await useWxWork()
  }
  if (!wx.value?.UserCaptureScreen) {
    return
  }
  wx.value?.UserCaptureScreen(async () => {
    const params = ref<{ username: string, storename?: string | undefined, url: string }>({
      username: '',
      storename: '',
      url: '',
    })
    // 判断是否登录
    const store = useAuth()
    if (Date.now() > (store.expires_at) * 1000) {
      return false
    }
    const { userinfo } = storeToRefs(useUser())
    const { UserScreen } = useUser()
    params.value.username = userinfo.value.nickname
    // 判断是否有门店
    const stores = useStores()
    if (stores.myStore.name) {
      params.value.storename = stores.myStore.name
    }
    else {
      params.value.storename = undefined
    }
    params.value.url = window.location.href
    await UserScreen(params.value)
  })
})

const { $colorMode } = useNuxtApp()
const locale = zhCN
const dateLocale = dateZhCN
const themeOverrides: GlobalThemeOverrides = {
  Drawer: {
    BackgroundColor: 'transparent',
  },
  Input: {
    caretColor: '#0068ff',
    borderHover: '1px solid #0068ff',
    borderFocus: '1px solid #0068ff',
    borderRadius: '20px',
    boxShadowFocus: '0 0 0 2px rgba(0, 104, 255, 0.2)',
    boxShadowActive: '0 0 0 2px rgba(0, 104, 255, 0.2)',
  },
  InternalSelection: {
    borderHover: '1px solid #0068ff',
    borderFocus: '1px solid #0068ff',
    borderActive: '1px solid #0068ff',
    borderRadius: '60px',
    boxShadowFocus: '0 0 0 2px rgba(0, 104, 255, 0.2)',
    boxShadowActive: '0 0 0 2px rgba(0, 104, 255, 0.2)',
  },
  DatePicker: {
    borderRadius: '20px',
  },
  Switch: {
    railColorActive: '#0068ff',
    borderColor: '#0068ff',
    caretColor: '#0068ff',
    borderHover: '1px solid #0068ff',
    borderFocus: '1px solid #0068ff',
    boxShadowFocus: '#0068ff',
    railHeightLarge: '36px',
    railWidthLarge: '60px',
  },
  Checkbox: {
    colorChecked: '#3971F3',
    colorCheckedHover: '#3971F3',
    colorCheckedPressed: '#2f5fd0',
    border: '1px solid #3971F3',
    borderChecked: '1px solid #3971F3',
  },
  Tabs: {
    tabTextColorActiveLine: '#0068ff', // 激活标签颜色
    barColor: '#0068ff', // 激活标签条颜色
    tabTextColorHoverLine: '#0068ff', // 悬停标签颜色
  },
}
</script>

<template>
  <div>
    <common-loading v-model="isLoading" />
    <n-config-provider
      :theme-overrides="themeOverrides"
      :theme="$colorMode.value === 'light' ? null : darkTheme"
      :locale="locale"
      :date-locale="dateLocale">
      <n-message-provider>
        <n-dialog-provider>
          <nuxt-layout>
            <common-layout-watermark>
              <nuxt-page :keepalive="{ max: 1 }" />
            </common-layout-watermark>
          </nuxt-layout>
        </n-dialog-provider>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>
