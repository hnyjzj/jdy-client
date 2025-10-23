<script lang="ts" setup>
const {
  getTargetWhere,
  getGroupWhere,
  getPersonalWhere,
  updateTarget,
  getTargetInfo,
  createTargetGroup,
  createTargetPersonal,
  updateTargetGroup,
  updateTargetPersonal,
  deleteTarget,
  deleteTargetGroup,
  deleteTargetPersonal,
} = useTarget()
const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { targetFilterListToArray, groupFilterListToArray, personalFilterListToArray, targetInfo } = storeToRefs(useTarget())

const route = useRoute()
const { $toast } = useNuxtApp()

useSeoMeta({
  title: '编辑销售目标',
})

const datas = ref({} as Partial<ExpandPage<any>>)
const groupList = ref<Record<string, any>[]>([])
const personalDatas = ref()
const formRef = ref()

/** 新增分组 */
const addGroup = () => {
  groupList.value.push({ id: String(groupList.value.length + 1) })
  personalDatas.value.push([])
}

/** 新增员工 */
/** 新增员工（健壮版） */
const addEmployee = (gIndex = 0) => {
  // 确保 personalDatas 是二维数组
  if (!Array.isArray(personalDatas.value)) {
    personalDatas.value = []
  }

  // 确保该分组数组存在
  if (!Array.isArray(personalDatas.value[gIndex])) {
    // 如果 gIndex 超出当前长度，先补齐空数组
    for (let i = personalDatas.value.length; i <= gIndex; i++) {
      personalDatas.value[i] = []
    }
  }

  // 如果是分组模式，确保分组名已填写（原有校验）
  if (datas.value.object === 1 && groupList.value[gIndex] && !groupList.value[gIndex].name) {
    return $toast.error('请先填写分组名称')
  }

  // 推入一个新的空人员对象，带 group_id
  const groupId = (groupList.value[gIndex] && groupList.value[gIndex].id) ? String(groupList.value[gIndex].id) : String(gIndex + 1)
  personalDatas.value[gIndex].push({
    group_id: groupId,
    // 其他默认字段可以在这里初始化，如 staff_id: null, is_leader: false,...
  })
}

/** 删除员工 */
const deleteEmployee = (gIndex: number, pIndex: number) => {
  personalDatas.value[gIndex].splice(pIndex, 1)
}

/** 删除分组 */
const deleteGroup = (gIndex: number) => {
  groupList.value.splice(gIndex, 1)
  personalDatas.value.splice(gIndex, 1)
}

/** 单选开关处理 */
const handleSwitchChange = (gIndex: number, pIndex: number, fieldName: string, value: boolean) => {
  if (value) {
    personalDatas.value[gIndex].forEach((personal, idx) => {
      if (idx !== pIndex)

        personal[fieldName] = false
    })
  }
  personalDatas.value[gIndex][pIndex][fieldName] = value
}

