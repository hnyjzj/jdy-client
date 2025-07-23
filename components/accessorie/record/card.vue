<script lang="ts" setup>
const props = withDefaults(defineProps<{
  accessories: ProductAccessories
  filterList: FilterWhere<AccessorieCategory>[]
}>(), {
})
</script>

<template>
  <div>
    <div class="flex-between">
      <div>
        库存
      </div>
      <div class="text-align-end">
        {{ props.accessories.stock }}
      </div>
    </div>
    <div class="flex-between">
      <div>
        所属门店
      </div>
      <div class="text-align-end">
        {{ props.accessories?.store?.name }}
      </div>
    </div>
    <template v-for="(item, index) in filterList" :key="index">
      <template v-if="item.create">
        <div class="flex-between">
          <div>
            {{ item.label }}
          </div>
          <template v-if="item.input === 'select'">
            <div class="text-align-end">
              {{ item.preset[props.accessories.category[item.name] as number] }}
            </div>
          </template>
          <template v-else>
            <div class="text-align-end">
              {{ props.accessories.category[item.name] }}
            </div>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>
