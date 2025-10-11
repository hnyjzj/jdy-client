<script lang="ts" setup>
const { $toast } = useNuxtApp()
useSeoMeta({
  title: '编辑员工',
})

const { uploadAvatar, getStaffWhere, EditStaff } = useStaff()
const { filterListToArray } = storeToRefs(useStaff())
const { getRoleWhere, getRoleList } = useAuthority()
const { roleWhereList, roleList } = storeToRefs(useAuthority())
const { getMyStore } = useStores()
const { myStoreList } = storeToRefs(useStores())
const { getMyRegion } = useRegion()
const { myRegionList } = storeToRefs(useRegion())
const getStoreList = async () => {
  await getMyStore({ has_all: false })
  return myStoreList.value || []
}

const getRegionList = async () => {
  await getMyRegion({ has_all: false })
  return myRegionList.value || []
}

const route = useRoute()

await getRoleWhere()
await getStaffWhere()
const formlist = ref<updateStaffForm>({
  id: '',
  phone: '',
  nickname: '',
  username: '',
  avatar: '',
  email: '',
  gender: 0,
  is_disabled: false,
  store_ids: [],
  store_superior_ids: [],
  region_ids: [],
  region_superior_ids: [],
  store_admin_ids: [],
  region_admin_ids: [],
} as updateStaffForm)

const storeForm = ref<updateRegion>({
  id: '',
  store_ids: [],
  store_superior_ids: [],
  region_ids: [],
  region_superior_ids: [],
  store_admin_ids: [],
  region_admin_ids: [],
  identity: UserLevel.IdentityClerk,
})

const authForm = ref<updateAuthRole>({
  id: '',
  identity: UserLevel.IdentityClerk,
  role_id: '',
  store_ids: [],
  store_superior_ids: [],
  region_ids: [],
  region_superior_ids: [],
  store_admin_ids: [],
  region_admin_ids: [],
})
const defaultform = ref<{ [key: string]: { label: string, value: string }[] }>({
  stores: [],
  stores_superior: [],
  regions: [],
  regions_superior: [],
  store_admin_ids: [],
  region_admin_ids: [],
})

const { getStaffInfo } = useStaff()
const { staffInfo } = storeToRefs(useStaff())
if (route.query.id) {
  await getStaffInfo({ id: route.query.id as string })
  const { leader_name, region_admins, store_admins, nickname, username, phone, email, gender, is_disabled, avatar, id, stores, regions, store_superiors, region_superiors, identity, role_id } = staffInfo.value
  formlist.value.id = id as string
  authForm.value.id = id as string
  storeForm.value.id = id as string
  formlist.value.nickname = nickname
  formlist.value.username = username
  formlist.value.phone = phone
  formlist.value.email = email
  formlist.value.gender = gender
  formlist.value.avatar = avatar
  formlist.value.leader_name = leader_name
  formlist.value.is_disabled = is_disabled
  authForm.value.identity = identity as number
  storeForm.value.identity = identity as number
  authForm.value.role_id = role_id as string
  // 获取所属门店默认数据
  stores?.forEach((item) => {
    defaultform.value.stores.push({ label: item.alias || item.name, value: item.id })
    formlist.value.store_ids?.push(item.id)
    authForm.value.store_ids?.push(item.id)
    storeForm.value.store_ids?.push(item.id)
  })

  // 获取所属区域默认数据
  regions?.forEach((item) => {
    defaultform.value.regions.push({ label: item.alias || item.name, value: item.id })
    formlist.value.region_ids?.push(item.id)
    authForm.value.region_ids?.push(item.id)
    storeForm.value.region_ids?.push(item.id)
  })

  // 获取负责门店数据
  store_superiors?.forEach((item) => {
    defaultform.value.stores_superior.push({ label: item.alias || item.name, value: item.id })
    formlist.value.store_superior_ids?.push(item.id)
    authForm.value.store_superior_ids?.push(item.id)
    storeForm.value.store_superior_ids?.push(item.id)
  })
  // 获取负责区域数据
  region_superiors?.forEach((item) => {
    defaultform.value.regions_superior.push({ label: item.alias || item.name, value: item.id })
    defaultform.value.regions_superior.push({ label: item.alias, value: item.id })
    formlist.value.region_superior_ids?.push(item.id)
    authForm.value.region_superior_ids?.push(item.id)
    storeForm.value.region_superior_ids?.push(item.id)
  })
  // 获取门店管理
  store_admins?.forEach((item) => {
    defaultform.value.store_admin_ids.push({ label: item.alias || item.name, value: item.id })
    formlist.value.store_admin_ids?.push(item.id)
    authForm.value.store_admin_ids?.push(item.id)
    storeForm.value.store_admin_ids?.push(item.id)
  })
  // 获取区域管理
  region_admins?.forEach((item) => {
    defaultform.value.region_admin_ids.push({ label: item.alias || item.name, value: item.id })
    formlist.value.region_admin_ids?.push(item.id)
    authForm.value.region_admin_ids?.push(item.id)
    storeForm.value.region_admin_ids?.push(item.id)
  })
}

const submitEdit = async () => {
  const res = await EditStaff(formlist.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('编辑成功')
  }
  else {
    $toast.error(res?.message || '编辑失败')
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
    formlist.value.avatar = url
    onfinish?.()
  }
  catch {
    $toast.error('上传失败，请重试')
  }
}

const submitEditRole = async () => {
  const res = await EditStaff(authForm.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('权限修改成功')
  }
  else {
    $toast.error(res?.message || '权限修改失败')
  }
}
const submitEditStore = async () => {
  const res = await EditStaff(storeForm.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('分配成功')
  }
  else {
    $toast.error(res?.message || '分配修改失败')
  }
}
const manageStores = ref()
const changeRoleFn = () => {
  manageStores.value.clearSwitch()
  storeForm.value.identity = authForm.value.identity
  storeForm.value.store_ids = []
  storeForm.value.store_superior_ids = []
  storeForm.value.region_ids = []
  storeForm.value.region_superior_ids = []
  storeForm.value.store_admin_ids = []
  storeForm.value.region_admin_ids = []
}

const getroleListFn = async (data: number) => {
  await getRoleList(data)
  return roleList.value || []
}
</script>

<template>
  <div class="grid-12 gap-[16px] p-[16px]">
    <div class="col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
      <staff-manage-edit
        v-model="formlist"
        :filed="filterListToArray"
        @submit="submitEdit"
        @upload="uploadFile"
      />
      <staff-manage-auth
        v-model:authform="authForm"
        :role-where-list="roleWhereList"
        :getrole-list-fn="getroleListFn"
        @update-role="submitEditRole"
        @change-role="changeRoleFn"
      />
      <staff-manage-stores
        ref="manageStores"
        v-model="storeForm"
        v-model:default-form="defaultform"
        :get-store-list="getStoreList"
        :get-store-list-all="getStoreList"
        :get-region-list="getRegionList"
        :get-region-list-all="getRegionList"
        @submit="submitEditStore"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