/** 获取可选员工 */
const getAvailableOptions = () => {
  const staffed = personalDatas.value.flat().map(v => v.staff_id)
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

  if (datas.value.object === 1) {
    params.groups = groupList.value
    params.personals = personalDatas.value.flat()
  }
  else {
    params.personals = personalDatas.value.flat()
  }
  params.id = route.query.id as string
  console.log(111, params)

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
function setDefault() {
  if (targetInfo.value.object === 1) {
  // 回显分组列表
    groupList.value = targetInfo.value.groups?.length ? targetInfo.value.groups : [{ id: '1' }]

    // 回显员工数据，按分组分配
    personalDatas.value = groupList.value.map(g =>
      targetInfo.value.personals?.filter((p: any) => p.group_id === g.id) || [],
    )
  }
  else {
    personalDatas.value = targetInfo.value.personals
  }

  // 回显 filter 表单项
  targetFilterListToArray.value.forEach((item) => {
    if (item.create) {
      datas.value[item.name] = targetInfo.value[item.name]
    }
  })
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
        <div class="flex flex-col gap-4">
          <div class="rounded-6 bg-white w-auto blur-bga">
            <common-gradient title="编辑销售目标">
              <template #body>
                <common-filter-add
                  ref="formRef"
                  v-model:data="datas"
                  :filter="targetFilterListToArray"
                  disable-conditions="update"
                />
                <template v-if="datas.object === 1">
                  <n-button type="info" size="small" class="my-2" @click="addGroup">
                    添加分组
                  </n-button>
                </template>

                <template v-if="targetInfo.object === 1">
                  <div v-for="(group, gIndex) in groupList" :key="group.id" class="mb-4">
                    <div class="flex justify-between items-center">
                      <template v-if="datas.object === 1">
                        <template v-for="({ label, input, name, find }, index) in groupFilterListToArray" :key="index">
                          <template v-if="find">
                            <div class="flex items-center">
                              <div class="mr-2">
                                {{ label }}
                              </div>
                              <template v-if="input === 'text'">
                                <div class="flex-1">
                                  <n-input v-model:value="groupList[gIndex][name as string]" clearable :placeholder="`输入${label}`" round />
                                </div>
                              </template>
                            </div>
                          </template>
                        </template>
                        <div class="flex gap-2 pl-2">
                          <n-button type="info" size="small" @click="addEmployee(gIndex)">
                            添加员工
                          </n-button>
                          <n-button type="error" size="small" @click="deleteGroup(gIndex)">
                            删除分组
                          </n-button>
                        </div>
                      </template>
                    </div>

                    <table class="w-full mt-2" style="border:1px solid #eee">
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
                        <template v-if="personalDatas[gIndex]?.length">
                          <tr v-for="(personal, pIndex) in personalDatas[gIndex]" :key="pIndex">
                            <template v-for="({ name, label, input, find }, index) in personalFilterListToArray" :key="index">
                              <template v-if="find">
                                <td class="px-1 py-2">
                                  <template v-if="input === 'search'">
                                    <n-select
                                      v-model:value="personal[name as string]"
                                      :placeholder="`请输入${label}`"
                                      :options="getAvailableOptions()"
                                      clearable
                                      size="large"
                                      remote
                                      @focus="getStoreStaffListFun"
                                    />
                                  </template>
                                  <template v-if="input === 'text'">
                                    <n-input v-model:value="personal[name as string]" :placeholder="`${label}`" />
                                  </template>
                                  <template v-if="input === 'switch'">
                                    <n-switch
                                      :value="personal[name as string]"
                                      round
                                      @update:value="handleSwitchChange(gIndex, pIndex, name, $event)"
                                    />
                                  </template>
                                </td>
                              </template>
                            </template>
                            <td class="px-4 py-2">
                              <n-button type="error" size="small" @click="deleteEmployee(gIndex, pIndex)">
                                删除
                              </n-button>
                            </td>
                          </tr>
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
                  <n-button type="info" size="small" class="my-2" @click="personalDatas.push({} as any)">
                    添加员工
                  </n-button>
                  <table class="w-full mt-2" style="border:1px solid #eee">
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
                      <template v-if="personalDatas?.length">
                        <tr v-for="(personal, pIndex) in personalDatas" :key="pIndex">
                          <template v-for="({ name, label, input, find }, index) in personalFilterListToArray" :key="index">
                            <template v-if="find">
                              <td class="px-1 py-2">
                                <template v-if="input === 'search'">
                                  <n-select
                                    v-model:value="personal[name as string]"
                                    :placeholder="`请输入${label}`"
                                    :options="getAvailableOptions()"
                                    clearable
                                    size="large"
                                    remote
                                    @focus="getStoreStaffListFun"
                                  />
                                </template>
                                <template v-if="input === 'text'">
                                  <n-input v-model:value="personal[name as string]" :placeholder="`${label}`" />
                                </template>
                                <template v-if="input === 'switch'">
                                  <n-switch
                                    :value="personal[name as string]"
                                    round
                                    @update:value="handleSwitchChange(0, pIndex, name, $event)"
                                  />
                                </template>
                              </td>
                            </template>
                          </template>
                          <td class="px-4 py-2">
                            <n-button type="error" size="small" @click="personalDatas.splice(pIndex, 1)">
                              删除
                            </n-button>
                          </td>
                        </tr>
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
                </template>
              </template>
            </common-gradient>
          </div>
        </div>
      </div>
    </common-layout-center>

    <div class="fixed bottom-0 left-0 w-full py-4 blur-bgc px-8" uno-sm="px-0">
      <common-layout-center>
        <common-button-rounded content="更新销售目标" @button-click="handleValidateButtonClick" />
      </common-layout-center>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.row {
  :first-child {
    min-width: 120px;
  }
}
</style>
