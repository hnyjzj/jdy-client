<script setup lang="ts">
useSeoMeta({
  title: '个人中心',
})
const { userinfo } = storeToRefs(useUser())
const { getUserInfo } = useUser()
const { getStaffWhere } = useStaff()
const { filterList } = storeToRefs(useStaff())
const { exit } = useAuth()
await getUserInfo()
await getStaffWhere()

const optionsList = ref<UserOpts[]>([{
  iconName: 'i-svg:my-profile',
  optName: '资料管理',
  link: '/my/user/information',
}])

const Logout = () => {
  exit()
}
</script>

<template>
  <div>
    <div class="bg-[#3875C5]">
      <common-layout-center>
        <div class="p-[16px] ">
          <my-user-userinfo :userinfo="userinfo" :filter-list="filterList" @logout="Logout()" />
        </div>
      </common-layout-center>
    </div>
    <common-layout-center>
      <div class="px-[16px] ">
        <my-user-option :opt-list="optionsList" />
      </div>
    </common-layout-center>

    <common-tabbar text="userinfo" />
  </div>
</template>
