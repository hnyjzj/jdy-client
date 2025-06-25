<script lang="ts" setup>
const { roleList, apiList, roleInfo } = storeToRefs(useAuthority())
const { getStoreList } = useStores()
const { storesList } = storeToRefs(useStores())

const { getRoleList, addRole, getRoleInfo, getApiList, addStaff, updateStaff, deleteRole } = useAuthority()
const { getWorkbenchList } = useWorkbenche()
const { workBenchList } = storeToRefs(useWorkbenche())
const { useWxWork } = useWxworkStore()
useSeoMeta({
  title: '权限管理',
})
const { $toast } = useNuxtApp()

const isAddModel = ref(false)
/** 当前选中角色 */
const selectRole = ref(0)
/** 当前选中tab */
const activeIndex = ref(0)
/** 功能区选中id组 */
const funSelectIds = ref<string[]>([])
/** 权限选中id组 */
const apiSelectIds = ref<string[]>([])
/** 门店选中id */
const storeSelectIds = ref<string[]>([])
/** 成员选中id */
const staffSelectIds = ref<string[]>([])

/** 确认框显隐 */
const confirmShow = ref(false)
/** 倒计时框 */
const countdownShow = ref(false)

/** 角色列表 */
await getRoleList()
await getInfo()
/** 权限 */
await getApiList()
await getWorkbenchList()
getStoreList({ page: 1, limit: 30 })

async function getInfo() {
  await getRoleInfo(roleList.value[selectRole.value].id)
  const storeids = roleInfo.value.stores.map((item: any) => item.id)
  const funids = roleInfo.value.routers.map((item: any) => item.id)
  const apiids = roleInfo.value.apis.map((item: any) => item.id)
  const staffsIds = roleInfo.value.staffs.map((item: any) => item.id)
  if (storeids && storeids.length) {
    storeSelectIds.value = storeids
  }
  else {
    storeSelectIds.value = []
  }

  if (funids && funids.length) {
    funSelectIds.value = funids
  }
  else {
    funSelectIds.value = []
  }

  if (apiids && apiids.length) {
    apiSelectIds.value = apiids
  }
  else {
    apiSelectIds.value = []
  }

  if (staffsIds && staffsIds.length) {
    staffSelectIds.value = staffsIds
  }
  else {
    staffSelectIds.value = []
  }
}
const roleParams = ref({
  name: '',
  desc: '',
  is_admin: false,
} as RolesParams)

const navItems = ref(['功能', '权限', '成员', '门店'])
const setActive = (index: number) => {
  activeIndex.value = index
}

async function oppeAddRole() {
  isAddModel.value = true
}

/** 添加用户组 */
async function addRoleFun() {
  const res = await addRole(roleParams.value)
  if (res?.code === 200) {
    isAddModel.value = false
    await getRoleList()
    return $toast.success('添加成功')
  }
  $toast.error(res?.message || '添加失败')
}

const delRoleName = ref('')
const delRoleId = ref('')
/** 删除用户组 */
function delRoleFun(id: string, name: string) {
  delRoleName.value = name
  delRoleId.value = id
  confirmShow.value = true
}

