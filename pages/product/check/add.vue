<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'

const { StoreStaffList, myStore } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { $toast } = useNuxtApp()
const { storesList } = storeToRefs(useStores())
const { getStoreList } = useStores()
const { getCheckWhere, createCheck } = useCheck()
const { checkFilterListToArray, checkFilterList } = storeToRefs(useCheck())

const router = useRouter()
useSeoMeta({
  title: '新增盘点单',
})
const formRef = ref<FormInst | null>(null)
const rules = ref<FormRules>({})

function forRules() {
  checkFilterListToArray.value.forEach((item) => {
    if (item.required) {
      if (item.input === 'text') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
        }
      }
      if (item.input === 'select') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请选择${item.label}`,
          type: 'number',
        }
      }
    }
  })
}

/** 门店选择列表 */
const storeCol = ref()
function changeStore() {
  storeCol.value = []
  storesList.value.forEach((item: Stores) => {
    storeCol.value.push({ label: item.name, value: item.id })
  })
}
await getCheckWhere()
await getStoreList({ page: 1, limit: 20 })
await changeStore()
forRules()
/**
 * 表单唯一标识
 */
const Key = ref(useId())
const params = ref({ store_id: myStore.value?.id, range: 1 } as Check)

const submit = useDebounceFn(async () => {
  const res = await createCheck(params.value as Check)
  Key.value = Date.now().toString()
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建成功', 1000)
    setTimeout(() => {
      router.back()
    }, 500)
  }
  else {
    $toast.error(res?.message ?? '创建失败')
  }
}, 500)

const presetToSelect = (key: keyof Check): { label: string, value: any }[] => {
  if (!key)
    return []
  const filter = checkFilterList.value[key]
  if (!filter)
    return []
  if (!filter.preset) {
    return []
  }
  return optonsToSelect(filter.preset)
}

function handleValidateButtonClick() {
  formRef.value?.validate((error) => {
    if (!error) {
      submit()
    }
    else {
      $toast.error('请完善盘点信息')
    }
  })
}

const canShowFilter = (item: FilterWhere<Check>) => {
  if (!item.create) {
    return false
  }

  if (item.condition) {
    return !item.condition?.some((i) => {
      switch (i.operator) {
        case '=':
          return params.value[i.key as keyof Check] !== i.value

        default:
          return false
      }
    })
  }

  return true
}

/** 成品大类或者旧料大类 */
function isClass() {
  return params.value?.type === GoodsType.ProductFinish ? 'class_finished' : 'class_old'
}

// 判断字段是否是 number[] 类型的字段
function isNumberArrayField(key: keyof Check): key is keyof Pick<Check, 'brand' | 'category' | 'class_finished' | 'class_old' |
  'craft' | 'gem' | 'material' | 'quality'> {
  return [
    'brand',
    'category',
    'class_finished',
    'class_old',
    'craft',
    'gem',
    'material',
    'quality',
  ].includes(key as string)
}

// 切换开关处理函数
function handleSwitchChange(e: boolean, name: keyof Check) {
  if (!isNumberArrayField(name))
    return

  const preset = checkFilterList.value[name]?.preset || {}
  const selected = Object.keys(preset).map(i => Number(i))

  params.value[name] = e ? selected : []
}

async function getStoreStaffListFun() {
  const res = await getStoreStaffList({ id: myStore.value.id })
  if (res) {
    $toast.error(res?.data.value?.message || '获取员工列表失败')
  }
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-4 pb-20">
        <div class="flex flex-col gap-4">
          <div :id="Key" :key="Key" class="rounded-6 bg-white w-auto blur-bga">
            <common-gradient title="新增盘点单">
              <template #body>
                <n-form ref="formRef" :model="params" :rules="rules">
                  <div uno-lg="grid grid-cols-[1fr_1fr] gap-x-8">
                    <template v-for="(item, index) in checkFilterListToArray" :key="index">
                      <!-- 大类 -->
                      <template v-if="item.name === 'class_finished' || item.name === 'class_old'">
                        <template v-if="item.name === isClass()">
                          <n-form-item v-if="canShowFilter(item)" :path="item.name" :required="true" :label="item.label">
                            <n-select
                              v-model:value="params[item.name]"
                              multiple
                              size="large"
                              :placeholder="`请选择${item.label}`"
                              :options="presetToSelect(item.name)"
                              :consistent-menu-width="false"
                              clearable
                              @focus="focus"
                            />
                            <div class="ml-2">
                              <n-switch size="large" @change="(e) => handleSwitchChange(e, item.name)">
                                <template #unchecked>
                                  <div>
                                    全选
                                  </div>
                                </template>
                                <template #checked>
                                  <div class="pl-2">
                                    清空
                                  </div>
                                </template>
                              </n-switch>
                            </div>
                          </n-form-item>
                        </template>
                      </template>
                      <template v-else>
                        <n-form-item v-if="canShowFilter(item)" :path="item.name" :required="item.required" :label="item.label">
                          <template v-if="item.input === 'select'">
                            <template v-if="item.name === 'type'">
                              <n-select
                                v-model:value="params[item.name]"
                                :default-value="0 || '' || undefined || null"
                                size="large"
                                :placeholder="`选择${item.label}`"
                                :options="optonsToSelect(typePreset)"
                                clearable
                                @focus="focus"
                              />
                            </template>
                            <template v-else>
                              <n-select
                                v-model:value="params[item.name]"
                                :default-value="0 || '' || undefined || null"
                                size="large"
                                :placeholder="`选择${item.label}`"
                                :options="presetToSelect(item.name)"
                                clearable
                                @focus="focus"
                              />
                            </template>
                          </template>
                          <template v-if="item.input === 'text'">
                            <n-input v-model="params[item.name]" round :placeholder="`输入${item.label}`" @focus="focus" />
                          </template>
                          <template v-if="item.input === 'number'">
                            <div class="w-[100%]">
                              <n-input-number v-model="params[item.name]" round :placeholder="`输入${item.label}`" @focus="focus" />
                            </div>
                          </template>
                          <template v-if="item.input === 'textarea'">
                            <n-input v-model:value="params[item.name] as string" round :placeholder="`输入${item.label}`" @focus="focus" />
                          </template>
                          <template v-if="item.input === 'search'">
                            <template v-if="item.name === 'inventory_person_id' || item.name === 'inspector_id'">
                              <n-select
                                v-model:value="params[item.name]"
                                :placeholder="`请输入${item.label}`"
                                :options="StoreStaffList.map(v => ({
                                  label: v.nickname,
                                  value: v.id,
                                }))"
                                clearable
                                size="large"
                                remote

                                @focus="(e) => {
                                  focus(e)
                                  getStoreStaffListFun()
                                }"
                              />
                            </template>
                          </template>
                          <template v-if="item.input === 'multiple'">
                            <div class="flex items-center w-[100%]">
                              <n-select
                                v-model:value="params[item.name]"
                                multiple
                                size="large"
                                :placeholder="`请选择${item.label}`"
                                :options="presetToSelect(item.name)"
                                :consistent-menu-width="false"
                                clearable
                                @focus="focus"
                              />
                              <div class="ml-2">
                                <n-switch size="large" @change="(e) => handleSwitchChange(e, item.name)">
                                  <template #unchecked>
                                    <div>
                                      全选
                                    </div>
                                  </template>
                                  <template #checked>
                                    <div class="pl-2">
                                      清空
                                    </div>
                                  </template>
                                </n-switch>
                              </div>
                            </div>
                          </template>
                        </n-form-item>
                      </template>
                    </template>
                  </div>
                </n-form>
              </template>
            </common-gradient>
          </div>
        </div>
      </div>
    </common-layout-center>
    <div class="fixed bottom-0 left-0 w-full py-4 blur-bgc px-8" uno-sm="px-0">
      <common-layout-center>
        <common-button-rounded content="新增盘点单" @button-click="handleValidateButtonClick" />
      </common-layout-center>
    </div>
  </div>
</template>

<style>
.n-base-selection {
  border-radius: 20px;
}
.n-base-selection-label {
  height: 40px !important;
}
.n-input-wrapper {
  border-radius: 20px !important;
}
</style>
