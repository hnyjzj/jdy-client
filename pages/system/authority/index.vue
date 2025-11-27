<script lang="ts" setup>
const { roleList, apiList, roleInfo, roleWhereList } = storeToRefs(useAuthority())
const { getRoleWhere, getRoleList, addRole, getRoleInfo, getApiList, updateStaff, deleteRole, editRole, copyRole } = useAuthority()
const { workBenchList } = storeToRefs(useWorkbenche())
const { getWorkbenchList } = useWorkbenche()
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
/** 当前身份id */
const activeTab = ref()
/** 确认框显隐 */
const confirmShow = ref(false)
/** 倒计时框 */
const countdownShow = ref(false)
async function getRoleListFun() {
  const keys = Object.keys(roleWhereList.value)
  if (keys.length && !activeTab.value) {
    activeTab.value = keys[0]
    await getRoleListFun()
    await getRoleList(Number(activeTab.value))
    await changeDeffault()
    await getInfo()
  }
}

/** 角色二 */
function changeDeffault() {
  roleList.value.forEach((item: Roles, index: number) => {
    if (item.is_default) {
      selectRole.value = index
    }
  })
}
onMounted(async () => {
  /** 初始化请求 */
  await getRoleListFun()
})

/** 权限 */
await getApiList()
/** 工作台 */
await getWorkbenchList()
/** 角色列表 */
await getRoleWhere()

const handleTabChange = async () => {
  await getRoleList(Number(activeTab.value))
  await changeDeffault()
  await getInfo()
}

async function getInfo() {
  await getRoleInfo(roleList.value[selectRole.value]?.id)
  funSelectIds.value = []
  apiSelectIds.value = []
  const funids = roleInfo.value?.routers?.map((item: any) => item.id)
  const apiids = roleInfo.value?.apis?.map((item: any) => item.id)
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
}

const roleParams = ref({} as RolesParams)

const navItems = ref(['工作台入口', '权限'])
const setActive = (index: number) => {
  activeIndex.value = index
}
const modelStatus = ref()
async function oppeAddRole(is: string) {
  /** 添加时删除回显 */
  if (is === 'add') {
    roleParams.value.name = ''
    roleParams.value.desc = ''
    roleParams.value.is_default = false
    delete roleParams.value.id
  }
  modelStatus.value = is
  isAddModel.value = true
}

/** 添加用户组 */
async function addRoleFun() {
  roleParams.value.identity = Number(activeTab.value)
  const res = await addRole(roleParams.value)
  if (res?.code === 200) {
    funSelectIds.value = []
    apiSelectIds.value = []
    isAddModel.value = false
    await getRoleList(Number(activeTab.value))
    selectRole.value = 0
    return $toast.success('添加成功')
  }
  $toast.error(res?.message || '添加失败')
}
const editRoleInfo = ref()
/** 编辑用户组 */
async function editRoleFun() {
  roleParams.value.identity = Number(activeTab.value)

  const res = await editRole(roleParams.value)
  if (res?.code === 200) {
    isAddModel.value = false
    await getRoleList(Number(activeTab.value))
    return $toast.success('更新成功')
  }
  $toast.error(res?.message || '更新失败')
}

function edit(role: Roles) {
  /** 回显 */
  roleParams.value.name = role.name
  roleParams.value.desc = role.desc
  roleParams.value.is_default = role.is_default
  roleParams.value.id = role.id
  editRoleInfo.value = role
  oppeAddRole('edit')
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
    await getRoleList(Number(activeTab.value))
    await changeDeffault()
    await getInfo()
    return $toast.success('删除成功')
  }
  $toast.error(res?.message || '删除失败')
}

