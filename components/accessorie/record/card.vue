<script lang="ts" setup>
const props = withDefaults(defineProps<{
  accessories: ProductAccessoriesInfo
  filterList: FilterWhere<ProductAccessories>[]
}>(), {
})
</script>

<template>
  <div>
    <template v-for="(item, index) in filterList" :key="index">
      <template v-if="item.info">
        <div class="flex-between">
          <div>
            {{ item.label }}
          </div>
          <template v-if="item.name === 'store'">
            <div>
              {{ props.accessories?.store.name }}
            </div>
          </template>
          <template v-else-if="item.name === 'name'">
            <template v-if="props.accessories?.category">
              <div>
                {{ props.accessories?.category.name }}
              </div>
            </template>
            <template v-else>
              <div>
                {{ props.accessories?.name }}
              </div>
            </template>
          </template>
          <template v-else-if="item.type === 'date'">
            <div v-if="props.accessories[item.name]">
              {{ formatTimestampToDateTime(props.accessories[item.name] as string) || '' }}
            </div>
          </template>
          <template v-else>
            <template v-if="item.input === 'select'">
              <div class="text-align-end">
                {{ item.preset[props.accessories[item.name] as number] }}
              </div>
            </template>
            <template v-else>
              <div class="text-align-end">
                {{ props.accessories[item.name] }}
              </div>
            </template>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>
