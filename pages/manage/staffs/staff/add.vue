<script lang="ts" setup>
import { useDialog, useMessage } from 'naive-ui'

const message = useMessage()
const formlist = ref<addStaffForm>({
  platform: 'account',
  account: {
    phone: '',
    nickname: '',
    gender: 0,
    password: '',
    avatar: '',
    email: '',
    store_id: '',
  },
})
const { useWxWork } = useWxworkStore()
const { createStaff, uploadAvatar } = useStaff()
const dialog = useDialog()
const router = useRouter()
const addRef = ref()

const handleConfirm = () => {
  dialog.success({
    title: '创建成功',
    content: '是否继续添加新员工?',
    closable: false,
    closeOnEsc: false,
    maskClosable: false,
    positiveText: '继续添加',
    negativeText: '返回上一页',
    onPositiveClick: () => {
      formlist.value.account = {
        phone: '',
        nickname: '',
        gender: 0,
        password: '',
        avatar: '',
        email: '',
      } as addStaffForm['account']
      addRef.value.clearAvatar()
    },
    onNegativeClick: () => {
      router.go(-1)
    },

  })
}

// 手动新增员工
const addStaff = async () => {
  formlist.value.platform = 'account'
  const res = await createStaff(formlist.value)
  if (res.code === HttpCode.SUCCESS) {
    message.success('创建成功')
    handleConfirm()
  }
  else {
    message.error(res.message)
  }
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
  if (res.code === HttpCode.SUCCESS) {
    message.success('创建成功')
    handleConfirm()
  }
  else {
    message.error(res.message)
  }
}
const uploadFile = async (file: any, onfinish?: () => void) => {
  try {
    const res = await uploadAvatar({ avatar: file || undefined })
    if (res.data.value.code !== HttpCode.SUCCESS) {
      message.error(res.data.value?.message || '上传失败')
      return false
    }
    const url = res.data.value.data.url
    //  如果有id 说明是 修改logo ,没有id则是新增
    formlist.value.account.avatar = url
    onfinish?.()
  }
  catch {
    message.error('上传失败，请重试')
  }
}
</script>

<template>
  <div class="grid-12">
    <div class="pb-[16px] col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
      <common-fold title="其他新增方式" from-color="#9EBAF9" to-color="#fff">
        <div class="flex-center-row py-[16px] cursor-pointer">
          <div class="wh-[40px] rounded-full flex-center-row" @click="wxwordAdd()">
            <icon name="i-svg:qwicon" :size="32" />
          </div>
        </div>
      </common-fold>
    </div>
    <div class="col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
      <staff-manage-add ref="addRef" v-model="formlist" @submit="addStaff" @upload="uploadFile" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
