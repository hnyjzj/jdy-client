<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  workBenchList: WorkBench[]
}>(), {})

// 双向绑定选中的功能 ID 列表
const funSelectIds = defineModel<WorkBench['id'][]>({ default: () => [] })

// 存储每个工作台的“多选开关”状态，索引与 workBenchList 对应
const switchStates = ref<boolean[]>([])

/**
 * 多选开关切换时触发
 * @param val 开关状态
 * @param id 当前工作台的 ID
 */
function handleSwitchChange(val: boolean, id: Apis['id']) {
  const bench = props.workBenchList.find(bench => bench.id === id)?.children
  const arr = bench?.flatMap(group => group.children)

  if (!arr || !arr.length)
    return

  if (val) {
    // 多选：合并功能 ID，并去重
    arr.forEach(item => item?.id && funSelectIds.value.push(item.id))
    funSelectIds.value = [...new Set(funSelectIds.value)]
  }
  else {
    // 全不选：移除当前工作台的功能 ID
    const idArr = arr.map(item => item?.id)
    funSelectIds.value = funSelectIds.value.filter(id => !idArr.includes(id))
  }
}

/**
 * 根据当前 funSelectIds 判断每个工作台是否全选，更新 switchStates
 */
function updateSwitchStates() {
  switchStates.value = props.workBenchList.map((bench) => {
    const allIds = bench.children?.flatMap(group =>
      (group.children ?? [])
        .map(item => item.id)
        .filter((id): id is string => !!id),
    ) ?? []

    return allIds.length > 0 && allIds.every(id => funSelectIds.value.includes(id))
  })
}

onMounted(() => {
  updateSwitchStates()
})

// 每当选中项变化时，同步按钮状态
watch(funSelectIds, () => {
  updateSwitchStates()
}, { deep: true })
</script>

<template>
  <template v-for="(bench, aindex) in props.workBenchList" :key="aindex">
    <div class="mb-2">
      <common-gradient :title="bench.title" :foldable="true" :is-folds="true">
        <template #body>
          <div>
            <div class="flex justify-end">
              <div class="mb-2">
                多选
                <n-switch v-model:value="switchStates[aindex]" size="medium" @update:value="(val) => handleSwitchChange(val, bench.id)" />
              </div>
            </div>
            <template v-for="(children, i) in bench.children" :key="i">
              <div class="text-[14px] mb-2">
                {{ children.title }}
              </div>
              <n-checkbox-group v-model:value="funSelectIds">
                <div class="flex gap-2 flex-wrap">
                  <template v-for="(son, j) in children.children" :key="j">
                    <div class="flex mb-2">
                      <n-checkbox
                        :value="son.id"
                        :label="son.title"
                        :style="{
                          '--n-color-checked': '#0068ff',
                          '--n-border-color-active': '#000',
                          '--n-check-mark-color': 'white', // 可选：✔ 图标颜色
                        }"
                      />
                    </div>
                  </template>
                </div>
              </n-checkbox-group>
            </template>
          </div>
        </template>
      </common-gradient>
    </div>
  </template>
</template>
