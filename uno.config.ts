import { UnocssLoader } from '@waset/unplugin-iconify/loader'
import { defineConfig, presetAttributify, presetIcons, presetMini, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetMini({
      dark: 'class',
    }),
    presetAttributify({
      prefix: 'uno-',
      prefixedOnly: true,
    }),
    presetIcons({
      collections: {
        ...UnocssLoader(),
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  content: {
    pipeline: {
      include: ['**/*.{vue,ts}'],
    },
  },
  preflights: [{
    getCSS: () => `
        *,
        ::before,
        ::after {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
        }
    `,
  }],
  rules: [
    // 自定义规则
    [/^wh-\[(\d+(?:px|em|rem|%)?)\]$/, ([, size]) => ({
      width: size,
      height: size,
    })],
    [/^bg-gradient-linear-\[(\d{1,3}deg),\s*([^,\s]+(?:\s*,\s*[^,\s]+)*)\]$/, ([, angle, colors]) => ({
      background: `linear-gradient(${angle}, ${colors.split(/\s*,\s*/).join(', ')})`,
    })],
    [/^(col)-(\d+)$/, ([, _, num]) => {
      return {
        'grid-column': `span ${num} / span ${num}`,
      }
    }],
    [/^(offset)-(\d+)$/, ([, _, num]) => {
      return {
        'grid-column-start': Number(num) + 1,
      }
    }],
    [/^blur-(\d+(?:\.\d+)?)(px)$/, ([, value]) => ({
      'backdrop-filter': `blur(${value}px)`,
    })],
  ],
  shortcuts: {
    'flex-start': 'flex items-center justify-start',
    'flex-end': 'flex items-center justify-end',
    'flex-between': 'flex items-center justify-between',
    'flex-around': 'flex items-center justify-around',
    'flex-evenly': 'flex items-center justify-evenly',
    'flex-center-col': 'flex flex-col items-center justify-center',
    'flex-center-row': 'flex flex-row items-center justify-center',
    'flex-center-between': 'flex flex-row items-center justify-between',
    'flex-col-between': 'flex flex-col justify-between',
    'grid-12': 'grid grid-cols-12',
    'blur-bgc': 'light:bg-[#FFF] dark:bg-[#1D2C60]', // 毛玻璃背景色
    'blur-bga': 'light:bg-#FFF dark:bg-[#1D2C60]',
    'text-color': 'text-[rgb(0,0,0)] dark:text-[rgb(255,255,255)]',
    'text-color-light': 'text-[#666666] dark:text-[#CBCDD1]',
    /** 单行超出隐藏 */
    'text-row-hide': 'whitespace-nowrap overflow-hidden text-ellipsis',
  },
})
