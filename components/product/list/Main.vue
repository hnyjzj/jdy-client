<script setup lang="ts">
const props = defineProps<{
  filterList: Where<Product>
  productList: Product[]
}>()
const emits = defineEmits<{
  edit: [code: string]
  goInfo: [info: Product]
}>()

const edit = (code: string) => {
  emits('edit', code)
}

const jumpInfo = (info: Product) => {
  emits('goInfo', info)
}
</script>

<template>
  <div>
    <product-manage-card :list="props.productList" @edit="edit">
      <template #info="{ info }">
        <div class="px-[16px] py-[8px] text-size-[14px] line-height-[20px] text-black dark:text-[#FFF]">
          <div class="flex-between">
            <div>
              条码
            </div>
            <div class="text-align-end val">
              {{ info.code }}
            </div>
          </div>
          <div class="flex-between">
            <div>
              所属大类
            </div>
            <div class="text-align-end val">
              {{ filterList.class?.preset[info.class] || '' }}
            </div>
          </div>
          <div class="flex-between">
            <div>
              货品名称
            </div>
            <div class="text-align-end val">
              {{ info.name }}
            </div>
          </div>
          <div class="flex-between">
            <div>
              货品品牌
            </div>
            <div class="text-align-end val">
              {{ filterList.brand?.preset[info.brand] || '' }}
            </div>
          </div>
          <div class="flex-between">
            <div>
              供应商
            </div>
            <div class="text-align-end val">
              {{ filterList.supplier?.preset[info.supplier] || '' }}
            </div>
          </div>
          <div class="flex-between">
            <div>
              材质
            </div>
            <div class="text-align-end val">
              {{ filterList.material?.preset[info.material] || '' }}
            </div>
          </div>
          <div class="flex-between">
            <div>
              成色
            </div>
            <div class="text-align-end val">
              {{ filterList.quality?.preset[info.quality] || '' }}
            </div>
          </div>
          <div class="flex-between">
            <div>
              宝石
            </div>
            <div class="text-align-end val">
              {{ filterList.gem?.preset[info.gem] || '' }}
            </div>
          </div>
          <div class="flex-between">
            <div>
              品类
            </div>
            <div class="text-align-end val">
              {{ info.style }}
            </div>
          </div>
          <div class="flex-between">
            <div>
              工艺
            </div>
            <div class="text-align-end val">
              {{ info.craft }}
            </div>
          </div>
          <div class="flex-between">
            <div>
              库存
            </div>
            <div class="text-align-end val">
              {{ info.stock }}
            </div>
          </div>
        </div>
      </template>
      <template #bottom="{ info }">
        <div class="flex-end text-size-[14px]">
          <common-button-irregular text="详情" @click="jumpInfo(info)" />
        </div>
      </template>
    </product-manage-card>
  </div>
</template>

<style lang="scss" scoped>
.val {
  width: 66%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
