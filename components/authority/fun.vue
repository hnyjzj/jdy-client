<script lang="ts" setup>
const props = withDefaults(defineProps<{
  workBenchList: WorkBench[]
}>(), {
})

const funSelectIds = defineModel<WorkBench['id'][]>({ default: () => [] })

const switchStates = ref([])

/** 全选和全不选 */
function handleSwitchChange(val: boolean, id: Apis['id']) {
  const bench = props.workBenchList.find(bench => bench.id === id)?.children
  const arr = bench?.flatMap(group => group.children)

  if (!arr || !arr.length)
    return
  if (val) {
    arr.forEach((item) => {
      item?.id && funSelectIds.value.push(item.id)
    })
    funSelectIds.value = [...new Set(funSelectIds.value)]
  }
  else {
    const idArr = arr.map(item => item?.id)
    funSelectIds.value = funSelectIds.value.filter(item => !idArr.includes(item))
  }
}
</script>

<template>
  <template v-for="(bench, aindex) in props.workBenchList" :key="aindex">
    <div class="mb-2">
      <common-gradient :title="bench.title" :foldable="true" :is-folds="true">
        <template #body>
          <div>
            <div class="mb-2">
              多选
              <n-switch v-model:value="switchStates[aindex]" size="medium" @update:value="(val) => handleSwitchChange(val, bench.id)" />
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
