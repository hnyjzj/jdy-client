import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: false,
  compatibilityDate: '2024-11-06',
  nitro: {
    replace: {
      // replace the browser detection in a server lib
      'globalThis.navigator': 'undefined',
      'global.navigator': 'undefined',
    },
  },
  devtools: {
    enabled: true,
  },
  devServer: {
    port: 80,
  },
  typescript: {
    typeCheck: true,
  },
  ssr: true,
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    '@unocss/nuxt',
    '@vant/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
    '@bg-dev/nuxt-naiveui',
    'nuxt-echarts',
  ],
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    },
  },
  css: ['~/assets/css/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'cookie', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode',
  },
  echarts: {
    charts: ['BarChart', 'LineChart', 'PieChart'],
    components: ['DatasetComponent', 'GridComponent', 'TooltipComponent', 'LegendComponent'],
  },
  naiveui: {
    spaLoadingTemplate: {
      name: 'bar-scale',
    },
  },
})