/** 确认提交更正 */
async function saveFun() {
  const params = {
    id: roleList.value[selectRole.value].id,
    apis: apiSelectIds.value,
    routers: funSelectIds.value,
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

function omit(obj: any, keyToRemove: string) {
  const { [keyToRemove]: _, ...rest } = obj
  return rest
}

async function copyFun(role: Roles) {
  isAddModel.value = true
  roleParams.value.name = `${role.name}(副本)`
  roleParams.value.desc = role.desc
  roleParams.value.is_default = false
  roleParams.value.id = role.id
  modelStatus.value = 'copy'
}

async function copy() {
  /** 复制不传identity */
  const params = omit(roleParams.value, 'identity')
  const res = await copyRole(params)
  if (res?.code === 200) {
    funSelectIds.value = []
    apiSelectIds.value = []
    isAddModel.value = false
    selectRole.value = 0
    await getRoleList(Number(activeTab.value))
    await getInfo()
    return $toast.success('复制成功')
  }
  $toast.error(res?.message || '复制失败')
}

async function submitModel() {
  switch (modelStatus.value) {
    case 'add':
      addRoleFun()
      break
    case 'edit':
      editRoleFun()
      break
    case 'copy':
      await copy()
      break
  }
}

function GetModelStatusText() {
  switch (modelStatus.value) {
    case 'add':
      return '添加角色'
    case 'edit':
      return '编辑角色'
    case 'copy':
      return '复制角色'
    default:
      return ''
  }
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="px-4 pt-6">
        <common-card-info :title="`权限组（${roleList.length}）`">
          <template #info>
            <n-tabs v-model:value="activeTab" type="line" animated @update:value="handleTabChange">
              <template v-for="(item, id, t) in roleWhereList" :key="t">
                <n-tab-pane :name="id" :tab="item">
                  <div class="grid grid-cols-2 gap-4">
                    <template v-for="(role, index) in roleList" :key="index">
                      <div class="user-box mb-3 flex flex-col justify-between" :class="selectRole === index ? 'select-role' : ''" @click="selectRole = index;getInfo()">
                        <div class="flex justify-between">
                          <div>
                            <div class="text-[16px]">
                              {{ role.name }}
                            </div>
                            <div class="text-[12px] text-[#666666] flex">
                              {{ role.desc }}
                            </div>
                          </div>
                          <template v-if="role.is_default">
                            <div class="shrink-1">
                              <div class="text-[12px] text-[#666666] bg-[rgba(230,230,232,1)] px-1 rounded-[2px]">
                                默认
                              </div>
                            </div>
                          </template>
                        </div>
                        <div class="mt-4 flex justify-between items-center">
                          <div class="flex items-center">
                            <div class="text-[12px] text-[#666666] bg-[rgba(230,230,232,1)] px-1 rounded-[2px] mr-2" @click.stop="copyFun(role)">
                              复制
                            </div>
                            <div class="cursor-pointer" @click.stop="edit(role)">
                              <Icon name="i-icon:edit" color="" :size="16" />
                            </div>
                          </div>
                          <template v-if="!role.is_default">
                            <div class="cursor-pointer" @click.stop="delRoleFun(role.id, role.name)">
                              <Icon name="i-icon:delete" color="red" :size="14" />
                            </div>
                          </template>
                        </div>
                      </div>
                    </template>
                  </div>
                </n-tab-pane>
              </template>
            </n-tabs>
            <div class="text-center cursor-pointer pt-4" @click="oppeAddRole('add')">
              + 添加用户组
            </div>
          </template>
        </common-card-info>
        <div class="h-4" />
        <div class="pb-20">
          <common-card-info :title="roleList[selectRole]?.name || ''">
            <template #info>
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
                <authority-transfer v-model="funSelectIds" :list="workBenchList" />
              </template>
              <template v-else-if="activeIndex === 1">
                <authority-transfer v-model="apiSelectIds" :list="apiList" />
              </template>
            </template>
          </common-card-info>
        </div>
        <common-button-one @confirm="updataFun" />
      </div>
    </common-layout-center>
    <common-model v-model="isAddModel" :title="GetModelStatusText()" :show-ok="true" @confirm="submitModel">
      <div>
        <div class="mb-3">
          <div class="mb-1">
            身份
          </div>
          <n-input
            :value="roleWhereList[activeTab]"
            size="large"
            round
            placeholder="请输入角色名称"
            :disabled="true"
            @focus="focus"
          />
        </div>
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
        <template v-if="modelStatus !== 'copy'">
          <div class="mb-3">
            <div class="mb-1">
              是否默认
            </div>
            <n-switch
              v-model:value="roleParams.is_default"
              round
              @focus="focus"
            />
          </div>
        </template>
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
  color: #0068ff;
}

.select-nav::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  bottom: -5px;
  height: 2px;
  background-color: #0068ff;
}

.select-role {
  background-color: rgba(243, 245, 254, 1);
}
</style>
