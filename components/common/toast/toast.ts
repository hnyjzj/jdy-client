import type { Toast as ToastOptions } from './type'
import { createVNode, type CSSProperties, render } from 'vue'
import Template from './Index.vue'

export default class Toast {
  ROOTDOM_ID = '__toast__'

  private rootDom = document.getElementById(this.ROOTDOM_ID)

  constructor() {
    this.createRootDom()
  }

  show(options: ToastOptions) {
    const dom = this.createDom()
    this.createNode(dom, options)

    setTimeout(() => {
      dom.remove()
    }, options.duration || 3000)

    // 向前插入
    this.rootDom?.insertBefore(dom, this.rootDom.firstChild)
  }

  success = (message: string, duration?: number) => {
    this.show({ message, duration, type: 'success' })
  }

  error = (message: string, duration?: number) => {
    this.show({ message, duration, type: 'error' })
  }

  warning = (message: string, duration?: number) => {
    this.show({ message, duration, type: 'warning' })
  }

  primary = (message: string, duration?: number) => {
    this.show({ message, duration, type: 'primary' })
  }

  default = (message: string, duration?: number) => {
    this.show({ message, duration, type: 'primary' })
  }

  closeAll() {
    const toasts = this.rootDom?.querySelectorAll('div')
    if (toasts) {
      toasts.forEach((toast) => {
        toast.remove()
      })
    }
  }

  private createRootDom() {
    const style: CSSProperties = {
      position: 'fixed',
      zIndex: '9999',
      top: '8px',
      left: '0',
      right: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
      userSelect: 'none',
      maxHeight: '50vh',
      overflow: 'hidden',
    }

    if (!this.rootDom) {
      this.rootDom = document.createElement('div')
      this.rootDom.id = this.ROOTDOM_ID
      Object.assign(this.rootDom.style, style)

      document.body.appendChild(this.rootDom)
    }
  }

  private createDom() {
    const toast = document.createElement('div')
    const style: CSSProperties = {
      width: '100%',
      paddingLeft: '2vw',
      paddingRight: '2vw',
      marginBottom: '8px',
      transition: 'all 0.3s ease-in-out',
    }

    Object.assign(toast.style, style)

    return toast
  }

  private createNode(dom: HTMLElement, props: ToastOptions & any) {
    const vm = createVNode(Template, props)
    render(vm, dom)

    return vm
  }
}
