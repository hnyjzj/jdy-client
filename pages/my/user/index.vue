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
// , {
//   iconName: 'i-svg:my-setting',
//   optName: '提醒设置',
//   link: '/my/user/information',
// }, {
//   iconName: 'i-svg:my-question',
//   optName: '问题反馈',
//   link: '/my/user/information',
// }
const Logout = () => {
  exit()
}
</script>

<template>
  <div>
    <div class="grid-12">
      <div class="col-12" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
        <div class="px-[16px] py-[24px]">
          <my-user-userinfo :userinfo="userinfo" :filter-list="filterList" @logout="Logout()" />
        </div>
        <div class="px-[16px] ">
          <my-user-option :opt-list="optionsList" />
        </div>
      </div>
    </div>
    <common-tabbar text="userinfo" />
  </div>
</template>
