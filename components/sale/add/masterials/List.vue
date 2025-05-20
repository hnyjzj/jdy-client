<script lang="ts" setup>
const props = defineProps<{
  oldFilterListToArray: FilterWhere<ProductOld>[]
}>()
const emits = defineEmits<{
  edit: [obj: ProductOld, index: number]
  del: [index: number]
}>()
const showMasterialsList = defineModel<ProductOld[]>('list', { default: [] })
const hasCheck = ref(false)
const confirmShow = ref(false)
const delId = ref()
const deleteOld = (index: number) => {
  confirmShow.value = true
  delId.value = index
}
const deleteConfirm = () => {
  showMasterialsList.value.splice(delId.value, 1)
}
</script>

<template>
  <div class="px-[16px] py-[8px]">
    <template v-for="(obj, ix) in showMasterialsList" :key="ix">
      <div class="pb-[12px]">
        <sale-order-nesting v-model="hasCheck" :title="obj?.name || ''">
          <template #left>
            <common-tags type="pink" text="旧料" :is-oval="true" />
          </template>
          <template #info>
            <div class="flex flex-col gap-[12px] px-[16px]">
              <n-grid :x-gap="12" :y-gap="8" :cols="24">
                <template v-for="(item, index) in props.oldFilterListToArray" :key="index">
                  <template v-if="item.create">
                    <template v-if="item.name === 'is_our'">
                      <n-grid-item :span="12">
                        {{ item.label }}: {{ obj[item.name] ? '是' : '否' }}
                      </n-grid-item>
                    </template>
                    <template v-else>
                      <n-grid-item :span="12">
                        {{ item.label }}: {{ item.input === 'select' ? item.preset[obj[item.name] as string ] : obj[item.name] }}
                      </n-grid-item>
                    </template>
                  </template>
                </template>
              </n-grid>

              <div class="h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]" />
              <n-grid :x-gap="12" :y-gap="8" :cols="12">
                <n-grid-item :span="6" />
                <n-grid-item :span="6">
                  <div class="flex items-center">
                    <div class="mr-[8px]">
                      积分 ( - )
                    </div>
                    <div class="flex-1">
                      <n-input-number
                        v-model:value="obj.integral"
                        :show-button="false"
                        placeholder="积分"
                        min="0"
                        round
                        @focus="focus"
                      />
                    </div>
                  </div>
                </n-grid-item>
              </n-grid>

              <div class="pb-[16px]">
                <div class="flex justify-between items-center">
                  <div class="p-[8px] col-2 flex-center-row cursor-pointer" @click="deleteOld(ix)">
                    <icon name="i-svg:delete" :size="16" />
                  </div>
                  <div class="color-[#fff] bg-[#3971F3] py-[6px] px-[12px] rounded-[30px] cursor-pointer" @click="emits('edit', obj, ix)">
                    编辑
                  </div>
                </div>
              </div>
            </div>
          </template>
        </sale-order-nesting>
      </div>
    </template>

    <common-confirm
      v-model:show="confirmShow"
      title="删除提示"
      text="是否删除此旧料?"
      icon="error"
      @submit="deleteConfirm"

    />
  </div>
</template>

<style lang="scss" scoped>

</style>
