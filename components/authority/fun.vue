<script lang="ts" setup>
import { NTree } from 'naive-ui'

interface WorkBench {
  id: string | number
  title?: string
  children?: WorkBench[]
}

// 父组件传入工作台列表
const props = defineProps<{ workBenchList: WorkBench[] }>()

// 选中的叶子节点 ID
const funSelectIds = defineModel<(string | number)[]>({
  default: () => [],
})

// 递归转换为 NTree 需要的树节点格式
function toTreeNodes(list: WorkBench[]): any[] {
  return list.map(item => ({
    key: item.id,
    label: item.title || '',
    children: item.children?.length ? toTreeNodes(item.children) : undefined,
  }))
}

// 收集所有叶子节点，供 transfer options 使用
function collectLeaves(list: WorkBench[]) {
  const leaves: { label: string, value: string | number }[] = []
  function dfs(nodes: WorkBench[]) {
    nodes.forEach((node) => {
      if (node.children && node.children.length) {
        dfs(node.children)
      }
      else {
        leaves.push({ label: node.title || '', value: node.id })
      }
    })
  }
  dfs(list)
  return leaves
}

// 树数据和 options
const treeData = ref<any[]>([])
const options = ref<{ label: string, value: string | number }[]>([])

watch(() => props.workBenchList, (list) => {
  treeData.value = toTreeNodes(list)
  options.value = collectLeaves(list)
}, { immediate: true })

// 自定义穿梭框左边列表，使用树组件支持多层级父子联动勾选
function renderSourceList({ onCheck, pattern }: any) {
  return h(NTree, {
    'checkable': true,
    'selectable': false,
    'blockLine': true,
    'checkOnClick': true,
    'cascade': true, // 级联勾选父子联动
    'checkStrategy': 'child', // 只回传叶子节点 key
    'data': treeData.value,
    pattern,
    'checkedKeys': funSelectIds.value,
    'onUpdate:checkedKeys': (keys: any) => onCheck(keys),
  })
}
</script>

<template>
  <NTransfer
    v-model:value="funSelectIds"
    :options="options"
    :render-source-list="renderSourceList"
    source-filterable
  />
</template>
