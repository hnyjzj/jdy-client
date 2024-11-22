import { createVNode, render } from 'vue'
import Dom from './Index.vue'

const instances: ToastOptions[] = shallowReactive([])

const MAX_INSTANCES = 1

let seed = 0
const createUid = () => {
  return `toast-${seed++}`
}

const deleteInstance = (id: string | undefined): number => {
  const idx = instances.findIndex(instance => instance.id === id)
  if (idx !== -1) {
    instances.splice(idx, 1)
  }
  return idx
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: (props: Toast) => {
        const toastNode = document.createElement('div')

        // 限制最大实例数
        if (instances.length >= MAX_INSTANCES) {
          const firstId = instances[0].id
          const oldNode = document.querySelector(`[data-toast-id="${firstId}"]`)
          if (oldNode && oldNode.parentNode) {
            oldNode.parentNode.removeChild(oldNode)
          }
          instances.shift()
        }

        const tId = createUid()
        toastNode.setAttribute('data-toast-id', tId)

        instances.push({ ...props, id: tId })

        const vm = createVNode(Dom, { instances })
        render(vm, toastNode)
        document.body.appendChild(toastNode)

        setTimeout(() => {
          deleteInstance(tId)
          // 若节点存在
          if (toastNode.parentNode) {
            toastNode.parentNode.removeChild(toastNode)
          }
        }, props.duration || 3000)
      },
    },
  }
})
