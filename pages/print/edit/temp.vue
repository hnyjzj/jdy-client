<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'
import PrintTemp from '@/components/print/Board.vue'

import usePrint from 'vue3-use-print'

// 编辑打印模板
useSeoMeta({
  title: '编辑打印模板',
})

// 模拟render data数据
// interface MockRenderData {
//   top: number
//   left: number
//   width: number
//   height: number
//   content: string
// }
// const mockRender = {
//     top:
// }

// const renderData = ref({})

const callOff = () => {
  const { back } = useRouter()
  back()
}

const printPre = () => {
  const PrintComponent = defineComponent({
    render() {
      // TODO: 这里的 details 应该是从 store 中获取的订单详情数据,后续测试完就修改
      return h(PrintTemp, { details: '1111' })
    },
  })

  usePrint(PrintComponent)
}

const formRef = ref<FormInst | null>(null)
const rules = ref<FormRules>({
  name: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请输入模板名称',
    type: 'string',
  },
  form: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择模板表格',
  },
  relevance: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择模板表格',
  },
  mode: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    message: '请选择模板表格',
  },
},
)
</script>

<template>
  <div class="grid-12">
    <div class="col-12 px-[16px] py-[16px] pb-[120px]" uno-lg="col-8 offset-2">
      <div class="flex flex-col gap-[16px]">
        <div class="bg-[#fff] rounded-[16px] shadow-2xl px-[16px] py-[16px] grid col-12 gap-[12px]">
          <div class="w-full h-[300px] col-12">
            占位/示意图
          </div>

          <!-- 打印预览 -->
          <div class="print-pre" @click="printPre">
            打印预览
          </div>
        </div>

        <common-gradient title="模板基础设置" theme="theme">
          <template #body>
            <div class="flex flex-col gap-[20px]">
              <n-form
                ref="formRef"
                :rules="rules"
                label-placement="left"
              >
                <n-form-item path="name" label="模板名称">
                  <n-input @keydown.enter.prevent />
                </n-form-item>

                <n-form-item path="form" label="模板表格">
                  <n-select @keydown.enter.prevent />
                </n-form-item>

                <n-form-item path="relevance" label="关联字段">
                  <n-select @keydown.enter.prevent />
                </n-form-item>

                <n-form-item path="mode" label="是否包含  '支付方式'  字段">
                  <n-switch />
                </n-form-item>

                <n-form-item path="mode" label="是否包含  '门店电话'  字段">
                  <n-switch />
                </n-form-item>
              </n-form>
            </div>
          </template>
        </common-gradient>

        <div class="bg-[#fff] rounded-[16px] shadow-2xl p-[6px]">
          <div class="module-paper border-dashed border-[1px] border-[#ccc] rounded-[16px] p-[16px] flex flex-col gap-[40px]">
            <div class="first-box">
              <div class="title">
                纸张设置
              </div>
              <div class="flex-center-row gap-[16px] px-[16px] py-[20px] rounded-[16px] shadow-md bg-[#E2E2E2]">
                <div class="refined">
                  <div class="label font-size-[14px]">
                    纸张大小
                  </div>
                  <div class="value">
                    <n-space vertical>
                      <n-input round placeholder="请输入纸张大小">
                        <template #suffix>
                          mm
                        </template>
                      </n-input>
                    </n-space>
                  </div>
                </div>
                <div class="refined">
                  <div class="refined flex flex-col gap-[8px]">
                    <div class="label font-size-[14px]">
                      纸高
                    </div>
                    <div class="value">
                      <n-space vertical>
                        <n-input round placeholder="请输入纸张高度">
                          <template #suffix>
                            mm
                          </template>
                        </n-input>
                      </n-space>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="second-box">
              <div class="title">
                其他设置
              </div>
              <div class="flex flex-col gap-[12px]">
                <div class="operate-box">
                  <div class="rounds bg-[#005CC4]" />
                  <div class="refined flex flex-col gap-[8px] flex-1">
                    <div class="label font-size-[14px]">
                      蓝-Ⅰ
                    </div>
                    <div class="value">
                      <n-space vertical>
                        <n-input round placeholder="请输入">
                          <template #suffix>
                            mm
                          </template>
                        </n-input>
                      </n-space>
                    </div>
                  </div>
                  <div class="refined flex flex-col gap-[8px] flex-1">
                    <div class="refined flex flex-col gap-[8px]">
                      <div class="label font-size-[14px]">
                        蓝-Ⅱ
                      </div>
                      <div class="value">
                        <n-space vertical>
                          <n-input round placeholder="请输入">
                            <template #suffix>
                              mm
                            </template>
                          </n-input>
                        </n-space>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="operate-box">
                  <div class="rounds bg-[#CC00B7]" />
                  <div class="refined flex flex-col gap-[8px] flex-1">
                    <div class="label font-size-[14px]">
                      粉-Ⅰ
                    </div>
                    <div class="value">
                      <n-space vertical>
                        <n-input round placeholder="请输入">
                          <template #suffix>
                            mm
                          </template>
                        </n-input>
                      </n-space>
                    </div>
                  </div>
                  <div class="refined flex flex-col gap-[8px] flex-1">
                    <div class="refined flex flex-col gap-[8px]">
                      <div class="label font-size-[14px]">
                        粉-Ⅱ
                      </div>
                      <div class="value">
                        <n-space vertical>
                          <n-input round placeholder="请输入">
                            <template #suffix>
                              mm
                            </template>
                          </n-input>
                        </n-space>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="operate-box">
                  <div class="rounds bg-[#F3D112]" />
                  <div class="refined flex flex-col gap-[8px] flex-1">
                    <div class="label font-size-[14px]">
                      黄-Ⅰ
                    </div>
                    <div class="value">
                      <n-space vertical>
                        <n-input round placeholder="请输入">
                          <template #suffix>
                            mm
                          </template>
                        </n-input>
                      </n-space>
                    </div>
                  </div>
                  <div class="refined flex flex-col gap-[8px] flex-1">
                    <div class="refined flex flex-col gap-[8px]">
                      <div class="label font-size-[14px]">
                        黄-Ⅱ
                      </div>
                      <div class="value">
                        <n-space vertical>
                          <n-input round placeholder="请输入">
                            <template #suffix>
                              mm
                            </template>
                          </n-input>
                        </n-space>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="operate-box">
                  <div class="rounds bg-[#CF1114]" />
                  <div class="refined flex flex-col gap-[8px] flex-1">
                    <div class="label font-size-[14px]">
                      红-Ⅰ
                    </div>
                    <div class="value">
                      <n-space vertical>
                        <n-input round placeholder="请输入">
                          <template #suffix>
                            mm
                          </template>
                        </n-input>
                      </n-space>
                    </div>
                  </div>
                  <div class="refined flex flex-col gap-[8px] flex-1">
                    <div class="refined flex flex-col gap-[8px]">
                      <div class="label font-size-[14px]">
                        红-Ⅱ
                      </div>
                      <div class="value">
                        <n-space vertical>
                          <n-input round placeholder="请输入">
                            <template #suffix>
                              mm
                            </template>
                          </n-input>
                        </n-space>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="operate-box">
                  <div class="rounds bg-[#000]" />
                  <div class="refined flex flex-col gap-[8px] flex-1">
                    <div class="label font-size-[14px]">
                      黑-Ⅰ
                    </div>
                    <div class="value">
                      <n-space vertical>
                        <n-input round placeholder="请输入">
                          <template #suffix>
                            mm
                          </template>
                        </n-input>
                      </n-space>
                    </div>
                  </div>
                  <div class="refined flex flex-col gap-[8px] flex-1">
                    <div class="refined flex flex-col gap-[8px]">
                      <div class="label font-size-[14px]">
                        黑-Ⅱ
                      </div>
                      <div class="value">
                        <n-space vertical>
                          <n-input round placeholder="请输入">
                            <template #suffix>
                              mm
                            </template>
                          </n-input>
                        </n-space>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <common-gradient title="售后条款" theme="theme">
          <template #body>
            <div>
              <textarea
                name="textarea"
                placeholder="售后条款"
                rows="5"
                cols="30"
                class="area"
              >1.因计量设备差异，正负0.01g公允差符合国家计量相关法规规定；
