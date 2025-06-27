<script lang="ts" setup>
const props = withDefaults(defineProps<{
  storesList: Stores[]
}>(), {
})

const storeSelectIds = defineModel<Stores['id'][]>({ default: () => [] })
</script>

<template>
  <div class="mb-2">
    <common-gradient title="选择门店">
      <template #body>
        <div>
          <n-checkbox-group v-model:value="storeSelectIds">
            <div class="flex gap-2 flex-wrap">
              <template v-for="(item, index) in props.storesList" :key="index">
                <div class="flex mb-2">
                  <n-checkbox
                    :value="item.id"
                    :label="item.name"
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
