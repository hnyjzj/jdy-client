<script lang="ts" setup>
interface Props {
  /**
   * placeholder提示语
   */
  tip?: string
  /**
   * 禁止输入
   */
  isDisabled?: boolean
  /**
   * 禁止输入且为禁止输入样式
   */
  disabledStyle?: boolean
  /**
   * 输入框类型
   */
  type?: 'text' | 'password' | 'number' | 'tel' | 'email' | 'url' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'search' | 'color'
  fontSize?: string
  isIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  fontSize: '14px',
})

const value = defineModel()
</script>

<template>
  <div
    class="row"
    :class="props.disabledStyle ? 'disable' : 'nodisable'" :style="{ fontSize }"
  >
    <div class="flex items-center flex-1">
      <slot name="left" />
      <input v-model="value" min="0" :disabled="props.isDisabled || props.disabledStyle" :class="props.disabledStyle ? 'row-input dis' : 'row-input nodis'" :type="props.type" :placeholder="props.tip" @focus="focus">
    </div>
    <template v-if="props.isIcon">
      <div class="row-right">
        <template v-if="$slots.icon">
          <slot name="icon" />
        </template>
        <template v-else>
          <icon name="i-icon:arrow" :color="props.disabledStyle ? '#808089' : '#CBCDD1'" />
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.row {
  --uno: 'px-[12px] rounded-[36px] w-auto';

  &.disable {
    --uno: 'flex-between border-[rgba(230,230,232,0.5)] border-1px border-solid dark:bg-[rgba(230,230,232,0.3)] dark:border-[rgba(230,230,232,0.3)]';
  }
  &.nodisable {
    --uno: 'flex-between bg-#fff border-[#e6e6e8] border-1px border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)]';
  }
  &-input {
    background: transparent;
    --uno: 'border-none bg-transparent color-[#333] dark:color-[#fff] flex-1 py-[10px]';
  }

  .nodis::placeholder {
    ---uno: 'color-[#cbcdd1] font-size-[14px]';
  }
  .dis::placeholder {
    --uno: 'color-[#808089] font-size-[14px]';
  }
}
</style>
