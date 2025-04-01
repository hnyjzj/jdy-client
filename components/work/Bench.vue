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
      <div class="mb-6">
        <div class="rounded-[24px] overflow-hidden">
          <div class="top">
            <div class="title">
              {{ work.title }}
            </div>
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
              <div class="flex items-center cursor-pointer" @click="fold(index)">
                <template v-if="!work.is_fold">
                  <div class="horn">
                    点击收起
                  </div>
                  <icon name="i-icon:down" :size="12" color="rgba(128,128,137,1)" />
                </template>
                <template v-else>
                  <div class="horn">
                    点击展开
                  </div>
                  <icon name="i-icon:left" :size="12" color="rgba(128,128,137,1)" />
                </template>
              </div>
            </template>
          </div>
          <div class="blur-bgc px-[16px]" :class="!work.is_fold ? 'block1' : 'hidden1'">
            <div class="pt-[12px] pb-[16px] text-size-[14px]" :class="!work.is_fold ? 'block2' : 'hidden2'">
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
                      <div class="text-[12px] font-semibold color-[#333] dark:color-[#fff]">
                        {{ child.title }}
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
                    <div class="line" />
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
  --uno: 'text-[rgba(51,51,51,1)] font-bold text-14px';
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
  --uno: 'bg-gradient-linear-[90deg,#8CADF8,#D8E7FD] px-[16px] py-[12px] h-[44px] text-size-[16px] line-height-[20px] color-[#333] font-semibold flex-between';
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
  --uno: 'text-[14px] text-[rgba(128,128,137,1)] pr-1';
}
</style>
