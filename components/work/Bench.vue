<script lang="ts" setup>
const props = defineProps<{
  list: WorkBench[]
  foldStatus: WorkTablesStatus
  keyword?: string
}>()
const emits = defineEmits<{
  /**
   * @params id: string
   * @params type: number 1: 添加分类 2: 添加栏目
   */
  add: [id: string, type: number]
  del: [id: string]
  update: [bench: WorkBench, type: number]
  fold: [index: number]
  changePage: [bench: WorkBench]
  updateList: [val: WorkBench[]]
}>()

const isSetup = defineModel({ type: Boolean, default: false })

function addBench(id: string, type: number = 0) {
  emits('add', id, type)
}

function updateBench(bench: WorkBench, type: number) {
  emits('update', bench, type)
}

function delBench(id: string) {
  emits('del', id)
}

function fold(index: number) {
  emits('fold', index)
}

function changePageBench(bench: WorkBench) {
  emits('changePage', bench)
}
</script>

<template>
  <div>
    <template v-for="(work, index) in props.list" :key="index">
      <div class="mb-4 px-2 relative">
        <div class="title">
          {{ work.title }}
        </div>
        <!-- 标题下边的小三角形 -->
        <div class="triangle" />
        <div class="rounded-[8px] overflow-hidden blur-bgc p-4">
          <div class="top">
            <div />
            <template v-if="isSetup">
              <div class="flex items-center">
                <button style="all: unset;" @click="updateBench(work, 1)">
                  <div class="flex items-center cursor-pointer">
                    <icon name="i-svg:edit" :size="12" color="#3970F3" />
                    <div class="text-[12px] text-[#3970F3] pl-1">
                      编辑
                    </div>
                  </div>
                </button>
                <template v-if="!work?.children?.length">
                  <button style="all: unset;" @click="delBench(work.id)">
                    <div class="flex items-center ml-4 cursor-pointer">
                      <icon name="i-svg:delete" :size="12" color="#FF2F2F" />
                      <div class="text-[12px] text-[#FF2F2F] pl-1">
                        删除
                      </div>
                    </div>
                  </button>
                </template>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center cursor-pointer pt-1" @click="fold(index)">
                <template v-if="!work.is_fold">
                  <div class="horn">
                    点击收起
                  </div>
                  <icon name="i-icon:down" :size="10" color="rgba(128,128,137,1)" />
                </template>
                <template v-else>
                  <div class="horn">
                    点击展开
                  </div>
                  <icon name="i-icon:left" :size="10" color="rgba(128,128,137,1)" />
                </template>
              </div>
            </template>
          </div>
          <div :class="!work.is_fold ? 'block1' : 'hidden1'">
            <div class="pt-[24px] pb-[8px] text-size-[14px]" :class="!work.is_fold ? 'block2' : 'hidden2'">
              <template v-if="isSetup">
                <button style="all: unset;" @click="addBench(work.id, 2)">
                  <div class="flex items-center mb-3 cursor-pointer text-color-light">
                    <icon name="i-icon:addsth" :size="26" />
                    <div class="text-[12px]  pl-1">
                      添加分类
                    </div>
                  </div>
                </button>
              </template>
              <template v-for="child in work.children" :key="child.id">
                <div class="flex flex-col gap-[24px] pb-[16px]">
                  <div class="flex flex-col gap-[16px]">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="title-decorate" />
                        <div class="text-[12px] font-semibold color-[#333] dark:color-[#fff] pl-1">
                          {{ child.title }}
                        </div>
                      </div>
                      <template v-if="isSetup">
                        <div class="flex items-center">
                          <button style="all: unset;" @click="updateBench(child, 2)">
                            <div class="flex items-center cursor-pointer">
                              <icon name="i-svg:edit" :size="12" color="#3970F3" />
                              <div class="text-[12px] text-[#3970F3] pl-1">
                                编辑
                              </div>
                            </div>
                          </button>
                          <template v-if="!child?.children?.length">
                            <button style="all: unset;" @click="delBench(child.id)">
                              <div class="flex items-center ml-4 cursor-pointer">
                                <icon name="i-svg:delete" :size="12" />
                                <div class="text-[12px] text-[#FF2F2F] pl-1">
                                  删除
                                </div>
                              </div>
                            </button>
                          </template>
                        </div>
                      </template>
                    </div>

                    <template v-if="isSetup">
                      <button style="all: unset;">
                        <div class="flex items-center cursor-pointer text-color-light" @click="addBench(child?.id, 3)">
                          <icon name="i-icon:addsth" />
                          <div class="text-[12px] pl-1">
                            添加栏目
                          </div>
                        </div>
                      </button>
                    </template>
                    <div class="sector">
                      <template v-for="son in child.children" :key="son.id">
                        <div class="flex flex-col items-center cursor-pointer mx-2" @click="changePageBench(son)">
                          <div class="relative">
                            <img :src="son?.icon ? ImageUrl(son.icon) : '/images/sale/sales-list.png'" class="w-[32px] h-[32px]">
                            <template v-if="isSetup">
                              <icon class="absolute top-[-2px] right-[-2px] cursor-pointer" name="i-svg:reduce" :size="14" @click.stop="delBench(son.id)" />
                            </template>
                          </div>
                          <div class="son-title">
                            {{ son.title }}
                          </div>
                        </div>
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
  --uno: 'text-#1A6DD8 bg-gradient-linear-[90deg,#DAEAFF,#AAC8FF] font-700 text-14px absolute top-4 left-0 z-1 px-16px py-2px';
  clip-path: polygon(0 0, 90% 0, 100% 100%, 0 100%);
}
.triangle {
  --uno: 'w-2 h-2 bg-gradient-linear-[180deg,#145EFF,#DDE9FF] absolute top-10 left-0 z-1 ';
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}
.son-title {
  --uno: 'text-[12px] text-center color-[#333] font-medium dark:color-[#fff]';
}

.sector {
  --uno: 'grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-y-3';
}

.line {
  --uno: 'h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]';
}
.top {
  --uno: 'text-size-[16px] line-height-[20px] color-[#333] font-semibold flex-between';
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
  --uno: 'text-[12px] text-[rgba(128,128,137,1)] pr-1';
}
.title-decorate {
  --uno: 'w-1 h-4 rounded-1 bg-gradient-linear-[180deg,#D8E7FD,#8CADF8]';
}
</style>
