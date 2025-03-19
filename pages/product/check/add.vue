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
async function submit() {
  const res = await createCheck(params.value as Check)
  Key.value = Date.now().toString()
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    params.value = {} as Check
    setTimeout(() => {
      router.back()
    }, 1000)
  }
  else {
    $toast.error(res.message ?? '创建失败')
  }
}
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
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-4 pb-20">
        <div class="flex flex-col gap-4">
          <div class="w-[40%] text-[#FFF] pl-4">
            <product-manage-company />
          </div>
          <div :id="Key" :key="Key" class="rounded-6 bg-white w-auto blur-bga">
            <common-gradient title="新增盘点单">
              <template #body>
                <n-form ref="formRef" :model="params" :rules="rules">
                  <div uno-sm="grid grid-cols-[1fr_1fr] gap-x-8">
                    <template v-for="(item, index) in checkFilterListToArray" :key="index">
                      <n-form-item v-if="canShowFilter(item)" :path="item.name" :required="item.required" :label="item.label">
                        <template v-if="item.input === 'select'">
                          <n-select
                            v-model:value="params[item.name]"
                            :default-value="0 || '' || undefined || null"
                            size="large"
                            :placeholder="`选择${item.label}`"
                            :options="presetToSelect(item.name)"
                            clearable
                          />
                        </template>
                        <template v-if="item.input === 'text'">
                          <n-input v-model="params[item.name]" round :placeholder="`输入${item.label}`" />
                        </template>
                        <template v-if="item.input === 'number'">
                          <div class="w-[100%]">
                            <n-input-number v-model="params[item.name]" round :placeholder="`输入${item.label}`" />
                          </div>
                        </template>
                        <template v-if="item.input === 'switch'">
                          <n-switch v-model="params[item.name]" size="large" :style="{ 'border-radius': '20px' }" round />
                        </template>
                        <template v-if="item.input === 'textarea'">
                          <n-input v-model="params[item.name]" :placeholder="`输入${item.label}`" type="textarea" size="large" maxlength="255" round :autosize="{ minRows: 1, maxRows: 2 }" />
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
                              @focus="() => { getStoreStaffList({ id: myStore.id }) }"
                            />
                          </template>
                        </template>
                        <template v-if="item.input === 'multiple'">
                          <n-select
                            v-model:value="params[item.name]"
                            multiple
                            size="large"
                            :placeholder="`请选择${item.label}`"
                            :options="presetToSelect(item.name)"
                            :consistent-menu-width="false"
                            clearable
                          />
                        </template>
                      </n-form-item>
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

<style lang="scss" scoped>
</style>
