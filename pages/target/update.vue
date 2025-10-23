<script lang="ts" setup>
const {
  getTargetWhere,
  getGroupWhere,
  getPersonalWhere,
  updateTarget,
  getTargetInfo,
  createTargetGroup,
  createTargetPersonal,
  updateTargetPersonal,
  deleteTargetGroup,
  deleteTargetPersonal,
} = useTarget()
const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { targetFilterListToArray, groupFilterListToArray, personalFilterListToArray, targetInfo } = storeToRefs(useTarget())

const route = useRoute()
const { $toast } = useNuxtApp()
const isAddModel = ref(false)
useSeoMeta({
  title: '编辑销售目标',
})

const datas = ref({} as Partial<ExpandPage<any>>)
const personalDatas = ref({} as TargetPersonal)
const personalList = ref([] as TargetPersonal[])
/** 分组名称 */
const groupName = ref()
/** 新增分组员工 暂存分组id */
const addGroupId = ref()
/** 编辑 / 添加 */
const isUpdate = ref(false)
const formRef = ref()

/** 获取可选员工 */
const getAvailableOptions = () => {
  const staffed = targetInfo.value.personals?.map(v => v.staff_id)
  return StoreStaffList.value.map(v => ({
    label: v.nickname,
    value: v.id,
    disabled: !!staffed.includes(v.id),
  }))
}

/** 提交表单 */
const handleValidateButtonClick = async () => {
  try {
    await formRef.value?.verify()
  }
  catch {
    return
  }

  const params: any = { store_id: myStore.value.id, ...datas.value }
  params.id = route.query.id as string

  const res = await updateTarget(params)

  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('更新成功')
    setTimeout(() => jump('/target/list'), 2000)
  }
  else {
    $toast.error(res?.message ?? '更新失败')
  }
}

/** 获取员工列表 */
async function getStoreStaffListFun() {
  const res = await getStoreStaffList({ id: myStore.value.id })
  if (res)
    $toast.error(res?.data.value?.message || '获取员工列表失败')
}

/** 获取目标信息 回显 */
function setDefault() {
  targetFilterListToArray.value.forEach((item) => {
    if (item.create) {
      datas.value[item.name] = targetInfo.value[item.name]
    }
  })
}

/**
 * 添加员工
 */
function addStaffFun(group: TargetGroup) {
  addGroupId.value = group.id
  isAddModel.value = true
  isUpdate.value = false
  personalDatas.value = {} as TargetPersonal
}
function addOneStaffFun() {
  isAddModel.value = true
  isUpdate.value = false
  personalDatas.value = {} as TargetPersonal
}

/** 新增分组 */
const addGroup = async () => {
  if (!groupName.value)
    return $toast.error('请输入分组名称')
  const params = { target_id: targetInfo.value.id, name: groupName.value } as TargetGroup
  const res = await createTargetGroup(params)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('新增分组成功')
    await getTargetInfo(route.query.id as string)
    await setDefault()
  }
  else {
    $toast.error(res?.message ?? '新增分组失败')
  }
}

/** 删除分组 */
const deleteGroupFun = async (group: TargetGroup) => {
  if (!group.id)
    return
  const res = await deleteTargetGroup(group.id)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('删除成功')
    await getTargetInfo(route.query.id as string)
    await setDefault()
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
}

/**
 * 删除个人目标
 */
async function deleteStaff(personal: TargetPersonal) {
  if (!personal.id)
    return
  const res = await deleteTargetPersonal(personal.id)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('删除成功')
    await getTargetInfo(route.query.id as string)
    await setDefault()
  }
  else {
    $toast.error(res?.message ?? '删除失败')
  }
}

/** 更新员工个人目标 */
async function updataPersonalFun(personal: TargetPersonal) {
  personalDatas.value = personal
  isAddModel.value = true
  isUpdate.value = true
}

async function submitGoods() {
  personalDatas.value.target_id = targetInfo.value.id
  if (targetInfo.value.object === 1) {
    personalDatas.value.group_id = addGroupId.value
  }
  let res
  if (isUpdate.value) {
    res = await updateTargetPersonal(personalDatas.value)
  }
  else {
    res = await createTargetPersonal(personalDatas.value)
  }
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success(isUpdate.value ? '更新成功' : '添加成功')
    personalDatas.value = {} as TargetPersonal
    isAddModel.value = false
    await getTargetInfo(route.query.id as string)
    await setDefault()
  }
  else {
    $toast.error(res?.message ?? (isUpdate.value ? '更新失败' : '添加失败'))
  }
}

