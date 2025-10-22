<script lang="ts" setup>
const { getTargetWhere, getGroupWhere, getPersonalWhere, createTarget } = useTarget()
const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()

const { targetFilterListToArray, groupFilterListToArray, personalFilterListToArray } = storeToRefs(useTarget())
const { $toast } = useNuxtApp()
useSeoMeta({
  title: '新增销售目标',
})
const datas = ref({} as Partial<ExpandPage<any>>)

const groupList = ref<Record<string, any>[]>([])
const personalDatas = ref<(Record<string, any>[])[]>([])

const formRef = ref()

const addGroup = () => {
  groupList.value.push({ id: String(groupList.value.length + 1) })
  personalDatas.value.push([])
}

const addEmployee = (gIndex: number) => {
  if (datas.value.object === 1 && !groupList.value[gIndex].name) {
    return $toast.error('请先填写分组名称')
  }
  personalDatas.value[gIndex].push({ group_id: String(gIndex + 1) })
}

const deleteEmployee = (gIndex: number, pIndex: number) => {
  personalDatas.value[gIndex].splice(pIndex, 1)
}

const deleteGroup = (gIndex: number) => {
  groupList.value.splice(gIndex, 1)
  personalDatas.value.splice(gIndex, 1)
}

const handleSwitchChange = (gIndex: number, pIndex: number, fieldName: string, value: boolean) => {
  if (value) {
    // 如果选中，设置同一分组内其他行的该字段为 false
    personalDatas.value[gIndex].forEach((personal, idx) => {
      if (idx !== pIndex) {
        personal[fieldName] = false
      }
    })
  }
  // 更新当前行
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

async function handleValidateButtonClick() {
  try {
    await formRef.value?.verify()
  }
  catch {
    return
  }
  let params
  if (datas.value.object === 1) {
    params = { store_id: myStore.value.id, ...datas.value, groups: groupList.value, personals: personalDatas.value.flat() }
  }
  else {
    params = { store_id: myStore.value.id, ...datas.value, personals: personalDatas.value.flat() }
  }
  const res = await createTarget(params)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    setTimeout(() => {
      jump('/target/list')
    }, 2000)
  }
  else {
    $toast.error(res?.message ?? '创建失败')
  }
}

/**
 * 设置默认值
 */
function setRadioValues() {
  targetFilterListToArray.value.forEach((item) => {
    if (item.input === 'radio') {
      const keys = Object.keys(item.preset ?? {})
      if (!keys.length)
        return

      const firstKey = keys[0]
      datas.value[item.name] = item.type === 'number' ? Number(firstKey) : firstKey
    }
  })
  groupList.value = [{ id: '1' }]
  personalDatas.value = [[]]
}
async function getStoreStaffListFun() {
  const res = await getStoreStaffList({ id: myStore.value.id })
  if (res) {
    $toast.error(res?.data.value?.message || '获取员工列表失败')
  }
}
onMounted(async () => {
  await getTargetWhere()
  await getGroupWhere()
  await getPersonalWhere()
  await setRadioValues()
})

watchEffect(() => {
  if (datas.value.object === 1) {
    groupList.value = [{ id: '1' }]
    personalDatas.value = [[]]
    personalFilterListToArray.value.forEach((item) => {
      if (item.name === 'is_leader') {
        item.find = true
      }
    })
  }
  else {
    groupList.value = [{ id: '1' }]
    personalDatas.value = [[]]

    personalFilterListToArray.value.forEach((item) => {
      if (item.name === 'is_leader') {
        item.find = false
      }
    })
  }
})
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-4 pb-22">
        <div class="flex flex-col gap-4">
          <div class="rounded-6 bg-white w-auto blur-bga">
            <common-gradient title="新增销售目标">
              <template #body>
                <common-filter-add
                  ref="formRef"
                  v-model:data="datas"
                  :filter="targetFilterListToArray"
                />
                <template v-if="datas.object === 1">
                  <n-button type="info" size="small" class="my-2" @click="addGroup">
                    添加分组
                  </n-button>
                </template>
                <template v-else>
                  <n-button type="info" size="small" class="my-2" @click="addEmployee(0)">
                    添加员工
                  </n-button>
                </template>

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
                                    @focus="(e) => {
                                      getStoreStaffListFun()
                                    }"
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
            </common-gradient>
          </div>
        </div>
      </div>
    </common-layout-center>
    <div class="fixed bottom-0 left-0 w-full py-4 blur-bgc px-8" uno-sm="px-0">
      <common-layout-center>
        <common-button-rounded content="新增销售目标" @button-click="handleValidateButtonClick" />
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