2.部分纯度>900‰的黄金及铂金首饰，其配件纯度规定：黄金≥Au900、铂金≥PT900，焊料纯度规定：黄金≥Au900、铂金≥PT800。买卖均按该首饰的主体价格计算；
3.售出货品非因质量问题，恕不退换。附有鉴定证书之貨品，退换货时须携回有关证书，如证书遗失或损坏，需顾客自行在省级检测机构出具检测证书；
4.享受售后服务，必须携同货品及此单或电子质保单到门店办理。未能出示此单者，恕不提供售后服务。</textarea>
            </div>
          </template>
        </common-gradient>
      </div>
      <common-button-bottom
        cancel-text="返回"
        confirm-text="保存模板"
        @cancel="callOff"
        @confirm="printPre"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.print-pre {
  --uno: 'font-size-[14px] px-[12px] py-[6px] text-center rounded-[8px] col-2 offset-10 bg-[#0068FF] text-[#fff] font-bold cursor-pointer';
}

.title {
  --uno: 'font-size-[16px] font-bold mb-[12px] pl-[6px] border-0 border-solid border-l-6 border-[#1A6BEB]';
}

.rounds {
  --uno: 'w-[32px] h-[32px] rounded-full shadow-md';
}

.operate-box {
  --uno: 'flex-center-row gap-[16px] px-[16px] py-[20px] rounded-[16px] shadow-md bg-[rgba(243,243,243,.74)]';
}

.refined {
  --uno: 'flex flex-col gap-[8px] flex-1';
}

.area {
  --uno: 'rounded-[8px] bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.1)] min-w-full max-h-[300px] px-[12px] py-[10px] font-size-[14px] border-solid border-[#E6E6E8] dark:border-[rgba(239,240,246,0.3)]';
}
</style>
