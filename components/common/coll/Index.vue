<script setup lang="ts">
interface IList {
  title: string
  isOpen: boolean
  children: Array<{ title: string, enter: Array<{ name: string, path: string }> }>
}
const list = ref<IList[]>([{ title: '货品管理', isOpen: true, children: [{ title: '成品', enter: [{ name: '成品列表', path: '/product/manage/list' }, { name: '成品列表', path: '/product/manage/list' }] }] }])
</script>

<template>
  <div>
    <template v-for="(item, index) in list" :key="index">
      <div>
        <div class="rounded-[24px] overflow-hidden">
          <div class="bg-gradient-linear-[90deg,#8CADF8,#D8E7FD] px-[16px] py-[8px] text-size-[14px] line-height-[20px] color-[#333] font-semibold flex-between" @click="item.isOpen = !item.isOpen">
            <slot name="title" :title="item.title" />
            <div class="flex items-center">
              <template v-if="item.isOpen">
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
          <div class="blur-bgc px-[16px]" :class="[item.isOpen ? 'block1' : 'hidden1']">
            <div class=" pt-[12px] pb-[16px] text-size-[14px]" :class="[item.isOpen ? 'block2' : 'hidden2']">
              <slot name="content" :content="item.children" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
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
