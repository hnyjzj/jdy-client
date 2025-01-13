<script setup lang="ts">
import { darkTheme, dateZhCN, zhCN } from 'naive-ui'

const { $colorMode } = useNuxtApp()

const locale = zhCN

const dateLocale = dateZhCN

const themeOverrides = {
  Drawer: {
    BackgroundColor: 'transparent',
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
