<script lang="ts" setup>
const { $toast } = useNuxtApp()
useSeoMeta({
  title: '编辑员工',
})

const { uploadAvatar, getStaffWhere } = useStaff()
const { filterListToArray } = storeToRefs(useStaff())
const { staffGetStoreList } = useStores()
const { staffGetRegionList } = useRegion()
const getStoreList = async (query: string) => {
  const res = await staffGetStoreList({ page: 1, limit: 10, where: { name: query } })
  return res || []
}

const getRegionList = async (query: string) => {
  const res = await staffGetRegionList({ page: 1, limit: 10, where: { name: query } })
  return res || []
}

const router = useRouter()
const route = useRoute()
const addRef = ref()
const dialogShow = ref(false)
await getStaffWhere()
const formlist = ref<updateStaffForm>({
  phone: '',
  nickname: '',
  username: '',
  avatar: '',
  email: '',
  gender: 0,
  is_disabled: false,
} as updateStaffForm)
const continueAdd = () => {
  formlist.value = {
    phone: '',
    nickname: '',
    gender: 0,
    avatar: '',
    email: '',
    is_disabled: false,
  } as updateStaffForm
  addRef.value.clearAvatar()
}
const cancelAdd = () => {
  router.go(-1)
}

const { getStaffInfo } = useStaff()
const { staffInfo } = storeToRefs(useStaff())
if (route.query.id) {
  await getStaffInfo({ id: route.query.id as string })

  const { nickname, username, phone, email, gender, is_disabled, avatar } = staffInfo.value
  formlist.value.nickname = nickname
  formlist.value.username = username
  formlist.value.phone = phone
  formlist.value.email = email
  formlist.value.gender = gender
  formlist.value.avatar = avatar
  formlist.value.is_disabled = is_disabled
}
// 手动新增员工
// const addStaff = async () => {
//   const res = await createStaff(formlist.value)
//   if (res?.code === HttpCode.SUCCESS) {
//     $toast.success('创建成功')
//     dialogShow.value = true
//   }
//   else {
//     $toast.error(res?.message || '创建失败')
//   }
// }

const submitEdit = async () => {
//   await updateStaff(formlist.value)
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
    formlist.value.avatar = url
    onfinish?.()
  }
  catch {
    $toast.error('上传失败，请重试')
  }
}
</script>

<template>
  <div class="grid-12 gap-[16px] p-[16px]">
    <div class="col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
      <staff-manage-edit
        ref="addRef"
        v-model="formlist"
        :get-store-list="getStoreList"
        :get-region-list="getRegionList"
        :filed="filterListToArray"
        @submit="submitEdit"
        @upload="uploadFile" />
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
