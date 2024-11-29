<script lang="ts" setup>
const { $toast } = useNuxtApp()

const formlist = ref<addStaffForm>({
  platform: 'account',
  account: {
    phone: '',
    nickname: '',
    username: '',
    password: '',
    avatar: '',
    email: '',
  },
})
const { useWxWork } = useWxworkStore()
const { createStaff } = useStaff()

// 提示是否添加成功
const addStatus = (res: addStaffRes) => {
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
  }
  else {
    $toast.error(res.message)
  }
}

// 手动新增员工
const addStaff = async () => {
  formlist.value.platform = 'account'
  const res = await createStaff(formlist.value)
  addStatus(res)
}
// /jssdk/wxwork  企业微信授权添加
const wxwordAdd = async () => {
  const wx = await useWxWork()
  const users = await wx?.selectPerson()
  const params = ref<addStaffReq>({
    platform: 'wxwork',
    wxwork: {
      user_id: [],
    },
  })
  if (users?.userList && users.userList?.length > 0) {
    users?.userList.forEach((item) => {
      params.value.wxwork?.user_id.push(item.id)
    })
  }
  const res = await createStaff(params.value)
  addStatus(res)
}
</script>

<template>
  <div class="pb-[120px] grid-12">
    <div class="pb-[16px] col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
      <common-fold title="其他新增方式" from-color="#9EBAF9" to-color="#fff">
        <div class="flex-center-row py-[16px] cursor-pointer">
          <div class="wh-[40px] rounded-full flex-center-row" @click="wxwordAdd()">
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
