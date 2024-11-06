<script setup lang="ts">
const handleClick = async () => {
  // 跳转到搜索会员页
  await navigateTo('/sale/search/member')
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-[16px] py-[16px]">
      <common-fold title="基础信息">
        <!-- 不可编辑 -->
        <div class="p-[16px] w-auto flex flex-col gap-[12px]" uno-lg="grid grid-cols-1 gap-[16px] grid-cols-0">
          <div class="base">
            <div class="inplabel">
              收支单号
            </div>
            <div class="desc">
              QTSZD2139027321
            </div>
          </div>
          <div class="base">
            <div class="inplabel">
              所属门店
            </div>
            <div class="desc">
              洛阳XXXXXXXX店
            </div>
          </div>
          <div class="base">
            <div class="inplabel">
              创建人
            </div>
            <div class="desc">
              邹元标
            </div>
          </div>
          <div class="base">
            <div class="inplabel">
              创建时间
            </div>
            <div class="desc">
              2024-04-08 12:10:24
            </div>
          </div>
        </div>
      </common-fold>

      <common-fold title="销售信息">
        <div class="p-[16px] w-auto flex flex-col gap-[12px]">
          <div class="box col-start-1 col-end-3">
            <div class="inplabel">
              选择会员
            </div>
            <div class="flex flex-row items-center gap-[12px]">
              <common-frame name="自然客流" :is-icon="true" :is-disabled="true" height="40px" class="flex-1">
                <template #left>
                  <common-avatar :size="20" rounded="60px" :has-shadow="false" />
                </template>
              </common-frame>
              <div>
                <sale-plusminus @button-click="handleClick" />
              </div>
            </div>
          </div>
          <div class="box">
            <div class="inplabel">
              选择班组
            </div>
            <common-frame name="关联销售单" :is-disabled="true" :is-icon="true" height="40px" />
          </div>
          <div class="box">
            <div class="inplabel">
              主销导购
            </div>
            <common-frame name="主销导购" :is-disabled="true" :is-icon="true" height="40px" />
          </div>
          <div class="box">
            <div class="inplabel">
              关联销售单
            </div>
            <common-frame name="关联销售单" :is-disabled="true" :is-icon="true" height="40px" />
          </div>
        </div>
      </common-fold>

      <common-fold title="收支信息">
        <div class="p-[16px] w-auto flex flex-col gap-[12px]" uno-lg="grid grid-cols-1 gap-[16px] grid-cols-0">
          <div class="box">
            <div class="inplabel">
              收支类型
            </div>
            <common-frame name="收支类型" :is-disabled="true" :is-icon="true" height="40px" />
          </div>
          <div class="box">
            <div class="inplabel">
              收支内容
            </div>
            <common-frame name="收银员" :is-disabled="true" :is-icon="true" height="40px" />
          </div>
          <div class="box">
            <!-- 下拉筛选 -->
            <div class="inplabel">
              收支来源
            </div>
            <common-frame name="收银员" :is-disabled="true" :is-icon="true" height="40px" />
          </div>
          <div class="box">
            <!-- 下拉筛选 -->
            <div class="inplabel">
              收支方式
            </div>
            <common-frame name="收银员" :is-disabled="true" :is-icon="true" height="40px" />
          </div>
          <div class="box">
            <div class="inplabel">
              收支金额
            </div>
            <common-frame :disabled-style="true" tip="2024-04-08 12:10:24" :is-icon="true" height="40px" />
          </div>
        </div>
      </common-fold>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base {
  --uno: 'flex-center-between gap-[12px]';

  .desc {
    --uno: 'color-[#666] dark:text-[#fff] font-size-[14px]';
  }
}
.box {
  --uno: 'flex flex-col gap-[12px]';
}

.inplabel {
  --uno: 'color-[#333] dark:text-[#CBCDD1] font-size-[14px]';
}
</style>
