<script lang="ts" setup>
const props = withDefaults(defineProps<{
  filterList: Where<Product>
  type: number
}>(), {
  type: 1,
})
const emits = defineEmits<{
  /**
   * 提交
   * @param params 上传入库数据
   */
  upload: [params: Product[]]
}>()

const { $toast } = useNuxtApp()
const isModel = defineModel({ type: Boolean, default: false })
// 上传xlsx文件数据
const sheetData = ref([])

/**
 * 上传xlsx文件并解析数据
 * @param event input上传文件
 */
function FileUpload(event: any) {
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
  type ProductKey = keyof Product
  const originalHeaders: ProductKey[] = data[0]
  const headers = await handleFileUpload(originalHeaders) as ProductKey[]
  return data.slice(1).map((row) => {
    const obj = {} as Record<ProductKey, any>
    headers.forEach((header: ProductKey, index) => {
      const type = props.filterList[header]?.type
      if (props.filterList[header]?.input === 'select') {
        /** 预设值 查找对应的key */
        const preset = props.filterList[headers[index]]?.preset
        const key = Object.values(preset).indexOf(String(row[index]))
        key && key > 0 ? row[index] = key : row[index] = ''
      }
      /** 数据转换对应类型 */
      switch (type) {
        case 'number':
          row[index] = Number(row[index])
          break
        case 'float':
          row[index] = Number.parseFloat(row[index])
          break
        case 'string':
          row[index] = String(row[index])
          break
        case 'bool':
          row[index] = Boolean(row[index])
          break
        case 'string[]':
          row[index] = JSON.parse(JSON.stringify(row[index]))
          break
        default:
          break
      }
      obj.type = props.type
      obj[header] = row[index] ?? '' // 将表头与对应的数据行匹配
    })
    // 证书合成数组
    const transformedObj = {
      ...obj,
      certificate: [obj.certificate1, obj.certificate2],
    }

    // 删除不需要的字段
    delete transformedObj.certificate1
    delete transformedObj.certificate2
    return transformedObj
  })
}
async function submitGoods() {
  const data: Product[] = await transformData(sheetData.value)
  emits('upload', data)
}

/** 下载对应入库模板 */
const downloadLocalFile = () => {
  let url = ''
  let name = ''
  if (props.type === 1) {
    url = '/excel/finishedTemplate.xlsx'
    name = '成品入库模板.xlsx'
  }
  else if (props.type === 3) {
    url = '/excel/assessoryTemplate.xlsx'
    name = '配件入库模板.xlsx'
  }
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div>
    <common-model v-model="isModel" title="入库" :show-ok="true" confirm-text="导入货品" @confirm="submitGoods">
      <div class="mb-8 relative min-h-[60px]">
        <div class="text-[14px] flex pb-4">
          请按照模板整理数据信息
          <div class="text-[rgba(57,113,243,1)] flex" @click="downloadLocalFile">
            <icon name="i-svg:download" :size="16" color="#666" />
            下载模板
          </div>
        </div>
        <input class="h-[40px] absolute top-0 w-full opacity-0" type="file" @change="FileUpload">
        <div class="uploadInp cursor-pointer">
          <div>请添加文件</div>
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
