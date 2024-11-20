<script setup lang="ts">
const props = defineProps<{
  content?: WorkTables[]
}>()
</script>

<template>
  <div>
    <template v-for="(item, index) in props.content" :key="`${item.title}-${index}`">
      <div class="flex flex-col gap-[24px] pb-[16px]">
        <div class="flex flex-col gap-[16px]">
          <div class="text-[12px] font-semibold color-[#333] dark:color-[#fff]">
            {{ item.title }}
          </div>
          <div class="line" />
          <div class="sector">
            <template v-for="(child, i) in item.children" :key="`${child.name}-${i}`">
              <nuxt-link :to="child.path">
                <div class="flex items-center">
                  <nuxt-img src="images/sale/sales-list.png" class="w-[32px] h-[32px]" />
                  <div class="title">
                    {{ child.name }}
                  </div>
                </div>
              </nuxt-link>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.title {
  --uno: 'text-[12px] color-[#333] font-medium dark:color-[#fff]';
}

.sector {
  --uno: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-3';
}

.line {
  --uno: 'h-[1px] bg-[#E6E6E8] dark:bg-[rgba(230,230,232,0.3)]';
}
</style>
