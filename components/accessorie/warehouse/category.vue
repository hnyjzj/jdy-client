<script lang="ts" setup>
const props = withDefaults(defineProps<{
  filterList: Where<AccessorieCategory>
  type: number
}>(), {
  type: 1,
})
const emits = defineEmits<{
  /**
   * 提交
   * @param params 上传入库数据
   */
  upload: [params: AccessorieCategory[]]
}>()

const { $toast } = useNuxtApp()
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

/**
 * 将二维数组转换为对象数组
 * @param data 二维数组，第一行是表头，其余是数据行
 * @returns 对象数组
 */
async function transformData(data: any[][]) {
  if (!data || data.length < 2) {
    $toast.error('数据格式不正确，至少需要表头和一行数据')
    return []
  }

  // 第一行是表头 对应着字段名
  type key = keyof AccessorieCategory
  const originalHeaders: key[] = data[0]

  // 上传后的表头
  const headers = await handleFileUploadCategory(originalHeaders) as key[]
  return data.slice(1).map((row) => {
    const obj = {} as Record<key, any>

    headers.forEach((header: key, index) => {
      // 字段筛选条件
      const filterItem = props.filterList[header]
      // 判断字段是否存在于 filterList 中，防止访问 undefined
      if (filterItem) {
        const input = filterItem.input

        if (!row[index])
          return
        // 处理下拉选择项
        if (filterItem.input === 'select') {
          const preset = filterItem.preset || {}
          const rowValue = String(row[index] ?? '')
          // 使用 Object.entries() 查找键，防止 undefined 和类型不一致问题
          const key = Object.entries(preset).find(([_, v]) => String(v) === rowValue)?.[0] ?? ''
          row[index] = Number(key)
        }

        // 数据类型转换 + 默认值处理

        switch (input) {
          case 'number':
            row[index] = row[index] ?? 0
            row[index] = Number(row[index])
            break
          case 'text':
            row[index] = row[index] ?? ''
            row[index] = String(row[index])
            break
          case 'switch':
            if (row[index] === '是') {
              row[index] = true
            }
            else if (row[index] === '否') {
              row[index] = false
            }
            else if (!row[index]) {
              row[index] = false
            }
            break
          default:
            row[index] = row[index] ?? ''
            break
        }
        obj[header] = row[index]
      }
    })
    return obj
  })
}
async function submitGoods() {
  const data: AccessorieCategory[] = await transformData(sheetData.value)
  emits('upload', data)
}

/** 下载对应入库模板 */
const downloadLocalFile = () => {
  const url = '/excel/categoryTemplate.xlsx'
  const name = '配件类目模板.xlsx'

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
    <common-model v-model="isModel" title="批量入库" :show-ok="true" confirm-text="导入货品" @confirm="submitGoods" @cancel="clearData">
      <div class="mb-8 relative min-h-[60px]">
        <div class="pb-4">
          <div class="text-[14px] text-color flex">
            1、请按照模板整理数据信息
            <div class="text-[rgba(57,113,243,1)] flex ml-4" @click="downloadLocalFile">
              <icon name="i-svg:download" :size="16" color="#666" />
              下载模板
            </div>
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
