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
  clickTitle: []
}>()
const toggleChart = ref<'list' | 'chart'>('list')
</script>

<template>
  <div>
    <summary-table v-model="toggleChart" :is-toggle="false" :loading="props.loading" :title="props.title" :list="props.list" @click-title="emits('clickTitle')">
      <template #header-title>
        {{ props.cardTitle }}
      </template>
      <template #select />
    </summary-table>
  </div>
</template>

<style lang="scss" scoped>

</style>
