<script lang="ts" setup>
const props = defineProps<{
  list: WorkBench[]
  foldStatus: WorkTablesStatus
}>()
const emits = defineEmits<{
  add: [id: string]
  fold: [id: string]
}>()
function addBench(id: string) {
  emits('add', id)
}
function fold(id: string) {
  emits('fold', id)
}
</script>

<template>
  <div>
    <template v-for="(work, index) in props.list" :key="index">
      <div class="mb-6">
        <div class="rounded-[24px] overflow-hidden">
          <div class="top">
            <div class="title">
              {{ work.title }}
            </div>
            <div class="flex items-center" @click="fold(work.id)">
              <template v-if="foldStatus[work.id]">
                <div class="horn">
                  点击收起
                </div>
                <icon name="i-icon:down" size="12px" color="rgba(128,128,137,1)" />
              </template>
              <template v-else>
                <div class="horn">
                  点击展开
                </div>
                <icon name="i-icon:left" size="12px" color="rgba(128,128,137,1)" />
              </template>
            </div>
          </div>
          <div class="blur-bgc px-[16px]" :class="true ? 'block1' : 'hidden1'">
            <div class="pt-[12px] pb-[16px] text-size-[14px]" :class="true ? 'block2' : 'hidden2'">
              <div class="text-[#666]" @click="addBench(work.id)">
                添加目录
              </div>
              <template v-for="child in work.children" :key="child.id">
                <div class="flex flex-col gap-[24px] pb-[16px]">
                  <div class="flex flex-col gap-[16px]">
                    <div class="text-[12px] font-semibold color-[#333] dark:color-[#fff]">
                      {{ child.title }}
                    </div>
                    <div class="text-[#666]" @click="addBench(child?.id)">
                      添加页面
                    </div>
                    <div class="line" />
                    <div class="sector">
                      <template v-for="son in child.children" :key="son.id">
                        <nuxt-link :to="son.path">
                          <div class="flex items-center">
                            <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                            <div class="son-title">
                              {{ son.title }}
                            </div>
                          </div>
                        </nuxt-link>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.title {
  --uno: 'text-[rgba(51,51,51,1)] font-bold text-14px';
}
.son-title {
  --uno: 'text-[12px] color-[#333] font-medium dark:color-[#fff]';
}

.sector {
  --uno: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-3';
}

.line {
  --uno: 'h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]';
}
.top {
  --uno: 'bg-gradient-linear-[90deg,#8CADF8,#D8E7FD] px-[16px] py-[8px] text-size-[14px] line-height-[20px] color-[#333] font-semibold flex-between';
}
.hidden1 {
  height: 0px;
  transition: all 200ms ease;
}

.block2 {
  opacity: 1;
  transition: all 200ms ease;
}
.hidden2 {
  opacity: 0;
  transition: all 200ms ease;
}
.horn {
  --uno: 'text-3 text-[rgba(128,128,137,1)] pr-1';
}
</style>
