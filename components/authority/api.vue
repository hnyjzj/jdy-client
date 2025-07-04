<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  apiList: Apis[]
}>(), {})

// 选中的叶子节点 id
const apiSelectIds = defineModel<Apis['id'][]>({ default: () => [] })

// 每个 api（第一层）对应的全选开关状态
const switchStates = ref<boolean[]>([])

/**
 * 获取某个 api 下所有叶子节点（真正可选接口）的 id
 */
function getLeafIds(api: Apis) {
  const sections = api.children ?? []
  return sections.flatMap(section => (section.children ?? []).map(c => c.id))
}

/**
 * 顶部开关：全选 / 全不选
 */
function handleSwitchChange(val: boolean, id: Apis['id']) {
  const api = props.apiList.find(item => item.id === id)
  if (!api)
    return

  const leafIds = getLeafIds(api)
  if (!leafIds.length)
    return

  if (val) {
    // 全选：把该 api 下的所有叶子 id 加入选中列表（避免重复）
    leafIds.forEach((lid) => {
      if (!apiSelectIds.value.includes(lid))
        apiSelectIds.value.push(lid)
    })
  }
  else {
    // 全不选：从选中列表中剔除这些 id
    apiSelectIds.value = apiSelectIds.value.filter(current => !leafIds.includes(current))
  }
}

/**
 * 根据 apiSelectIds 同步每个开关的显示状态
 */
function updateSwitchStates() {
  switchStates.value = props.apiList.map((api) => {
    const leafIds = getLeafIds(api)
    if (!leafIds.length)
      return false
    return leafIds.every(id => apiSelectIds.value.includes(id))
  })
}

watch(apiSelectIds, updateSwitchStates, { deep: true })

onMounted(updateSwitchStates)
</script>

<template>
  <div>
    <!-- 第一层：api 模块 -->
    <template v-for="(api, aindex) in props.apiList" :key="api.id">
      <div class="mb-2">
        <common-gradient
          :title="api.title || api.path"
          foldable
          :is-folds="true"
        >
          <template #body>
            <!-- 顶部全选开关 -->
            <div class="mb-2 flex justify-end items-center">
              <span class="mr-2">全选</span>
              <n-switch
                v-model:value="switchStates[aindex]"
                size="medium"
                @update:value="val => handleSwitchChange(val, api.id)"
              />
            </div>

            <!-- 第二层：section 分类 -->
            <template v-for="section in api.children" :key="section.id">
              <div class="py-2 font-medium text-[16px]">
                {{ section.title || section.path }}
              </div>

              <!-- 第三层：真正的接口叶子节点 -->
              <n-checkbox-group v-model:value="apiSelectIds">
                <div class="flex gap-2 flex-wrap mb-4">
                  <template v-for="leaf in section.children" :key="leaf.id">
                    <n-checkbox
                      :value="leaf.id"
                      :label="leaf.title || leaf.path"
                      class="mb-2"
                      :style="{
                        '--n-color-checked': '#0068ff',
                        '--n-border-color-active': '#000',
                        '--n-check-mark-color': 'white',
                      }"
                    />
                  </template>
                </div>
              </n-checkbox-group>
            </template>
          </template>
        </common-gradient>
      </div>
    </template>
  </div>
</template>
