<script lang="ts" setup>
const props = defineProps<{
  list: WorkBench[]
  foldStatus: WorkTablesStatus
}>()
const emits = defineEmits<{
  add: [id: string]
  del: [id: string]
  update: [id: string, parent_id: string]
  fold: [id: string]
}>()

const isSetup = defineModel({ type: Boolean, default: false })

function addBench(id: string) {
  emits('add', id)
}

function updateBench(id: string, parent_id: string) {
  emits('update', id, parent_id)
}

function delBench(id: string) {
  emits('del', id)
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
            <template v-if="isSetup">
              <div class="flex items-center">
                <button style="all: unset;" @click="updateBench(work.id, work.parent_id)">
                  <div class="flex items-center">
                    <icon name="i-icon:edit" size="12px" color="#3970F3" />
                    <div class="text-[12px] text-[#3970F3] pl-1">
                      编辑
                    </div>
                  </div>
                </button>
                <template v-if="!work?.children?.length">
                  <button style="all: unset;">
                    <div class="flex items-center ml-4" @click="delBench(work.id)">
                      <icon name="i-icon:delete" size="12px" color="#FF2F2F" />
                      <div class="text-[12px] text-[#FF2F2F] pl-1">
                        删除
                      </div>
                    </div>
                  </button>
                </template>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center" @click="fold(work.id)">
                <template v-if="!foldStatus[work.id]">
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
            </template>
          </div>
          <div class="blur-bgc px-[16px]" :class="!foldStatus[work.id] ? 'block1' : 'hidden1'">
            <div class="pt-[12px] pb-[16px] text-size-[14px]" :class="!foldStatus[work.id] ? 'block2' : 'hidden2'">
              <template v-if="isSetup">
                <button style="all: unset;">
                  <div class="flex items-center mb-3" @click="addBench(work.id)">
                    <icon name="i-icon:addsth" size="26px" color="#666666" />
                    <div class="text-[12px] text-[#666666] pl-1">
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
                          <button style="all: unset;" @click="updateBench(child.id, child.parent_id)">
                            <div class="flex items-center">
                              <icon name="i-icon:edit" size="12px" color="#3970F3" />
                              <div class="text-[12px] text-[#3970F3] pl-1">
                                编辑
                              </div>
                            </div>
                          </button>
                          <template v-if="!child?.children?.length">
                            <button style="all: unset;" @click="delBench(child.id)">
                              <div class="flex items-center ml-4">
                                <icon name="i-svg:delete" size="12px" />
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
                    <div class="sector">
                      <template v-for="son in child.children" :key="son.id">
                        <div class="flex items-center">
                          <div class="relative">
                            <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" @click="jump(son.path)" />
                            <template v-if="isSetup">
                              <icon class="absolute top-[-2px] right-[-2px]" name="i-svg:reduce" size="14px" @click="delBench(son.id)" />
                            </template>
                          </div>
                          <div class="son-title" @click="jump(son.path)">
                            {{ son.title }}
                          </div>
                        </div>
                      </template>
                      <template v-if="isSetup">
                        <button style="all: unset;">
                          <div class="flex items-center mb-2" @click="addBench(child?.id)">
                            <icon name="i-icon:addsth" size="26px" color="#666666" />
                            <div class="text-[12px] text-[#666666] pl-1">
                              添加栏目
                            </div>
                          </div>
                        </button>
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
