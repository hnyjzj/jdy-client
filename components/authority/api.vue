<script lang="ts" setup>
const props = withDefaults(defineProps<{
  apiList: Apis[]
}>(), {
})

const apiSelectIds = defineModel<Apis['id'][]>({ default: () => [] })

const switchStates = ref([])

/** 全选和全不选 */
function handleSwitchChange(val: boolean, id: Apis['id']) {
  const arr = props.apiList.find(item => item.id === id)?.children
  if (!arr || !arr.length)
    return
  if (val) {
    arr?.forEach((item) => {
      apiSelectIds.value.push(item.id)
    })
  }
  else {
    const idArr = arr.map(item => item.id)
    apiSelectIds.value = apiSelectIds.value.filter(item => !idArr.includes(item))
  }
}
</script>

<template>
  <div>
    <template v-for="(api, aindex) in props.apiList" :key="aindex">
      <div class="mb-2">
        <common-gradient :title="api.title || api.path" :foldable="true" :is-folds="true">
          <template #body>
            <div>
              <div class="mb-2 flex">
                <div class="mr-2">
                  多选
                </div>
                <n-switch v-model:value="switchStates[aindex]" size="medium" @update:value="(val) => handleSwitchChange(val, api.id)" />
              </div>
              <n-checkbox-group v-model:value="apiSelectIds">
                <div class="flex gap-2 flex-wrap">
                  <template v-for="(son, j) in api.children" :key="j">
                    <div class="flex mb-2">
                      <n-checkbox
                        :value="son.id"
                        :label="son.title || son.path"
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
            </div>
          </template>
        </common-gradient>
      </div>
    </template>
  </div>
</template>
