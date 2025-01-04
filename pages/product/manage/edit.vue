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
const productPamas = ref<Product>({} as Product)

async function getInfo() {
  if (route.query.code) {
    await getProductInfo(route.query.code as string)
    productPamas.value = JSON.parse(JSON.stringify(productInfo.value))
  }
}

await getInfo()
await getProductWhere()

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
const presetToSelect = (filter: FilterWhere<Product>): { label: string, value: any }[] => {
  if (!filter.preset) {
    return []
  }
  return Object.keys(filter.preset).map((key) => {
    switch (filter.type) {
      case 'number':
        return {
          label: filter.preset[key],
          value: Number(key),
        }
      default:
        return {
          label: filter.preset[key],
          value: key,
        }
    }
  })
}
// 校验上传文件
const beforeUpload = (data: any) => {
  if (data.file.file?.type !== 'image/png' && data.file.file?.type !== 'image/jpeg') {
    $toast.error('只能上传png,jpeg格式的图片文件,请重新上传')
    return false
  }
}
const file = ref()
function customRequest(e: any) {
  file.value.image = e.file.file?.name
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="px-4 pt-5">
        <div class="flex">
          <div>
            <n-upload
              action="#"
              :custom-request="customRequest"
              list-type="image-card"
              :max="1"
              @before-upload="beforeUpload"
            />
          </div>
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
                  <n-select
                    v-model:value="productPamas[item.name]"
                    :default-value="0 || '' || undefined || null"
                    menu-size="large"
                    fable
                    :placeholder="`请选择${item.label}`"
                    :options="presetToSelect(item) "
                  />
                </template>
              </div>
            </template>
          </template>
        </div>
      </div>
    </common-layout-center>
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
