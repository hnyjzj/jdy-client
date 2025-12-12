<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'
import PrintTemp from '@/components/print/Board.vue'

import usePrint from 'vue3-use-print'

useSeoMeta({
  title: '编辑打印模板',
})

const route = useRoute()
const { $toast } = useNuxtApp()

// 获取模板详情
const { getTempInfo, updatePrintTemplate } = useSystemPrint()
const { PrintTemplate } = storeToRefs(useSystemPrint())

const tempInfo = ref<PrintTemplate>({} as PrintTemplate)

async function getInfo() {
  if (route.query.id) {
    await getTempInfo({ id: route.query.id as string, type: Number(route.query.type), store_id: route.query.store_id as string })
    tempInfo.value = JSON.parse(JSON.stringify(PrintTemplate.value))
  }
}

await getInfo()

const verify = ref(null)

const formRef = ref<FormInst | null>(null)
const rules = ref<FormRules>({
  name: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请输入模板名称',
    type: 'string',
  },
  showToUser: {
    validator() {
      if (!verify.value) {
        return new Error('请选择模板类型')
      }
    },
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择模板类型',
  },
},
)

const printPre = () => {
  if (!tempInfo.value.type) {
    $toast.warning('请填写完整信息')
    return
  }
  const PrintComponent = defineComponent({
    render() {
      return h(PrintTemp, { type: tempInfo.value.type, numerical: tempInfo.value })
    },
  })

  usePrint(PrintComponent)
}

const showType = () => {
  if (tempInfo.value.type === 1) {
    return '销售单'
  }
  else if (tempInfo.value.type === 2) {
    return '退货单'
  }
}

const showToUser = ref(showType())

const typeOptions = [
  {
    label: '销售单',
    value: 1,
  },
  {
    label: '退货单',
    value: 2,
  },
]

const callOff = () => {
  const { back } = useRouter()
  back()
}

const saveTemp = async () => {
  const res = await updatePrintTemplate(tempInfo.value)

  if (res?.code === HttpCode.SUCCESS) {
    callOff()
    $toast.success('编辑成功')
  }
  else {
    $toast.error(res?.message ?? '编辑失败')
  }
}

// 判断当前环境
const isMobile = ref(false)

onMounted(() => {
  isMobile.value = checkEnv()
})
</script>

