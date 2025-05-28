<script lang="ts" setup generic="T">
const props = defineProps<{
  info: T
  filterList: FilterWhere<T>[]
  code?: string
}>()
</script>

<template>
  <div class="px-[16px] pb-4 grid grid-cols-2 justify-between sm:grid-cols-3 md:grid-cols-4 gap-4">
    <template v-for="(item, index) in props.filterList" :key="index">
      <template v-if="item.find">
        <template v-if="item.input === 'select'">
          <div class="flex">
            <div class="key">
              {{ item.label }}
            </div>
            <div class="value text-[rgba(57,113,243,1)]">
              {{ item.preset[info[item.name]] || '--' }}
            </div>
          </div>
        </template>
        <template v-else-if="item.input === 'switch'">
          <div class="flex">
            <div class="key">
              {{ item.label }}
            </div>
            <div class="value text-[rgba(57,113,243,1)]">
              {{ props.info[item.name] ? '是' : '否' }}
            </div>
          </div>
        </template>
        <template v-else-if="item.input === 'text' || item.input === 'textarea'">
          <div class="flex">
            <div class="key">
              {{ item.label }}
            </div>
            <div class="value text-[rgba(57,113,243,1)]">
              <template v-if="item.name === 'code'">
                <span>
                  {{ props.code || props.info[item.name] }}
                </span>
              </template>
              <template v-else>
                <span>
                  {{ props.info[item.name] || '--' }}
                </span>
              </template>
            </div>
          </div>
        </template>
        <template v-else-if="item.input === 'number'">
          <div class="flex">
            <div class="key">
              {{ item.label }}
            </div>
            <div class="value text-[rgba(57,113,243,1)]">
              {{ props.info[item.name] }}
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
  white-space: nowrap;
}
.value {
  --uno: 'text-size-[14px] color-[#333] dark:color-[#fff] w-[60%]';
  text-overflow: ellipsis; /* 超出显示省略号 */
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden;
}
</style>
