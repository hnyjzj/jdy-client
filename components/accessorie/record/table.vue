<script lang="ts" setup>
const props = withDefaults(defineProps<{
  oldAccessories: ProductAccessories
  newAccessories: ProductAccessories
  filterList: FilterWhere<AccessorieCategory>[]
}>(), {
})

type ProductKey = keyof AccessorieCategory
/** 字段是否更新 */
function isUpdate(key: ProductKey) {
  if (!props.newAccessories?.category || !props.oldAccessories?.category)
    return false

  try {
    return JSON.stringify(props.oldAccessories.category[key]) !== JSON.stringify(props.newAccessories.category[key])
  }
  catch {
    return false
  }
}
</script>

<template>
  <div>
    <template v-if="props.newAccessories && props.oldAccessories">
      <div class="info-row">
        <div class="info-title">
          库存（后/前）
        </div>
        <div class="info-val" :style="props.oldAccessories?.stock !== props.newAccessories?.stock ? 'color: #FF4D4F' : ''">
          {{ props.newAccessories.stock }}/{{ props.oldAccessories.stock }}
        </div>
      </div>
      <div class="info-row">
        <div class="info-title">
          变换数量
        </div>
        <div class="info-val">
          {{ props.oldAccessories.stock && props.newAccessories.stock ? props.newAccessories.stock - props.oldAccessories.stock : '' }}
        </div>
      </div>
      <div class="info-row">
        <div class="info-title">
          所属门店
        </div>
        <div class="info-val" :style="props.oldAccessories?.store?.name !== props.newAccessories?.store?.name ? 'color: #FF4D4F' : ''">
          {{ props.newAccessories?.store?.name }}
        </div>
      </div>
    </template>
    <template v-if="props.newAccessories">
      <template v-for="(item, index) in filterList" :key="index">
        <template v-if="item.create">
          <div class="info-row">
            <div class="info-title">
              {{ item.label }}
            </div>
            <div class="text-color-light" :style="isUpdate(item.name) ? 'color: #FF6B6C' : ''">
              <template v-if="item.input === 'select'">
                <div class="info-val">
                  {{ item.preset[props.newAccessories.category[item.name] as number] }}
                </div>
              </template>
              <template v-else>
                <div class="info-val">
                  {{ props.newAccessories.category[item.name] }}
                </div>
              </template>
            </div>
          </div>
        </template>
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
