<script lang="ts" setup>
const { $toast } = useNuxtApp()
useSeoMeta({
  title: '编辑员工',
})

const { uploadAvatar, getStaffWhere, EditStaff } = useStaff()
const { filterListToArray } = storeToRefs(useStaff())
const { getRoleWhere, getRoleList } = useAuthority()
const { roleWhereList, roleList } = storeToRefs(useAuthority())
const { staffGetStoreList, staffGetStoreListAll } = useStores()
const { staffGetRegionList, staffGetRegionListAll } = useRegion()
const getStoreList = async (query: string) => {
  const res = await staffGetStoreList({ page: 1, limit: 10, where: { name: query } })
  return res || []
}
const searchStoresAll = async () => {
  const res = await staffGetStoreListAll()
  return res || []
}
const getRegionList = async (query: string) => {
  const res = await staffGetRegionList({ page: 1, limit: 10, where: { name: query } })
  return res || []
}
const getRegionListAll = async () => {
  const res = await staffGetRegionListAll()
  return res || []
}
const route = useRoute()

const dialogShow = ref(false)
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
} as updateStaffForm)

const storeForm = ref<updateRegion>({
  id: '',
  store_ids: [],
  store_superior_ids: [],
  region_ids: [],
  region_superior_ids: [],
})
const parsswordForm = ref<updatePassword>({
  id: '',
  password: '',
  store_ids: [],
  store_superior_ids: [],
  region_ids: [],
  region_superior_ids: [],
})
const authForm = ref<updateAuthRole>({
  id: '',
  identity: 1,
  role_id: '',
  store_ids: [],
  store_superior_ids: [],
  region_ids: [],
  region_superior_ids: [],
})
const defaultform = ref<{ [key: string]: { label: string, value: string }[] }>({
  stores: [],
  stores_superior: [],
  regions: [],
  regions_superior: [],
})

const { getStaffInfo } = useStaff()
const { staffInfo } = storeToRefs(useStaff())
if (route.query.id) {
  await getStaffInfo({ id: route.query.id as string })
  const { nickname, username, phone, email, gender, is_disabled, avatar, id, stores, regions, store_superiors, region_superiors, identity, role_id } = staffInfo.value
  formlist.value.id = id as string
  parsswordForm.value.id = id as string
  authForm.value.id = id as string
  storeForm.value.id = id as string
  formlist.value.nickname = nickname
  formlist.value.username = username
  formlist.value.phone = phone
  formlist.value.email = email
  formlist.value.gender = gender
  formlist.value.avatar = avatar
  formlist.value.is_disabled = is_disabled
  authForm.value.identity = identity as number
  authForm.value.role_id = role_id as string
  // 获取所属门店默认数据
  stores?.forEach((item) => {
    defaultform.value.stores.push({ label: item.name, value: item.id })
    formlist.value.store_ids?.push(item.id)
    parsswordForm.value.store_ids?.push(item.id)
    authForm.value.store_ids?.push(item.id)
    storeForm.value.store_ids?.push(item.id)
  })

  // 获取所属区域默认数据
  regions?.forEach((item) => {
    defaultform.value.regions.push({ label: item.name, value: item.id })
    formlist.value.region_ids?.push(item.id)
    parsswordForm.value.region_ids?.push(item.id)
    authForm.value.region_ids?.push(item.id)
    storeForm.value.region_ids?.push(item.id)
  })

  // 获取负责门店数据
  store_superiors?.forEach((item) => {
    defaultform.value.stores_superior.push({ label: item.name, value: item.id })
    formlist.value.store_superior_ids?.push(item.id)
    parsswordForm.value.store_superior_ids?.push(item.id)
    authForm.value.store_superior_ids?.push(item.id)
    storeForm.value.store_superior_ids?.push(item.id)
  })
  // 获取负责区域数据
  region_superiors?.forEach((item) => {
    defaultform.value.regions_superior.push({ label: item.name, value: item.id })
    formlist.value.region_superior_ids?.push(item.id)
    parsswordForm.value.region_superior_ids?.push(item.id)
    authForm.value.region_superior_ids?.push(item.id)
    storeForm.value.region_superior_ids?.push(item.id)
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

const continueEdit = async () => {
  const res = await EditStaff(parsswordForm.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('密码修改成功')
  }
  else {
    $toast.error(res?.message || '修改失败')
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
      <staff-manage-stores
        v-model="storeForm"
        v-model:default-form="defaultform"
        :get-store-list="getStoreList"
        :get-store-list-all="searchStoresAll"
        :get-region-list="getRegionList"
        :get-region-list-all="getRegionListAll"
        @submit="submitEditStore"
      />
      <staff-manage-auth
        v-model:authform="authForm"
        :role-where-list="roleWhereList"
        :getrole-list-fn="getroleListFn"
        @update-role="submitEditRole"
      />
      <staff-manage-password
        v-model:password="parsswordForm"
        @edit-pawd="dialogShow = true"
      />
    </div>

    <common-confirm
      v-model:show="dialogShow"
      title="提示"
      text="确定修改此员工密码?"
      icon="warning "
      cancel-text="否"
      confirm-text="是"
      @submit="continueEdit"
      @cancel="dialogShow = false"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
