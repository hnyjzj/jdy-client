<script setup lang="ts">
const props = defineProps<{
  data: MemberIntegral[]
}>()
</script>

<template>
  <div>
    <template v-if="props.data.length">
      <div class="grid grid-cols-1 gap-[20px]" uno-lg="grid-cols-2" uno-md="grid-cols-2">
        <common-gradient title="积分信息" theme="solid">
          <template #body>
            <div>
              <template v-for="item in props.data" :key="item.id">
                <div class="flex flex-col gap-[8px]">
                  <div class="item">
                    <div class="left">
                      创建时间
                    </div>
                    <div class="right">
                      {{ item.created_at }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </common-gradient>
      </div>
    </template>

    <template v-else>
      <div class="pt-[160px] py-[32px]">
        <common-empty size="100%" text="该用户暂无积分记录" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.item {
  --uno: 'flex flex-row items-center justify-between gap-[16px]';

  .left {
    --uno: 'font-size-[14px] color-[#666]';
  }

  .right {
    --uno: 'font-size-[14px] color-[#333]';
  }
}
</style>
