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
              <nuxt-page :keepalive="{ max: 1 }" />
            </common-layout-watermark>
          </nuxt-layout>
        </n-dialog-provider>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>