<template>
  <div class="grid-12">
    <div class="col-12 px-[16px] py-[16px] pb-[120px]" uno-lg="col-8 offset-2">
      <div class="flex flex-col gap-[16px]">
        <common-card-info title="模板基础设置" theme="theme">
          <template #info>
            <div class="flex flex-col gap-[20px]">
              <n-form
                ref="formRef"
                :rules="rules"
                :model="tempInfo"
                label-placement="top"
              >
                <n-form-item path="name" label="模板名称">
                  <n-input v-model:value="tempInfo.name" size="large" @keydown.enter.prevent />
                </n-form-item>

                <n-form-item path="showToUser" label="模板类型">
                  <n-select
                    v-model:value="showToUser"
                    :options="typeOptions"
                    @blur="() => {
                      tempInfo.type = showToUser as any
                    }"
                    @update:value="(value) => {
                      verify = value
                    }"
                  />
                </n-form-item>
              </n-form>
            </div>
          </template>
        </common-card-info>

        <div class="bg-[#fff] dark:bg-[rgba(0,0,0,.3)] rounded-[16px] shadow-2xl px-[16px] py-[16px] grid col-12 gap-[12px]">
          <div class="w-auto h-auto col-12">
            <img class="w-full h-auto" src="/images/print/printtemp.png">
          </div>

          <!-- 打印预览 -->
          <template v-if="!isMobile">
            <div class="print-pre" @click="printPre">
              打印预览
            </div>
          </template>
        </div>

        <div class="bg-[#fff] dark:bg-[rgba(0,0,0,.3)] rounded-[16px] shadow-2xl p-[6px]">
          <div class="module-paper">
            <div class="first-box">
              <div class="title">
                基础设置
              </div>
              <div class="gap-[16px] px-[16px] pt-[20px] rounded-[16px] shadow-md bg-[#E2E2E2] dark:bg-[rgba(255,255,255,.3)]">
                <n-form :model="tempInfo" label-placement="top">
                  <n-grid :cols="24" :x-gap="8">
                    <n-form-item-gi :span="8" label="纸张高度">
                      <n-input-number v-model:value="tempInfo.config.size.height" :show-button="false" @keydown.enter.prevent>
                        <template #suffix>
                          mm
                        </template>
                      </n-input-number>
                    </n-form-item-gi>

                    <n-form-item-gi :span="8" label="纸张宽度">
                      <n-input-number v-model:value="tempInfo.config.size.width" :show-button="false" @keydown.enter.prevent>
                        <template #suffix>
                          mm
                        </template>
                      </n-input-number>
                    </n-form-item-gi>

                    <n-form-item-gi :span="8" label="字体大小">
                      <n-input-number v-model:value="tempInfo.config.size.fontSize" :show-button="false" @keydown.enter.prevent>
                        <template #suffix>
                          mm
                        </template>
                      </n-input-number>
                    </n-form-item-gi>
                  </n-grid>
                </n-form>
              </div>
            </div>

            <div class="second-box">
              <div class="title">
                其他设置
              </div>
              <div class="flex flex-col gap-[20px] pt-[8px]">
                <div class="operate-box shadow-[0_-4px_1px_rgba(255,0,0,1)]">
                  <n-form :model="tempInfo.config.base" label-placement="top">
                    <n-grid :cols="24" :x-gap="8">
                      <n-form-item-gi :span="8" label="红 ①">
                        <n-input-number v-model:value="tempInfo.config.base.top" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>

                      <n-form-item-gi :span="8" label="红 ②">
                        <n-input-number v-model:value="tempInfo.config.base.width" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>

                      <n-form-item-gi :span="8" label="红 ③">
                        <n-input-number v-model:value="tempInfo.config.base.right" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>
                    </n-grid>
                  </n-form>
                </div>

                <div class="operate-box shadow-[0_-4px_1px_rgba(221,143,175,1)]">
                  <n-form label-placement="top">
                    <n-grid :cols="24" :x-gap="8">
                      <n-form-item-gi :span="8" label="粉 ①">
                        <n-input-number v-model:value="tempInfo.config.phone.top" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>

                      <n-form-item-gi :span="8" label="粉 ②">
                        <n-input-number v-model:value="tempInfo.config.phone.right" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>
                    </n-grid>
                  </n-form>
                </div>

                <div class="operate-box shadow-[0_-4px_1px_rgba(255,138,0,1)]">
                  <n-form label-placement="top">
                    <n-grid :cols="24" :x-gap="8">
                      <n-form-item-gi :span="8" label="橘 ①">
                        <n-input-number v-model:value="tempInfo.config.list.left" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>

                      <n-form-item-gi :span="8" label="橘 ②">
                        <n-input-number v-model:value="tempInfo.config.list.top" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>

                      <n-form-item-gi :span="8" label="橘 ③">
                        <n-input-number v-model:value="tempInfo.config.list.right" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>

                      <n-form-item-gi :span="8" label="橘 ④">
                        <n-input-number v-model:value="tempInfo.config.list.height" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>
                    </n-grid>
                  </n-form>
                </div>

                <div class="operate-box shadow-[0_-4px_1px_rgba(95,161,71,1)]">
                  <n-form label-placement="top">
                    <n-grid :cols="24" :x-gap="8">
                      <n-form-item-gi :span="8" label="绿 ①">
                        <n-input-number v-model:value="tempInfo.config.total.top" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>

                      <n-form-item-gi :span="8" label="绿 ②">
                        <n-input-number v-model:value="tempInfo.config.total.right" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>
                    </n-grid>
                  </n-form>
                </div>

                <div class="operate-box shadow-[0_-4px_1px_rgba(102,165,213,1)]">
                  <n-form label-placement="top">
                    <n-grid :cols="24" :x-gap="8">
                      <n-form-item-gi :span="8" label="蓝 ①">
                        <n-input-number v-model:value="tempInfo.config.more.left" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>

                      <n-form-item-gi :span="8" label="蓝 ②">
                        <n-input-number v-model:value="tempInfo.config.more.bottom" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>

                      <n-form-item-gi :span="8" label="蓝 ③">
                        <n-input-number v-model:value="tempInfo.config.more.right" :show-button="false" @keydown.enter.prevent>
                          <template #suffix>
                            mm
                          </template>
                        </n-input-number>
                      </n-form-item-gi>
                    </n-grid>
                  </n-form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <common-button-bottom
        cancel-text="返回"
        confirm-text="确定更改"
        @cancel="callOff"
        @confirm="saveTemp"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.print-pre {
  --uno: 'font-size-[14px] px-[12px] py-[6px] text-center rounded-[8px] col-2 offset-10 bg-[#0068FF] text-[#fff] font-bold cursor-pointer';
}

.title {
  --uno: 'font-size-[16px] font-bold mb-[12px] pl-[6px] border-0 border-solid border-l-6 border-[#1A6BEB] text-[#000] dark:text-[#fff]';
}

.rounds {
  --uno: 'w-[32px] h-[32px] rounded-full shadow-md';
}

.operate-box {
  --uno: 'gap-[16px] px-[16px] pt-[20px] pb-[8px] rounded-[16px] bg-[#F9F9F9]';
}

.refined {
  --uno: 'flex flex-col gap-[8px] flex-1';
}

.area {
  --uno: 'rounded-[8px] bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.1)] min-w-full max-h-[300px] px-[12px] py-[10px] font-size-[14px] border-solid border-[#E6E6E8] dark:border-[rgba(239,240,246,0.3)] text-[#000] dark:text-[#fff]';
}

.label {
  --uno: 'font-size-[14px] text-[#000] dark:text-[#fff]';
}

.module-paper {
  --uno: 'border-dashed border-[1px] border-[#ccc] dark:border-[rgba(239,240,246,0.3)] rounded-[16px] p-[16px] flex flex-col gap-[40px]';
}
</style>
