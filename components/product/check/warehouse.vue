<script lang="ts" setup>
const emits = defineEmits<{
  /**
   * 提交
   * @param params string[]
   */
  upload: [params: string[]]
}>()

const isModel = defineModel({ type: Boolean, default: false })
const fileName = ref()
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
  const data: string[] = []
  sheetData.value.forEach((item: any, index: number) => {
    if (index !== 0) {
      data.push(...item)
    }
  })
  emits('upload', [...new Set(data)])
}

/** 下载对应入库模板 */
const downloadLocalFile = () => {
  const url = '/excel/checkTemplate.xlsx'
  const name = '添加盘点模板.xlsx'

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
</script>

<template>
  <div>
    <common-model v-model="isModel" title="批量添加" :show-ok="true" confirm-text="添加货品" @confirm="submitGoods" @cancel="clearData">
      <div class="mb-8 relative min-h-[60px]">
        <div class="text-[14px] text-color flex pb-4">
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
