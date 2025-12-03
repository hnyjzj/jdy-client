<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'

const { $toast } = useNuxtApp()
const { addAccessorieEnter, getAccessorieEnterAddProductWhere } = useAccessorieEnter()
const { addProductEnterFilterList, addProductEnterToArray } = storeToRefs(useAccessorieEnter())
const route = useRoute()
const router = useRouter()
useSeoMeta({
  title: '新增入库单',
})

const params = ref({

} as ProductAccessories)
const enterId = ref()
if (route.query?.id) {
  enterId.value = route.query.id
  await getAccessorieEnterAddProductWhere()
}
const formRef = ref<FormInst | null>(null)
const rules = ref<FormRules>({})

function forRules() {
  addProductEnterToArray.value.forEach((item) => {
    if (item.required) {
      if (item.input === 'text') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
        }
      }
      if (item.input === 'number') {
        rules.value[item.name] = {
          required: true,
          trigger: ['blur', 'input', 'change'],
          message: `请输入${item.label}`,
          type: 'number',
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

function handleValidateButtonClick() {
  formRef.value?.validate((error) => {
    if (!error) {
      submit()
    }
    else {
      $toast.error('请完善信息')
    }
  })
}
forRules()
async function submit() {
  if (!enterId.value)
    return $toast.error('入库单ID不存在，无法继续操作')

  const impParams = {
    products: [params.value],
    enter_id: enterId.value,
  }
  const res = await addAccessorieEnter(impParams)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    params.value = {} as ProductAccessories
    setTimeout(() => {
      router.back()
    }, 1000)
  }
  else {
    $toast.error(res?.message ?? '创建失败')
  }
}

const presetToSelect = (key: keyof ProductAccessories) => {
  if (!key)
    return []
  const filter = addProductEnterFilterList.value[key]
  if (!filter)
    return []
  if (!filter.preset) {
    return []
  }
  return optonsToSelect(filter.preset)
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-4 pb-22 px-4">
        <div class="flex flex-col gap-4">
          <div class="rounded-6 bg-white w-auto blur-bga">
            <common-card-info title="新增入库">
              <template #info>
                <n-form ref="formRef" :model="params" :rules="rules">
                  <n-grid :cols="24" :x-gap="8">
                    <template v-for="(item, index) in addProductEnterToArray" :key="index">
                      <template v-if="item.create && item.name !== 'store'">
                        <n-form-item-gi :span="12" :path="item.name" :required="item.required" :label="item.label">
                          <template v-if="item.input === 'select'">
                            <n-select
                              v-model:value="params[item.name]"
                              menu-size="large"
                              :placeholder="`选择${item.label}`"
                              :options="presetToSelect(item.name)"
                              clearable
                              @focus="focus"
                            />
                          </template>
                          <template v-if="item.input === 'text' ">
                            <n-input v-model:value="(params[item.name] as string)" round :placeholder="`输入${item.label}`" @focus="focus" />
                          </template>
                          <template v-if="item.input === 'number'">
                            <div class="w-[100%]">
                              <n-input-number v-model:value="(params[item.name] as number)" round :placeholder="`输入${item.label}`" @focus="focus" />
                            </div>
                          </template>
                          <template v-if="item.input === 'textarea'">
                            <n-input v-model:value="(params[item.name] as string)" :placeholder="`输入${item.label}`" type="textarea" maxlength="255" round :autosize="{ minRows: 2, maxRows: 3 }" @focus="focus" />
                          </template>
                        </n-form-item-gi>
                      </template>
                    </template>
                  </n-grid>
                </n-form>
              </template>
            </common-card-info>
          </div>
        </div>
      </div>
    </common-layout-center>
    <div class="fixed bottom-0 left-0 w-full py-4 blur-bgc px-8" uno-sm="px-0">
      <common-layout-center>
        <common-button-rounded content="新增入库" @button-click="handleValidateButtonClick" />
      </common-layout-center>
    </div>
  </div>
</template>

<style>
.n-base-selection-label {
  height: 40px !important;
}
.n-input-wrapper {
  border-radius: 20px !important;
}
</style>

<style lang="scss" scoped>
</style>
