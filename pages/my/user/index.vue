<script setup lang="ts">
useSeoMeta({
  title: '个人中心',
})
const { userinfo } = storeToRefs(useUser())
const { getUserInfo } = useUser()
usePageShow(() => {
  getUserInfo()
})
</script>

<template>
  <div>
    <div class="grid-12">
      <div class="col-12" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
        <div class="px-[16px] py-[24px]">
          <my-user-userinfo :userinfo="userinfo" />
        </div>
        <div class="px-[16px] ">
          <my-user-option />
        </div>
      </div>
    </div>
    <common-tabbar text="userinfo" />
  </div>
</template>
