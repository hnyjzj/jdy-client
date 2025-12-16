<script lang="ts" setup>
import { NTree } from 'naive-ui'

interface ApiItem {
  id: string | number
  title?: string
  path?: string
  children?: ApiItem[]
}

const props = defineProps<{ list: ApiItem[] }>()

// 选中叶子节点（父组件双向绑定）
const selectedIds = defineModel<(string | number)[]>({
  default: () => [],
})

/* ---------- 递归生成树节点 ---------- */
function toTreeNodes(list: ApiItem[]): any[] {
  return list.map(item => ({
    key: item.id,
    label: item.title || item.path || '',
    children: item.children?.length ? toTreeNodes(item.children) : undefined,
  }))
}

/* ---------- 收集全部叶子节点 ---------- */
function collectLeaves(list: ApiItem[]) {
  const out: { label: string, value: string | number }[] = []
  const dfs = (nodes: ApiItem[]) => {
    nodes.forEach((n) => {
      if (n.children?.length)
        dfs(n.children)
      else out.push({ label: n.title || n.path || '', value: n.id })
    })
  }
  dfs(list)
  return out
}

const treeData = ref<any[]>([])
const options = ref<{ label: string, value: string | number }[]>([])

watch(
  () => props.list,
  (list) => {
    treeData.value = toTreeNodes(list)
    options.value = collectLeaves(list)
  },
  { immediate: true },
)

/* ---------- 自定义源列表，带级联 ---------- */
function renderSourceList({ onCheck, pattern }: any) {
  return h(NTree, {
    'checkable': true,
    'selectable': false,
    'blockLine': true,
    'checkOnClick': true,
    'cascade': true, // 父子节点联动
    'checkStrategy': 'child', // 只回传叶子
    'data': treeData.value,
    pattern,
    'checkedKeys': selectedIds.value,
    'onUpdate:checkedKeys': (keys: any) => onCheck(keys),
  })
}
</script>

<template>
  <div>
    <NTransfer
      v-model:value="selectedIds"
      size="large"
      :options="options"
      :render-source-list="renderSourceList"
      source-filterable
      :style="{
        height: '500px',
        overflow: 'auto',
      }"
    />
  </div>
</template>

<style scoped>
:deep(.n-input-wrapper) {
  height: 32px;
}
</style>
