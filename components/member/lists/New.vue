<script setup lang="ts">
const emits = defineEmits(['showPop'])
const handleClick = () => {
  emits('showPop')
}
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <div class="primary">
      <common-gradient title="会员归属" theme="gradient" :italic="true" :foldable="true">
        <template #body>
          <div class="flex flex-col gap-[12px]">
            <div class="base flex flex-1 flex-col gap-[12px]">
              <div class="secondary">
                <div class="secondary-top">
                  姓名
                </div>
                <div class="secondary-bottom">
                  <common-frame tip="请输入会员姓名" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  联系方式
                </div>
                <div class="secondary-bottom">
                  <common-frame tip="请输入会员手机号" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  专属顾问
                </div>
                <div class="secondary-bottom">
                  <common-frame tip="请输入专属顾问" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  昵称
                </div>
                <div class="secondary-bottom">
                  <common-frame tip="请输入会员昵称" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  性别
                </div>
                <div class="secondary-bottom">
                  <common-frame :is-disabled="true" tip="请选择会员性别" :is-icon="true" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  生日
                </div>
                <div class="secondary-bottom">
                  <common-frame :is-disabled="true" :is-icon="true" tip="请选择会员生日" @click="handleClick" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  状态
                </div>
                <div class="secondary-bottom" />
              </div>
            </div>
          </div>
        </template>
      </common-gradient>
    </div>

    <div class="secondary">
      <common-gradient title="会员归属" theme="gradient" :italic="true" :foldable="true">
        <template #body>
          <div class="flex flex-col gap-[12px]">
            <div class="base flex flex-1 flex-col gap-[12px]">
              <div class="secondary">
                <div class="secondary-top">
                  生日
                </div>
                <div class="secondary-bottom">
                  <common-frame tip="请输入会员生日" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  纪念日
                </div>
                <div class="secondary-bottom">
                  <common-frame tip="请输入会员纪念日" />
                </div>
              </div>
              <div class="secondary">
                <div class="secondary-top">
                  备注
                </div>
                <div class="secondary-bottom">
                  <common-frame tip="请输入备注" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </common-gradient>
    </div>
  </div>
</template>

<style scoped lang="scss">
.secondary {
  --uno: 'flex flex-col gap-[8px]';

  &-top {
    --uno: 'font-size-[14px] color-[#333333] dark:color-[#fff]';
  }
}
</style>
