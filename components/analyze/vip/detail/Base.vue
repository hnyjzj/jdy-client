<script lang="ts" setup>
const props = defineProps<{
  vipbase: any[]
}>()
</script>

<template>
  <div class="mt-[12px]">
    <common-fold title="老会员复购率" from-color="rgba(71,126,245,0.8)" to-color="rgba(243,245,254,0.6)">
      <div class="p-[16px]">
        <div>
          <div class="bust">
            <div class="bust-bg" />
            <img class="avatar" src="/images/empty/record.png">
          </div>
          <div class="info">
            <template v-for="(item, index) in props.vipbase" :key="index">
              <div class="row">
                <div class="text-color-light">
                  {{ item.key }}
                </div>
                <div class="text-color ml-3">
                  {{ item.value }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </common-fold>
  </div>
</template>

<style lang="scss" scoped>
.bust {
  position: absolute;
  .bust-bg {
    --uno: 'w48px h48px bg-[rgba(56,101,252,0.8)] rounded-[48px]';
  }
  .avatar {
    --uno: 'w48px h48px absolute top-[-2px] right-[-2px] rounded-[48px]';
  }
}
.info {
  --uno: 'ml-60px text-14px font-400';
  .row {
    --uno: 'flex pb-8px items-center';
    &:nth-child(4n + 1):not(:first-child) {
      //   background: rgba(71, 126, 245, 0.8);
      --uno: 'pt-6px';
      border-top: solid 1px rgba(230, 230, 232, 1);
    }
  }
}
</style>
