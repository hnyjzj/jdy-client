<script lang="ts" setup>
const formlist = ref<addStaffReq>({
  phone: '',
  username: '',
  nickname: '',
  password: '',
  avatar: '',
  email: '',
})
const { useWxWork } = useWxworkStore()
const { createStaff } = useStaff()
const addStaff = async () => {
  await createStaff(formlist.value)
}
// /jssdk/wxwork
const demo = async () => {
  const wx = await useWxWork()
  const users = wx?.selectPerson()
  console.log(users, 'users')
}
</script>

<template>
  <div class="pb-[120px] grid-12">
    <div class="pb-[16px] col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
      <common-fold title="其他新增方式" from-color="#9EBAF9" to-color="#fff">
        <div class="flex-center-row  py-[16px]">
          <div class="wh-[40px] rounded-full flex-center-row" @click="demo()">
            <icon name="i-svg:qwicon" size="32" />
          </div>
        </div>
      </common-fold>
    </div>
    <div class="col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
      <staff-mamage-add v-model="formlist" @submit="addStaff" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
