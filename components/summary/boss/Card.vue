<script lang="ts" setup>
const props = defineProps<{
  title: any[]
  list?: BossSalesList[]
  cardTitle: string
  where?: Where<BossWhere>
  loading: boolean
}>()
const emits = defineEmits<{
  getlist: []
}>()

const radio = defineModel<BossWhere['type']>({ default: 1 })
const toggleChart = ref<'list' | 'chart'>('list')
</script>

<template>
  <div>
    <summary-table v-model="toggleChart" :loading="props.loading" :title="props.title" :list="props.list">
      <template #header-title>
        {{ props.cardTitle }}
      </template>
      <template #select>
        <template v-if="props.where">
          <div class="p-[12px] pt-0">
            <n-radio-group
              v-model:value="radio" name="radiogroup" @update:value="emits('getlist')">
              <n-radio
                v-for="(item, index) in props.where?.type?.preset" :key="item" :value="Number(index)" :style="{
                  '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                  '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                  '--n-dot-color-active': '#0068ff',
                  '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
                {{ item }}
              </n-radio>
            </n-radio-group>
          </div>
        </template>
      </template>
    </summary-table>
  </div>
</template>

<style lang="scss" scoped>

</style>
