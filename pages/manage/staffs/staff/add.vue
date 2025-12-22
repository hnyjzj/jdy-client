<script lang="ts" setup>
useSeoMeta({
  title: '新增员工',
})
const { $toast } = useNuxtApp()

const { createStaff, uploadAvatar, getStaffWhere } = useStaff()
const { filterListToArray } = storeToRefs(useStaff())
const { getMyStore } = useStores()
const { myStoreList } = storeToRefs(useStores())
const { getMyRegion } = useRegion()
const { myRegionList } = storeToRefs(useRegion())
const { roleWhereList, roleList } = storeToRefs(useAuthority())
const { getRoleWhere, getRoleList } = useAuthority()
const router = useRouter()
const addRef = ref()
const dialogShow = ref(false)
await getRoleWhere()
await getStaffWhere()
const formlist = ref<addStaffForm>({
  phone: '',
  nickname: '',
  username: '',
  password: '',
  avatar: '',
  email: '',
  leader_name: '',
  gender: 0,
  is_disabled: false,
  store_ids: [],
  store_superior_ids: [],
  region_ids: [],
  region_superior_ids: [],
  store_admin_ids: [],
  region_admin_ids: [],
  identity: UserLevel.IdentityClerk,
  role_id: '',
} as addStaffForm)

const getStoreList = async () => {
  await getMyStore({ has_all: false })
  return myStoreList.value || []
}
const getRegionList = async () => {
  await getMyRegion({ has_all: false })
  return myRegionList.value || []
}

const getroleListFn = async (data: number) => {
  await getRoleList(data)
  return roleList.value || []
}
const continueAdd = () => {
  formlist.value = {
    phone: '',
    nickname: '',
    username: '',
    password: '',
    avatar: '',
    email: '',
    gender: 0,
    leader_name: '',
    is_disabled: false,
    store_ids: [],
    store_superior_ids: [],
    region_ids: [],
    region_superior_ids: [],
    store_admin_ids: [],
    region_admin_ids: [],
    identity: UserLevel.IdentityClerk,
    role_id: '',
  } as addStaffForm
  addRef.value.clearAvatar()
}
const cancelAdd = () => {
  router.go(-1)
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
// 添加头像
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
const formRef = ref()
function handleValidateButtonClick() {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      const res = await createStaff(formlist.value)
      if (res?.code === HttpCode.SUCCESS) {
        $toast.success('创建成功')
        dialogShow.value = true
      }
      else {
        $toast.error(res?.message || '创建失败')
      }
    }
    else {
      $toast.error('验证失败')
    }
  })
}
const manageStores = ref()
// 更新角色
const updateRole = () => {
  manageStores.value.clearSwitch()
  formlist.value.store_ids = []
  formlist.value.store_superior_ids = []
  formlist.value.region_ids = []
  formlist.value.region_superior_ids = []
  formlist.value.store_admin_ids = []
  formlist.value.region_admin_ids = []
}

if (import.meta.client) {
  if (!isWxWorkClient()) {
    navigateTo(`/forbidden?message=请在企业微信环境下操作`, { external: true, replace: true, redirectCode: 200 })
  }
}
</script>

<template>
  <div class="pb-20 p-[16px]">
    <common-layout-center>
      <div>
        <staff-manage-add
          ref="addRef"
          v-model:form="formRef"
          v-model="formlist"
          :filed="filterListToArray"
          :show-botton="false"
          @upload="uploadFile"
        />
        <staff-manage-auth
          v-model:authform="formlist"
          :role-where-list="roleWhereList"
          :getrole-list-fn="getroleListFn"
          :showbutton="false"
          @change-role="updateRole"
        />
        <staff-manage-stores
          ref="manageStores"
          v-model="formlist"
          :get-store-list="getStoreList"
          :get-store-list-all="getStoreList"
          :get-region-list="getRegionList"
          :get-region-list-all="getRegionList"
          :show-button="false"
        />
      </div>
      <common-button-bottom confirm-text="提交保存" :cancle-show="false" @confirm="handleValidateButtonClick" />
    </common-layout-center>
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
