<script lang="ts" setup>
const { $toast } = useNuxtApp()
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

const router = useRouter()
const addRef = ref()

const dialogShow = ref(false)

const continueAdd = () => {
  formlist.value.account = {
    phone: '',
    nickname: '',
    gender: 0,
    password: '',
    avatar: '',
    email: '',
  } as addStaffForm['account']
  addRef.value.clearAvatar()
}
const cancelAdd = () => {
  router.go(-1)
}
// 手动新增员工
const addStaff = async () => {
  formlist.value.platform = 'account'
  const res = await createStaff(formlist.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    dialogShow.value = true
  }
  else {
    $toast.error(res?.message || '创建失败')
  }
}
// 是否是企业微信环境
const iswx = ref(false)
if (import.meta.client) {
  if (isWxWorkClient() || isWeChatClient()) {
    iswx.value = true
  }
  else {
    iswx.value = false
  }
}
// /jssdk/wxwork  企业微信授权添加
const wxwordAdd = async () => {
  if (!iswx.value) {
    $toast.error('请在企业微信中使用')
    return
  }

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
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    dialogShow.value = true
  }
  else {
    $toast.error(res?.message || '创建失败')
  }
}
const uploadFile = async (file: any, onfinish?: () => void) => {
  try {
    const { data } = await uploadAvatar({ avatar: file || undefined })
    if (data.value?.code !== HttpCode.SUCCESS) {
      $toast.error(data.value?.message || '上传失败')
      return false
    }
    const url = data.value.data.url
    //  如果有id 说明是 修改logo ,没有id则是新增
    formlist.value.account.avatar = url
    onfinish?.()
  }
  catch {
    $toast.error('上传失败，请重试')
  }
}

const other_ways = ref<{
  icon: string
  name: string
  click: () => void
}[]>([
      {
        icon: 'i-svg:qwicon',
        name: '企业微信',
        click: () => wxwordAdd(),
      },
    ])
</script>

<template>
  <div class="grid-12 gap-[16px] p-[16px]">
    <div class="col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
      <staff-manage-add ref="addRef" v-model="formlist" @submit="addStaff" @upload="uploadFile" />
    </div>
    <div class="col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
      <common-fold title="其他方式" from-color="#9EBAF9" to-color="#fff">
        <div class="flex-center-row cursor-pointer">
          <template v-for="item in other_ways" :key="item.name">
            <div class=" rounded-full flex-center-col p-[16px]" @click="item.click()">
              <icon :name="item.icon" :size="32" />
              <div class="color-[#333]">
                {{ item.name }}
              </div>
            </div>
          </template>
        </div>
      </common-fold>
    </div>
    <common-confirm
      v-model:show="dialogShow"
      title="创建成功"
      text="是否继续添加新员工?"
      icon="success"
      cancel-text="否"
      confirm-text="是"
      @submit="continueAdd"
      @cancel="cancelAdd"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
