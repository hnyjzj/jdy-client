<script lang="ts" setup>
const props = defineProps<{
  transcriptList: any
  transcriptTitle: string[]
}>()
</script>

<template>
  <div class="tran">
    <div class="header">
      <template
        v-for="(item, index) in props.transcriptTitle" :key="index">
        <div>{{ item }}</div>
      </template>
    </div>
    <template v-if="transcriptList?.length">
      <div class="content">
        <template v-for="item in transcriptList" :key="item.id">
          <div>
            <template v-if="item.top > 3">
              <div>{{ item.top }}</div>
            </template>
            <template v-else>
              <img class="avatar" :src="`/images/top/top${item.top}.svg`">
            </template>
          </div>
          <div class="flex items-center">
            <img class="avatar" src="/images/empty/record.png">
            <div class="ml-1">
              {{ item.name }}
            </div>
          </div>
          <div>{{ item.value }}</div>
        </template>
      </div>
    </template>
    <template v-else>
      <common-empty />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.tran {
  --uno: 'rounded-24px blur-bga';
  border: 1px solid #eff0f6;
  .header {
    --uno: 'text-14px font-600 py-12px px-16px grid grid-cols-[1fr_3fr_6fr] text-center text-color';
    background: linear-gradient(to right, rgba(71, 126, 245, 0), rgba(130, 208, 250, 0.8));
    border-radius: 24px 24px 0 0;
  }
  .content {
    --uno: 'grid grid-cols-[1fr_3fr_6fr] text-center text-[14px] font-normal gap-2 p-16px items-center text-color';
    .avatar {
      --uno: 'w32px h32px rounded-[32px]';
    }
    .badge {
      --uno: 'w24px h24px';
    }
  }
}
</style>
