<script lang="ts" setup>
const props = defineProps<{
  list: any[]
}>()
const act = ref(1)
const data = ref([
  {
    class: '265541',
    pieces: '1',
    proportion: '50%',
    fee: '99',
    name: '足金项链',
  },
  {
    class: '265541',
    pieces: '1',
    proportion: '50%',
    fee: '99',
    name: '足金项链',
  },
])
</script>

<template>
  <div>
    <common-fold title="列表" :is-collapse="false" from-color="rgba(71,126,245,0.6)" to-color="rgba(243,245,254,0.6)">
      <div class="py-[16px] px-[16px]">
        <div class="category">
          <template v-for="(item, index) in props.list" :key="index">
            <div class="cate" :class="act === index ? 'act' : 'unact'" @click="act = index">
              {{ item }}
            </div>
          </template>
        </div>
        <div class="data">
          <div class="flex">
            <div class="title">
              <div class="titleitem">
                大类
              </div>
              <div class="titleitem">
                件数
              </div>
              <div class="titleitem">
                占比
              </div>
              <div class="titleitem">
                入网费
              </div>
              <div class="titleitem">
                型号
              </div>
            </div>
            <div class="flex-1 bg-[#F1F5FE]" />
          </div>
          <template v-for="(item, index) in data" :key="index">
            <div class="flex">
              <div class="row">
                <div class="colitem">
                  {{ item.class }}
                </div>
                <div class="colitem">
                  {{ item.pieces }}
                </div>
                <div class="colitem">
                  {{ item.proportion }}
                </div>
                <div class="colitem">
                  {{ item.fee }}
                </div>
                <div class="colitem">
                  {{ item.name }}
                </div>
              </div>
              <div class="flex-1 border-t-[1px] border-t-[#e6e6e8] border-t-solid" />
            </div>
          </template>
        </div>
      </div>
    </common-fold>
  </div>
</template>

<style lang="scss" scoped>
.category {
  --uno: 'flex flex-row flex-nowrap overflow-x-auto mb-[16px]';
  .unact {
    --uno: 'bg-[rgba(241,245,254,1)] text-[rgba(57,113,243,1)]';
  }
  .act {
    --uno: 'bg-[rgba(57,113,243,1)] text-[#FFFFFF]';
  }
  .cate {
    --uno: 'px-8px py-4px rounded-[8px] mr-6px shrink-0';
  }
}
.data {
  overflow-x: auto;
  .title {
    --uno: 'flex items-center flex-nowrap';
    .titleitem {
      --uno: 'w-[88px] h-44px lh-44px pl-16px shrink-0 font-600 text-14px bg-#F1F5FE';
    }
  }
  .row {
    --uno: 'flex items-center flex-nowrap';
    .colitem {
      --uno: 'w-[88px] h-64px lh-64px pl-16px shrink-0 text-14px text-color';
      border-top: 1px #e6e6e8 solid;
    }
  }
}
</style>