/** 页面初始化 */
if (route.query.id) {
  await getTargetInfo(route.query.id as string)
  await getTargetWhere()
  await getGroupWhere()
  await getPersonalWhere()
  await getStoreStaffListFun()
  await setDefault()
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-4 pb-22">
        <div class="flex flex-col">
          <div class="gap-2">
            <common-gradient title="编辑销售目标">
              <template #body>
                <common-filter-add
                  ref="formRef"
                  v-model:data="datas"
                  :filter="targetFilterListToArray"
                  disable-conditions="update"
                />
                <common-button-rounded content="更新销售目标" @button-click="handleValidateButtonClick" />
              </template>
            </common-gradient>
            <common-gradient title="编辑分组">
              <template #body>
                <template v-if="targetInfo.object === 1">
                  <div class="flex items-center my-2 gap-4">
                    <div>
                      <n-input v-model:value="groupName" clearable placeholder="输入分组名称" round />
                    </div>
                    <n-button tertiary type="success" size="small" @click="addGroup()">
                      添加分组
                    </n-button>
                  </div>
                  <div v-for="(group, gIndex) in targetInfo.groups" :key="gIndex" class="mb-4">
                    <div class="flex justify-between items-center">
                      <template v-if="datas.object === 1">
                        <template v-for="({ label, find }, index) in groupFilterListToArray" :key="index">
                          <template v-if="find">
                            <div class="flex items-center">
                              <div class="mr-2">
                                {{ label }}
                              </div>
                            </div>
                          </template>
                        </template>
                        <div class="flex gap-2 pl-2">
                          <n-button tertiary type="info" size="small" @click="addStaffFun(group)">
                            添加员工
                          </n-button>
                          <n-button tertiary type="error" size="small" @click="deleteGroupFun(group)">
                            删除分组
                          </n-button>
                        </div>
                      </template>
                    </div>

                    <table class="table-center w-full mt-2" style="border:1px solid #eee;">
                      <thead>
                        <tr class="row bg-gray-200">
                          <template v-for="({ label, find }, index) in personalFilterListToArray" :key="index">
                            <template v-if="find">
                              <th class="px-4 py-2 text-left">
                                {{ label }}
                              </th>
                            </template>
                          </template>
                          <th class="px-4 py-2 text-left">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-if="personalList">
                          <template v-for="(personal, pIndex) in targetInfo.personals" :key="pIndex">
                            <template v-if="personal.group_id === group.id">
                              <tr>
                                <template v-for="({ name, input, find }, index) in personalFilterListToArray" :key="index">
                                  <template v-if="find">
                                    <td class="px-1 py-2">
                                      <template v-if="name === 'staff_id'">
                                        {{ personal.staff.nickname }}
                                      </template>
                                      <template v-else>
                                        <template v-if="input === 'text'">
                                          {{ personal[name] }}
                                        </template>
                                        <template v-if="input === 'switch'">
                                          {{ personal[name] ? '是' : '否' }}
                                        </template>
                                      </template>
                                    </td>
                                  </template>
                                </template>
                                <td class="px-4 py-2 flex">
                                  <n-button class="mr" type="warning" size="small" @click="updataPersonalFun(personal)">
                                    编辑
                                  </n-button>
                                  <n-button type="error" size="small" @click="deleteStaff(personal)">
                                    删除
                                  </n-button>
                                </td>
                              </tr>
                            </template>
                          </template>
                        </template>
                        <template v-else>
                          <tr>
                            <td :colspan="personalFilterListToArray.filter(item => item.find).length + 1" class="text-center py-6">
                              暂无数据
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </template>
                <template v-else>
                  <n-button tertiary type="info" size="small" class="my-2" @click="addOneStaffFun">
                    添加员工
                  </n-button>
                  <table class="table-center w-full mt-2" style="border:1px solid #eee">
                    <thead>
                      <tr class="row bg-gray-200">
                        <template v-for="({ label, find }, index) in personalFilterListToArray" :key="index">
                          <template v-if="find">
                            <th class="px-4 py-2 text-left">
                              {{ label }}
                            </th>
                          </template>
                        </template>
                        <th class="px-4 py-2 text-left">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-if="targetInfo.personals?.length">
                        <tr v-for="(personal, pIndex) in targetInfo.personals" :key="pIndex">
                          <template v-for="({ name, input, find }, index) in personalFilterListToArray" :key="index">
                            <template v-if="find">
                              <td class="px-1 py-2">
                                <template v-if="name === 'staff_id'">
                                  {{ personal.staff.nickname }}
                                </template>
                                <template v-else>
                                  <template v-if="input === 'text'">
                                    {{ personal[name] }}
                                  </template>
                                  <template v-if="input === 'switch'">
                                    {{ personal[name] ? '是' : '否' }}
                                  </template>
                                </template>
                              </td>
                            </template>
                          </template>
                          <td class="px-4 py-2">
                            <n-button class="mr" type="warning" size="small" @click="updataPersonalFun(personal)">
                              编辑
                            </n-button>
                            <n-button type="error" size="small" @click="deleteStaff(personal)">
                              删除
                            </n-button>
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <tr>
                          <td :colspan="personalFilterListToArray.filter(item => item.find).length + 1" class="py-6">
                            暂无数据
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </template>
              </template>
            </common-gradient>
          </div>
        </div>
      </div>
    </common-layout-center>
    <common-model v-model="isAddModel" :title="isUpdate ? '更新' : '添加'" :show-ok="true" :confirm-text="isUpdate ? '确认更新' : '确认添加'" @confirm="submitGoods">
      <div>
        <common-filter-add
          ref="formRef"
          v-model:data="personalDatas"
          :filter="personalFilterListToArray"
        >
          <template #info="{ info }">
            <template v-if="info.name === 'staff_id'">
              <n-select
                v-model:value="personalDatas.staff_id"
                placeholder="请选择员工"
                clearable
                :options="getAvailableOptions()"
                size="large"
                remote
                :disabled="isUpdate"
                @focus="getStoreStaffListFun"
              />
            </template>
          </template>
        </common-filter-add>
      </div>
    </common-model>
  </div>
</template>

<style scoped lang="scss">
.table-center {
  th,
  td {
    text-align: center;
    vertical-align: middle;
  }
}
</style>
