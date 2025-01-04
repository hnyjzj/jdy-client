<script setup lang="ts">
const themeOverrides = {
  Drawer: {
    BackgroundColor: 'transparent',
  },
}
</script>

<template>
  <div>
    <n-config-provider :theme-overrides="themeOverrides">
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
