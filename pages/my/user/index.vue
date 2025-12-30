<script setup lang="ts">
useSeoMeta({
  title: '个人中心',
})
definePageMeta({
  layout: 'nav',
})

const { userinfo } = storeToRefs(useUser())
const { getUserInfo } = useUser()
const { getStaffWhere } = useStaff()
const { filterList } = storeToRefs(useStaff())
const { exit } = useAuth()
const { followSystem } = storeToRefs(useThemeStore())
const colorMode = useColorMode()
await getUserInfo()
await getStaffWhere()

const optionsList = ref<UserOpts[]>([{
  iconName: 'i-svg:theme-color',
  optName: '主题设置',
  rightText: '',
  link: '/my/user/theme',
}, {
  iconName: 'i-svg:my-profile',
  optName: '资料管理',
  link: '/my/user/information',
}])

onMounted(() => {
  optionsList.value[0].rightText = followSystem.value ? '跟随系统' : colorMode.value === 'dark' ? '深色模式' : '浅色模式'
})
const Logout = () => {
  exit()
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="p-[16px] ">
        <my-user-userinfo :userinfo="userinfo" :filter-list="filterList" @logout="Logout()" />
      </div>
      <div class="px-[16px] ">
        <my-user-option :opt-list="optionsList" />
      </div>
    </common-layout-center>
    <common-tabbar text="userinfo" />
  </div>
</template>
