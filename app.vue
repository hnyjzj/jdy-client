<script setup lang="ts">
import { darkTheme, dateZhCN, type GlobalThemeOverrides, zhCN } from 'naive-ui'

const { wx } = storeToRefs(useWxworkStore())
const { useWxWork } = useWxworkStore()
const { isLoading } = storeToRefs(useLoading())
const { followSystem } = storeToRefs(useThemeStore())
const colorMode = useColorMode()
const isDark = usePreferredDark()

const locale = zhCN
const dateLocale = dateZhCN
const themeOverrides: GlobalThemeOverrides = {
  Drawer: {
    BackgroundColor: 'transparent',
  },
  Input: {
    color: '#F1F5FE',
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
  Select: {
    peers: {
      InternalSelectMenu: {
        optionTextColorActive: '#3971F3',
        optionCheckColor: '#3971F3',
        color: '#fff',
      },
      InternalSelection: {
        color: '#F1F5FE',
      },
    },

  },
  Checkbox: {
    colorChecked: '#3971F3',
    colorCheckedHover: '#3971F3',
    colorCheckedPressed: '#2f5fd0',
    border: '1px solid #3971F3',
    borderChecked: '1px solid #3971F3',
  },
  Tabs: {
    tabBorderRadius: '26px', // 标签圆角
    colorSegment: '#E6EDF5', // 标签背景颜色
    tabTextColorActiveSegment: '#fff', // 激活标签颜色
    tabTextColorHoverSegment: '#000', // 悬停标签颜色
    tabColorSegment: '#3F8CFF', // 激活标签颜色
    tabTextColorActiveBar: '#fff', // 激活标签颜色
    tabTextColorActiveCard: '#fff', // 悬停标签颜色
  },
  Table: {
    position: 'relative',
    zIndex: 0,
  },
  DataTable: {
    position: 'relative',
    zIndex: 0,
  },
  // 表格下页码控件颜色设置
  Pagination: {
    itemBorderColorActive: '#0068ff',
    itemBorderColorActiveHover: '#0068ff',
    itemBorderColor: '#0068ff',
    itemBorderActive: '#0068ff',
    itemTextColorActive: '#0068ff',
  },
  Radio: {
    buttonColorActive: '#0068ff',
    buttonColorHover: '#0068ff',
    buttonColorFocus: '#0068ff',
    boxShadowHover: 'inset 0 0 0 1px #0068ff',
    boxShadowActive: 'inset 0 0 0 1px #0068ff',
    boxShadowFocus:
      'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)',
    dotColorActive: '#0068ff',
  },
}
const darkThemeOverrides: GlobalThemeOverrides = {
  Drawer: {
    BackgroundColor: 'transparent',
  },
  Dropdown: {
    // 下拉菜单背景色
    color: '#0F1E52',
    // 选项文字颜色
    optionTextColor: '#D8DAE3',
    optionTextColorHover: '#D8DAE3',
    // 选项背景色
    optionColor: '#253262',
    optionColorActive: '#253262',
    optionColorHover: '#253262',
  },
  Input: {
    color: '#2C4186',
    caretColor: '#0068ff',
    borderHover: '1px solid #0068ff',
    borderFocus: '1px solid #0068ff',
    borderRadius: '20px',
    boxShadowFocus: '0 0 0 2px rgba(0, 104, 255, 0.2)',
    boxShadowActive: '0 0 0 2px rgba(0, 104, 255, 0.2)',
    // colorDisabled: '#0068ff',
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
  Select: {
    peers: {
      InternalSelectMenu: {
        optionTextColorActive: '#3971F3',
        optionCheckColor: '#3971F3',
        color: '#0F1E52',
      },
      InternalSelection: {
        color: '#2C4186',
      },
    },
  },
  Checkbox: {
    colorChecked: '#3971F3',
    colorCheckedHover: '#3971F3',
    colorCheckedPressed: '#2f5fd0',
    border: '1px solid #3971F3',
    borderChecked: '1px solid #3971F3',
  },
  Tabs: {
    tabBorderRadius: '26px', // 标签圆角
    colorSegment: '#1D2C60', // 标签背景颜色
    tabTextColorActiveSegment: '#fff', // 激活标签颜色
    tabTextColorHoverSegment: '#fff', // 悬停标签颜色
    tabColorSegment: '#3F8CFF', // 激活标签颜色
    tabTextColorActiveBar: '#fff', // 激活标签颜色
    tabTextColorHoverCard: '#fff', // 悬停标签颜色
  },
  Table: {
    position: 'relative',
    zIndex: 0,
  },
  DataTable: {
    position: 'relative',
    zIndex: 0,
  },
  // 表格下页码控件颜色设置
  Pagination: {
    itemBorderColorActive: '#0068ff',
    itemBorderColorActiveHover: '#0068ff',
    itemBorderColor: '#0068ff',
    itemBorderActive: '#0068ff',
    itemTextColorActive: '#0068ff',
  },
  Radio: {
    buttonColorActive: '#0068ff',
    buttonColorHover: '#0068ff',
    buttonColorFocus: '#0068ff',
    boxShadowHover: 'inset 0 0 0 1px #0068ff',
    boxShadowActive: 'inset 0 0 0 1px #0068ff',
    boxShadowFocus:
      'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)',
    dotColorActive: '#0068ff',
  },
}

watchEffect(() => {
  // 监听颜色模式变化
  colorMode.preference = isDark.value ? 'dark' : 'light'
})
onMounted(async () => {
  await nextTick()
  if (wx?.value) {
    await useWxWork()
  }
  if (!wx.value?.UserCaptureScreen) {
    return
  }
  wx.value?.UserCaptureScreen(async () => {
    const params = ref<{ username: string, storename?: string | undefined, url: string, title: string }>({
      username: '',
      storename: '',
      url: '',
      title: '',
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
    params.value.title = document?.title || '其他'
    await UserScreen(params.value)
  })
  if (followSystem.value) {
    colorMode.preference = /ColorScheme\/Dark/i.test(navigator?.userAgent) ? 'dark' : 'light'
  }
})
const theme = computed(() => colorMode.value === 'light' ? themeOverrides : darkThemeOverrides)
</script>

<template>
  <div>
    <common-loading v-model="isLoading" />
    <n-config-provider
      :theme-overrides="theme"
      :theme="colorMode.value === 'light' ? null : darkTheme"
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
