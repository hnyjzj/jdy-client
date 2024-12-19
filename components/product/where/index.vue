<script lang="ts" setup generic="T">
const props = defineProps<{
  filterListToArray: FilterWhere[]
  list: T
}>()
const emits = defineEmits<{
  submit: [params: T]
}>()
const isFilter = defineModel({ type: Boolean, default: false })
// 筛选参数
const filterParams = ref({} as T)
/**
 * 选择筛选条件
 * @param filterKey  筛选条件值
 * @param presetId 预选值id
 */
function selectFilter(filterKey: string, presetId: number) {
  if (filterParams.value[filterKey] === presetId) {
    delete (filterParams.value[filterKey])
  }
  else {
    filterParams.value[filterKey] = presetId
  }
}
function submit() {
  emits('submit', filterParams.value)
  filterParams.value = {} as T
}
</script>

<template>
  <div>
    <common-popup v-model="isFilter">
      <div class="p-4">
        <template v-for="(filter, index) in props.filterListToArray" :key="index">
          <template v-if="filter.show">
            <div class="mb-2">
              <div class="text-color">
                {{ filter?.label }}
              </div>
              <template v-if="filter?.input === 'select'">
                <div class="flex flex-wrap">
                  <template v-for="(presetValue, presetId, pindex) in filter?.preset" :key="pindex">
                    <div class="cursor-pointer inline-block shrink-0 flex items-center mr-2 mt-2 text-color" @click="selectFilter(filter.name, Number(presetId))">
                      <template v-if="filterParams[filter.name] === Number(presetId)">
                        <van-icon name="passed" color="#1D6DEC" />
                      </template>
                      <template v-else>
                        <van-icon name="circle" />
                      </template>
                      <div class="text-color-light text-[14px]">
                        {{ presetValue }}
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else-if="filter?.input === 'switch'">
                <van-switch v-model="filterParams[filter.name]" />
              </template>
              <template v-else-if="filter?.input === 'search'">
                <van-switch v-model="filterParams[filter.name]" />
              </template>
              <template v-else-if="filter?.input === 'number'">
                <div class="mt-2">
                  <common-frame v-model="filterParams[filter.name]" type="number" :tip="`输入筛选${filter?.label}`" />
                </div>
              </template>
              <template v-else-if="filter?.input === 'text'">
                <div class="mt-2">
                  <common-frame v-model="filterParams[filter.name]" type="text" :tip="`输入筛选${filter?.label}`" />
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>
      <div class="m-2">
        <common-button-rounded content="确认筛选" @button-click="submit" />
      </div>
    </common-popup>
  </div>
</template>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
