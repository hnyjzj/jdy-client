<script lang="ts" setup>
const props = defineProps<{
  info: AccessorieEnter
  filterList: FilterWhere<ProductAccessories>[]
}>()

const emits = defineEmits<{
  del: [id: string]
  updatePage: [page: number]
}>()

const page = defineModel({ type: Number, default: 1 })

function del(id: string) {
  emits('del', id)
}

function updatePage(e: number) {
  emits('updatePage', e)
}
</script>

<template>
  <template v-if="props.info.products?.length">
    <div class="p-4 blur-bgc rounded-6">
      <div class="text-[14px] pb-4 text-color">
        共 {{ info.product_count }}
      </div>
      <template v-for="(item, index) in props.info.products" :key="index">
        <div class="grid mb-3">
          <sale-order-nesting :title="item.name" :info="props.info">
            <template #left>
              <template v-if="props.info.status === 1">
                <icon class="cursor-pointer" name="i-svg:reduce" :size="20" @click="del(item.id)" />
              </template>
            </template>
            <template #info>
              <div class="px-[16px] pb-4 grid grid-cols-2 justify-between sm:grid-cols-3 gap-4">
                <template v-for="(filter, findex) in filterList" :key="findex">
                  <template v-if="filter.find && filter.name !== 'store_id'">
                    <div class="flex">
                      <div class="key">
                        {{ filter.label }}
                      </div>
                      <template v-if="filter.input === 'select'">
                        <div class="value">
                          <common-tooltip :val="filter.preset[item[filter.name]]" />
                        </div>
                      </template>
                      <template v-else>
                        <div class="value">
                          <common-tooltip :val="item[filter.name]" />
                        </div>
                      </template>
                    </div>
                  </template>
                </template>
                <div class="flex">
                  <div class="key">
                    入库数量
                  </div>
                  <div class="value">
                    {{ item.stock }}
                  </div>
                </div>
              </div>
            </template>
          </sale-order-nesting>
        </div>
      </template>
      <common-page v-model:page="page" :total="info.product_count" :limit="20" @update:page="updatePage" />
    </div>
  </template>
</template>

<style lang="scss" scoped>
.key {
  --uno: 'text-size-[14px] color-[#666] dark:color-[#CBCDD1] mr-2 text-ellipsis shrink-0';
}
.value {
  --uno: 'text-size-[14px] color-[#333] dark:color-[#fff] w-[60%]';
  text-overflow: ellipsis; /* 超出显示省略号 */
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden;
}
</style>
