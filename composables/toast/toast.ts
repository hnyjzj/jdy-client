import type { Toasts } from './type'
import { createVNode, render } from 'vue'
import Template from './template.vue'

export class Toast {
  ROOTDOM_ID = '__toast__'

  private rootDom = document.getElementById(this.ROOTDOM_ID)

  constructor() {
    this.createRootDom()
  }

  show(options: Toasts) {
    const toast = this.addNode(options)

    setTimeout(() => {
      toast.remove()
    }, options.duration || 3000)
  }

  private addNode(props: Toasts) {
    const toast = document.createElement('div')
    toast.style.flex = '1 1 auto'
    const vm = createVNode(Template, { instance: props })
    render(vm, toast)
    this.rootDom?.appendChild(toast)
    return toast
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
    const style = {
      position: 'fixed',
      zIndex: '9999',
      top: '20px',
      left: '0',
      right: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none',
      userSelect: 'none',
      transition: 'opacity 0.3s ease-in-out',
    } as CSSStyleValue

    if (!this.rootDom) {
      this.rootDom = document.createElement('div')
      this.rootDom.id = this.ROOTDOM_ID
      Object.assign(this.rootDom.style, style)
      document.body.appendChild(this.rootDom)
    }
  }
}
