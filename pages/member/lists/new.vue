<script setup lang="ts">
useSeoMeta({
  title: '新增会员',
})

const show = ref(false)
const currentDate = ref(['2000', '01', '01'])
const minDate = new Date(1900, 0, 1)
const maxDate = new Date(new Date().getFullYear(), 11, 31)
</script>

<template>
  <div class="grid-12">
    <common-model v-model="show" :show-ok="true" title="请选择会员生日">
      <div class="pb-[24px]">
        <van-date-picker
          v-model="currentDate"
          title="选择日期"
          :min-date="minDate"
          :max-date="maxDate"
        >
          <template #toolbar>
            <div />
          </template>
        </van-date-picker>
      </div>
    </common-model>
    <div class="col-12 px-[16px] py-[16px]" uno-lg="col-8 offset-2">
      <member-lists-new
        @show-pop="() => { show = true }" />
    </div>
    <div class="h-[80px]">
      <common-button-bottom confirm-text="确认新增" cancel-text="取消" />
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
