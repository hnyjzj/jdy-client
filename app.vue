<script setup lang="ts">
import { darkTheme, dateZhCN, type GlobalThemeOverrides, zhCN } from 'naive-ui'

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
    borderRadius: '60px',
    boxShadowFocus: '0 0 0 2px rgba(0, 104, 255, 0.2)',
  },
  InternalSelection: {
    borderHover: '1px solid #0068ff',
    borderFocus: '1px solid #0068ff',
    borderActive: '1px solid #0068ff',
    borderRadius: '60px',
  },
  DatePicker: {
    borderRadius: '20px',
  },
}
</script>

<template>
  <div>
    <n-config-provider
      :theme-overrides="themeOverrides"
      :theme="$colorMode.value === 'light' ? null : darkTheme"
      :locale="locale"
      :date-locale="dateLocale">
      <n-message-provider>
        <n-dialog-provider>
          <nuxt-layout>
            <common-layout-watermark>
              <nuxt-page />
            </common-layout-watermark>
          </nuxt-layout>
        </n-dialog-provider>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>
