<script lang="ts" setup>
const props = withDefaults(defineProps<{
  oldAccessories: ProductAccessories
  newAccessories: ProductAccessories
  filterList: FilterWhere<AccessorieCategory>[]
}>(), {
})
</script>

<template>
  <div>
    <template v-for="(item, index) in filterList" :key="index">
      <template v-if="item.create">
        <div class="info-row">
          <div class="info-title">
            {{ item.label }}
          </div>
          <div class="text-color-light">
            <template v-if="item.input === 'select'">
              <div class="info-val">
                {{ item.preset[props.newAccessories?.category[item.name] as number] }}
              </div>
            </template>
            <template v-else>
              <div class="info-val">
                {{ props.newAccessories?.category[item.name] }}
              </div>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.key {
  --uno: 'text-size-[14px] color-[#666] dark:color-[#CBCDD1] mr-2';
}
.value {
  --uno: 'text-size-[14px] color-[#333] dark:color-[#fff] w-[60%]';
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.info-row {
  --uno: 'flex justify-between mb-2';
  .info-title {
    --uno: 'text-color';
  }
  .info-val {
    --uno: 'w-200px text-right text-color-light';
  }
}
</style>
