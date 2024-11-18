import { createVNode, render } from 'vue'
import Dom from './Index.vue'

interface Props {
  /**
   * 文本内容
   */
  message: string
  /**
   * 提示主题
   * 'error' | 'warning' | 'success' | 'primary'
   */
  theme?: types
  /**
   * 显示时长
   */
  duration?: number
  /**
   * icon
   */
  icon?: string
  /**
   * 网格列开始
   */
  colStart?: number
  /**
   * 网格列跨度
   */
  colSpan?: number
  /**
   * 距顶部距离
   * @param {number} top - 元素的垂直位置，单位为百分比（%）
   */
  top?: number
}

type types =
  | 'error'
  | 'warning'
  | 'success'
  | 'primary'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: (props: Props) => {
        const toastNode = document.createElement('div')
        const vm = createVNode(Dom, { ...props })
        render(vm, toastNode)
        document.body.appendChild(toastNode)
        setTimeout(() => {
          document.body.removeChild(toastNode)
        }, props.duration || 2000)
      },
    },
  }
})
