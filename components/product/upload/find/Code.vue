<script lang="ts" setup>
const emits = defineEmits<{
  /**
   * 提交
   * @param params 上传入库数据
   */
  upload: [params: string[]]
}>()
// const { $toast } = useNuxtApp()

const isModel = defineModel<boolean>('isModel', { default: false, required: true })
const batchCode = ref()

const fileName = ref()

/** 当前nav */
const tab = ref('manual')

// 上传xlsx文件数据
const sheetData = ref([])
/**
 * 上传xlsx文件并解析数据
 * @param event input上传文件
 */
function FileUpload(event: any) {
  fileName.value = event.target.files?.[0]?.name || ''
  uploadXlsx(event).then((data) => {
    sheetData.value = cleanExcelData(data as never[])
  })
}

/**
 * 清除多余的空行，只保留表头和有效数据
 * @param {Array} data Excel 解析出来的 JSON 数据
 * @returns {Array} 处理后的数据
 */
function cleanExcelData(data: any) {
  return data.filter((row: any) => {
    // 过滤掉所有值为空的行
    return Object.values(row).some(value => value !== null && value !== '')
  })
}
async function submitGoods() {
  if (tab.value === 'manual') {
    const data = batchCode.value?.split(/\r?\n/).map((item: string) => item.trim()).filter(Boolean)
    if (data.length) {
      emits('upload', data)
      batchCode.value = ''
    }
  }
  else {
    const data: string[] = []
    sheetData.value.forEach((row: string[], index: number) => {
      if (index !== 0) {
        const firstCell = (row[0] || '').toString().trim()
        if (firstCell) {
          data.push(firstCell)
        }
      }
    })

    emits('upload', [...new Set(data)])
    clearData()
  }
}

/** 下载对应入库模板 */
const downloadLocalFile = () => {
  const url = '/excel/codeFindTemplate.xlsx'
  const name = '批量查条码模板.xlsx'

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function clearData() {
  fileName.value = ''
  sheetData.value = []
}

defineExpose({
  clearData,
})

const changeTab = async (val: string) => {
  tab.value = val
}
</script>

<template>
  <div>
    <common-model v-model="isModel" title="批量查条码" :show-ok="true" confirm-text="导出货品" @confirm="submitGoods" @cancel="clearData">
      <div class="mb-8 relative min-h-[200px]">
        <div class="pb-4">
          <n-tabs type="segment" animated @update:value="changeTab">
            <n-tab-pane name="manual" tab="手动录入">
              <n-input v-model:value="batchCode" type="textarea" placeholder="请输入条码，多个条码请换行" />
            </n-tab-pane>
            <n-tab-pane name="batch" tab="批量录入">
              <div class="text-[14px] text-color flex mb-4">
                1、请按照模板整理数据信息
                <div class="text-[rgba(57,113,243,1)] flex ml-4" @click="downloadLocalFile">
                  <icon name="i-svg:download" :size="16" color="#666" />
                  下载模板
                </div>
              </div>
              <input class="h-[40px] absolute bottom-0 w-full opacity-0" type="file" @change="FileUpload">
              <div class="uploadInp cursor-pointer">
                <div class="text-row-hide w-[60%]">
                  {{ fileName || '请添加文件' }}
                </div>
                <div class="uploadInp-right">
                  <icon name="i-svg:upload" :size="16" color="#666" />
                  <div class="ml-2">
                    点击上传
                  </div>
                </div>
              </div>
            </n-tab-pane>
          </n-tabs>
        </div>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>
.uploadInp {
  --uno: 'text-14px px-[12px] py-[4px] rounded-[36px] flex-between text-color-light bg-#fff border-[#e6e6e8] border-1px border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)]';
  &-right {
    --uno: 'flex items-center py-[6px] px-4 rounded-[36px] text-#FFF';
    background: linear-gradient(to bottom, #1b6ceb, #6da6ff);
    box-shadow: #1111113d 0px 2px 2px 1px;
  }
}
</style>
