<script setup lang="ts" generic="T extends Record<string, any>">
const props = defineProps<{
  filterList: Where<T>
  productList: T[]
  isFinished?: boolean
}>()
const emits = defineEmits<{
  edit: [code: T['code']]
  goInfo: [info: T]
  isFinished: false
}>()

const edit = (code: string) => {
  emits('edit', code as T['code'])
}

const jumpInfo = (info: T) => {
  emits('goInfo', info)
}
</script>

<template>
  <div>
    <product-manage-card :list="props.productList" @edit="edit">
      <template #info="{ info }">
        <div class="py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
          <div class="row">
            <div>
              条码
            </div>
            <div class="text-align-end val">
              {{ info.code }}
            </div>
          </div>
          <div class="row">
            <div>
              所属大类
            </div>
            <div class="text-align-end val">
              {{ filterList.class?.preset[info.class] || '' }}
            </div>
          </div>
          <div class="row">
            <div>
              货品名称
            </div>
            <div class="text-align-end val">
              {{ info.name }}
            </div>
          </div>
          <div class="row">
            <div>
              货品品牌
            </div>
            <div class="text-align-end val">
              {{ filterList.brand?.preset[info.brand] || '' }}
            </div>
          </div>
          <div class="row">
            <div>
              供应商
            </div>
            <div class="text-align-end val">
              {{ filterList.supplier?.preset[info.supplier] || '' }}
            </div>
          </div>
          <div class="row">
            <div>
              材质
            </div>
            <div class="text-align-end val">
              {{ filterList.material?.preset[info.material] || '' }}
            </div>
          </div>
          <div class="row">
            <div>
              成色
            </div>
            <div class="text-align-end val">
              {{ filterList.quality?.preset[info.quality] || '' }}
            </div>
          </div>
          <div class="row">
            <div>
              宝石
            </div>
            <div class="text-align-end val">
              {{ filterList.gem?.preset[info.gem] || '' }}
            </div>
          </div>
          <div class="row">
            <div>
              品类
            </div>
            <div class="text-align-end val">
              {{ filterList.category?.preset[info.category] || '' }}
            </div>
          </div>
          <div class="row">
            <div>
              工艺
            </div>
            <div class="text-align-end val">
              {{ filterList.craft?.preset[info.craft] || '' }}
            </div>
          </div>
          <template v-if="isFinished">
            <div class="row">
              <div>
                库龄
              </div>
              <div class="text-align-end val">
                {{ getDaysFromToday(info.enter_time || '') }}
              </div>
            </div>
          </template>
        </div>
      </template>
      <template #bottom="{ info }">
        <div class="flex-end text-size-[14px]">
          <div>
            <common-button-rounded
              padding="4px 36px"
              content="详情" @click="jumpInfo(info)"
            />
          </div>
        </div>
      </template>
    </product-manage-card>
  </div>
</template>

<style lang="scss" scoped>
.row {
  --uno: 'flex-between py-4px';
}
.val {
  width: 66%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
