<script setup lang="ts">
const store = ref()
onMounted(() => {
  store.value = useUser()
})
</script>

<template>
  <div class="flex-between color-[#fff]">
    <nuxt-link to="/login" class="color-[#fff]">
      <div class="flex-start ">
        <div class="">
          <template v-if="!store?.userinfo?.avatar">
            <icon name="i-svg:avatar" size="68" />
          </template>
          <template v-else>
            <nuxt-img :src="store?.userinfo?.avatar" size="68px" />
          </template>
        </div>
        <div class="ml-[8px]">
          <div class="mb-[4px] font-semibold text-[16px] line-height-[20px]">
            {{ store?.userinfo?.name || '' }}
          </div>
          <div class="text-[14px] line-height-[20px]">
            {{ newPhone(store?.userinfo?.phone || '') }}
          </div>
        </div>
      </div>
    </nuxt-link>

    <div class="flex-end">
      <div class="mr-[4px] text-[14px] line-height-[20px]">
        编辑资料
      </div>
      <van-icon name="arrow" size="20px" />
    </div>
  </div>
</template>