async function delRole() {
  const res = await deleteRole(delRoleId.value)
  if (res?.code === 200) {
    confirmShow.value = false
    await getRoleList()
    return $toast.success('删除成功')
  }
  $toast.error(res?.message || '删除失败')
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
const wxwordAdd = async () => {
  if (!iswx.value) {
    $toast.error('请在企业微信中使用')
    return
  }

  const wx = await useWxWork()
  const users = await wx?.selectPerson()
  addMember(users?.userList)
}

/** 添加成员 */
async function addMember(userList: any) {
  const staffs = userList.map((item: any) => item.id)
  const id = roleList.value[selectRole.value].id
  const res = await addStaff(id, staffs)
  if (res?.code === 200) {
    $toast.success('添加成功')
    await getInfo()
  }
  else {
    $toast.error(res?.message || '添加失败')
  }
}
/** 删除成员 */
async function delMerber(id: string) {
  const staffsArr = roleInfo.value.staffs
  if (!staffsArr)
    return
  const ids = staffsArr.map((item: any) => item.id)
  staffSelectIds.value = ids.filter((item: any) => item !== id)
  await saveFun()
}

const delMerberDebounce = useThrottleFn((id: string) => {
  delMerber(id)
}, 200)

/** 确认提交更正 */
async function saveFun() {
  const params = {
    id: roleList.value[selectRole.value].id,
    apis: apiSelectIds.value,
    routers: funSelectIds.value,
    stores: storeSelectIds.value,
    staffs: staffSelectIds.value,
  } as UpdateAuthParams
  const res = await updateStaff(params)
  if (res?.code === 200) {
    $toast.success('更新成功')
    await getInfo()
  }
  else {
    $toast.error(res?.message || '更新失败')
  }
}

function updataFun() {
  /** 默认权限组更改确认时 增加倒计时确认 */
  if (roleList.value[selectRole.value].is_default) {
    return countdownShow.value = true
  }
  saveFun()
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="px-4 pt-6">
        <common-gradient :title="`权限组（${roleList.length}）`">
          <template #body>
            <div class="grid grid-cols-2 gap-4">
              <template v-for="(item, index) in roleList" :key="index">
                <div class="user-box mb-3" :class="selectRole === index ? 'select-role' : ''" @click="selectRole = index;getInfo()">
                  <div class="text-[16px]">
                    {{ item.name }}
                  </div>
                  <span class="text-[12px] text-[#666666]">{{ item.desc }}</span>
                  <div class="mt-4 flex flex-end cursor-pointer" @click.stop="delRoleFun(item.id, item.name)">
                    <template v-if="item.is_default">
                      默认
                    </template>
                    <div />
                    <Icon name="i-icon:delete" color="red" :size="14" />
                  </div>
                </div>
              </template>
            </div>
            <div class="text-center cursor-pointer" @click="oppeAddRole">
              + 添加用户组
            </div>
          </template>
        </common-gradient>
        <div class="my-4 flex items-center">
          <span class="text-[18px] font-bold">
            {{ roleList[selectRole]?.name || '' }}
          </span>
          <div class="label">
            系统
          </div>
        </div>

        <div class="nav mb-4">
          <div
            v-for="(item, index) in navItems"
            :key="index"
            :class="{ 'select-nav': activeIndex === index }"
            class="nav-item"
            @click="setActive(index)"
          >
            {{ item }}
          </div>
        </div>
        <template v-if="activeIndex === 0">
          <div class="mb-20">
            <authority-fun v-model="funSelectIds" :work-bench-list="workBenchList" />
          </div>
        </template>
        <template v-else-if="activeIndex === 1">
          <div class="mb-20">
            <authority-api v-model="apiSelectIds" :api-list="apiList" />
          </div>
        </template>
        <template v-if="activeIndex === 2">
          <div class="mb-20">
            <div class="flex">
              <template v-for="(item, index) in roleInfo.staffs" :key="index">
                <div class="flex flex-col items-center mr-2">
                  <div class="relative">
                    <img class="rounded-[20px]" :src="item.avatar" alt="widthFix" width="100">
                    <icon class="cursor-pointer absolute top-[-3px] right-[-3px]" name="i-svg:reduce" :size="20" @click="delMerberDebounce(item.id)" />
                  </div>
                  <div>
                    {{ item?.nickname }}
                  </div>
                </div>
              </template>
            </div>
            <div class="text-center mt-4" @click="wxwordAdd">
              + 添加成员
            </div>
          </div>
        </template>
        <template v-if="activeIndex === 3">
          <div class="mb-20">
            <authority-store v-model="storeSelectIds" :stores-list="storesList" />
          </div>
        </template>
        <template v-if="activeIndex !== 2">
          <common-button-one @confirm="updataFun" />
        </template>
      </div>
    </common-layout-center>
    <common-model v-model="isAddModel" title="添加角色" :show-ok="true" @confirm="addRoleFun()">
      <div>
        <div class="mb-3">
          <div class="mb-1">
            角色名称
          </div>
          <n-input
            v-model:value="roleParams.name"
            size="large"
            round
            placeholder="请输入角色名称"
            @focus="focus"
          />
        </div>
        <div class="mb-3">
          <div class="mb-1">
            角色描述
          </div>
          <n-input
            v-model:value="roleParams.desc"
            size="large"
            round
            placeholder="请输入角色描述"
            @focus="focus"
          />
        </div>
        <div class="mb-3">
          <div class="mb-1">
            是否管理员
          </div>
          <n-switch
            v-model:value="roleParams.is_admin"
            round
            @focus="focus"
          />
        </div>
      </div>
    </common-model>
    <common-confirm
      v-model:show="confirmShow"
      title="提示"
      :text="`确定删除当前${delRoleName}权限组?`"
      icon="error"
      cancel-text="否"
      confirm-text="是"
      @submit="delRole"
      @cancel="confirmShow = false"
    />
    <common-confirm
      v-model:show="countdownShow"
      title="提示"
      text="确定更改默认权限组功能?"
      cancel-text="否"
      confirm-text="是"
      :is-countdown="true"
      icon="error"
      @submit="saveFun()"
      @cancel="confirmShow = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.user-box {
  border: 1px solid #ddd7d7;
  --uno: 'rounded-[8px] p-2';
}
.label {
  --uno: 'ml-2 px-[2px] rounded-[2px] bg-[rgba(230,230,232,1)] text-[rgba(128,128,137,1)]';
}

.nav {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 16px;
  padding: 0;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 4px;
}

.nav-item {
  position: relative;
  padding: 8px 0;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  line-height: 1.2;
}

.select-nav {
  color: #007bff;
}

.select-nav::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  bottom: -5px;
  height: 2px;
  background-color: #007bff;
}

.select-role {
  background-color: rgba(243, 245, 254, 1);
}
</style>
