<script setup lang="ts">
import { darkTheme } from 'naive-ui'

const { $colorMode } = useNuxtApp()

const themeOverrides = {
  Drawer: {
    BackgroundColor: 'transparent',
  },
}
</script>

<template>
  <div>
    <n-config-provider :theme-overrides="themeOverrides" :theme="$colorMode.value === 'light' ? null : darkTheme">
      <n-message-provider>
        <nuxt-layout>
          <common-layout-watermark>
            <nuxt-page />
          </common-layout-watermark>
        </nuxt-layout>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>
