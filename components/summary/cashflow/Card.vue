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
const { overview } = storeToRefs(useCashflow())
const toggleChart = ref<'list' | 'chart'>('list')
</script>

<template>
  <div>
    <summary-table v-model="toggleChart" :is-toggle="false" :loading="props.loading" :title="props.title" :list="props.list" @click-title="emits('clickTitle')">
      <template #header-title>
        {{ props.cardTitle }}
      </template>
      <template #select>
        <div class="p-[16px] pt-0">
          <div class="grid-12">
            <template v-for="(item, key) in overview" :key="item">
              <div class="col-4 ">
                <div class="flex-start">
                  <div class="w-[4px] h-[10px] bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] rounded-[2px]" />
                  <div class="color-[#333] dark:color-[#fff] ml-[4px] text-[12px]  line-height-[24px]">
                    {{ key }}
                  </div>
                </div>
                <div class="color-[#3971F3] dark:color-[#fff] font-semibold  line-height-[24px]">
                  <span class="text-[16px]">{{ item }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </summary-table>
  </div>
</template>

<style lang="scss" scoped>

</style>
