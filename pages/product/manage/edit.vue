<script lang="ts" setup>
useSeoMeta({
  title: '查看/编辑货品',
})
const { $toast } = useNuxtApp()

const { getProductInfo, getProductWhere, updateProductInfo } = useProductManage()
const { productInfo, filterList, filterListToArray } = storeToRefs(useProductManage())

// 成品列表详情
useSeoMeta({
  title: '列表详情',
})
const route = useRoute()
// 选中值
const pickerValue = ref('')
const showPicker = ref(false)
// 选择器列数据
const columns = ref<SelectPicker[]>([])
const productPamas = ref<Product>({} as Product)

async function getInfo() {
  if (route.query.code) {
    await getProductInfo(route.query.code as string)
    productPamas.value = JSON.parse(JSON.stringify(productInfo.value))
  }
}

await getInfo()
await getProductWhere()
/**
 * 显示选择器并填充列数据
 * @param name 字段名
 */
function pickerFun(name: keyof ProductWhere) {
  columns.value = []
  showPicker.value = true
  const preset = filterList.value[name]?.preset
  for (const key in preset) {
    columns.value.push({ text: preset[key], value: Number(key), key: name })
  }
}

interface SelectPicker extends Columns {
  key: keyof Product & string
}

function pickered(e: any) {
  showPicker.value = false
  // 选中项数据
  const selected: SelectPicker = e.selectedOptions[0]
  pickerValue.value = selected.value
  productPamas.value = { ...productPamas.value, [selected.key]: selected.value }
}

// 参数转换相应类型
function transformData() {
  for (const key in productPamas.value) {
    const k = key as keyof Product
    let v = productPamas.value[k]
    switch (filterList.value[k]?.type) {
      case 'number':
        if (v) {
          v = Number(v)
        }
        else {
          v = 0
        }
        break
      case 'string':
        v = String(v)
        break
      case 'float':
        v = Number.parseFloat(v)
        break
      default:
        break
    }
    productPamas.value = { ...productPamas.value, [k]: v }
  }
  updata()
}

async function updata() {
  const res = await updateProductInfo(productPamas.value)
  if (res.code === HttpCode.SUCCESS) {
    $toast.success('更新成功')
    await getInfo()
  }
  else {
    $toast.warning(res.message ?? '更新失败')
  }
}
// 取消更新 数据恢复为修改之前
function cancelUpdata() {
  productPamas.value = JSON.parse(JSON.stringify(productInfo.value))
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="px-4 pt-5">
        <div class="flex">
          <van-uploader
            preview-size="100" reupload max-count="1" :style="{
              '--van-uploader-border-radius': '20px',
              '--van-uploader-upload-background': 'white',
            }" :preview-options="{ closeable: true }"
          />
          <div class="flex-1 ml-4 grid gap-y-2 text-[#FFF] text-[12px]">
            <div class="flex justify-between">
              <div>状态</div>
              <div class="flex">
                <div class="flex items-center">
                  <icon name="i-svg:selected" size="16" />
                  <div class="ml-1">
                    在库
                  </div>
                </div>
                <div class="flex items-center ml-6">
                  <van-icon name="circle" size="16" />
                  <div class="ml-1">
                    在库
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-between">
              <div>所在仓库</div>
              <div />
            </div>
            <div class="flex justify-between">
              <div>大类</div>
              <div>成品仓</div>
            </div>
            <div class="flex justify-between">
              <div>供应商</div>
              <div>{{ productInfo.supplier }}</div>
            </div>
          </div>
        </div>
        <div class="pb-20">
          <template v-for="(item, index) in filterListToArray" :key="index">
            <template v-if="item.show">
              <div class="mb-4">
                <template v-if="item.input === 'text'">
                  <div class="label">
                    {{ item.label }}
                  </div>
                  <common-frame v-model="productPamas[item.name]" :type="item?.type" :tip="String(productPamas[item.name])" />
                </template>
                <template v-else-if="item?.input === 'select'">
                  <div class="label">
                    {{ item?.label }}
                  </div>
                  <div class="select" @click.capture="pickerFun(item.name)">
                    <div>
                      <div class="flex items-center flex-1">
                        <div>{{ filterList[item.name]?.preset[productPamas[item.name]] ?? '请选择' }}</div>
                      </div>
                    </div>
                    <div class="select-right">
                      <van-icon name="arrow" color="#808089" />
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </template>
        </div>
      </div>
    </common-layout-center>
    <van-popup v-model:show="showPicker" destroy-on-close round position="bottom">
      <van-picker
        :model="pickerValue"
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="pickered"
      />
    </van-popup>
    <common-button-bottom @confirm="transformData" @cancel="cancelUpdata" />
  </div>
</template>

<style lang="scss" scoped>
.label {
  --uno: 'mb-2 text-color text-14px';
}
.select {
  --uno: 'px-[12px] py-[10px] rounded-[36px] flex-between text-color bg-#fff border-[#e6e6e8] border-1px border-solid dark:bg-[rgba(255,255,255,0.2)] dark:border-[rgba(230,230,232,0.2)]';
}
</style>
