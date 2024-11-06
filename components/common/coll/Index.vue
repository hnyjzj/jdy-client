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
      <div class="grid-12 px-[16px] py-[12px]">
        <div class="grid-12 gap-[24px] col-12 " uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
          <div class="sm:col-12 lg:col-12 xl:col-6 col-12">
            <div class=" rounded-[24px] overflow-hidden">
              <div class="bg-gradient-linear-[90deg,#8CADF8,#D8E7FD] px-[16px] py-[8px] text-size-[14px] line-height-[20px] color-[#333] font-semibold flex-between" @click="item.isOpen = !item.isOpen">
                <slot name="title" :title="item.title" />
                <div>
                  <template v-if="item.isOpen">
                    <van-icon name="arrow-down" />
                  </template>
                  <template v-else>
                    <van-icon name="arrow-up" />
                  </template>
                </div>
              </div>
              <div class="bg-[#DAE8FD] px-[16px]" :class="[item.isOpen ? 'block1' : 'hidden1']">
                <div class=" pt-[12px] pb-[16px] text-size-[14px]" :class="[item.isOpen ? 'block2' : 'hidden2']">
                  <slot name="content" :content="item.children" />
                </div>
              </div>
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
</style>
