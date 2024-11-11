import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-06',
  devtools: {
    enabled: true,
  },
  devServer: {
    port: 80,
  },
  ssr: true,
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    '@unocss/nuxt',
    '@vant/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/image',
    '@waset/unplugin-iconify/nuxt',
    '@nuxtjs/color-mode',
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
  nitro: {
    devProxy: {
      '/proxy': {
        // 代理目标的基础路径
        target: import.meta.env.VITE_BASE_URL,
        changeOrigin: true,
        prependPath: true,
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
  image: {
    inject: true,
  },
  Iconify: {
    convert: {
      svg: 'assets/icons',
      icon: {
        path: 'assets/icons',
        noColor: true,
      },
    },
    iconifyIntelliSense: true,
  },
  echarts: {
    charts: ['BarChart', 'LineChart', 'PieChart'],
    components: ['DatasetComponent', 'GridComponent', 'TooltipComponent', 'LegendComponent'],
  },
})
