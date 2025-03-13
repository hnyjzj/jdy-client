<script lang="ts" setup>
import type { UploadCustomRequestOptions } from 'naive-ui'

useSeoMeta({
  title: '查看/编辑货品',
})
const { $toast } = useNuxtApp()

const { getProductInfo, getProductWhere, updateProductInfo, uploadProductImg } = useProductManage()
const { productInfo, filterList, filterListToArray } = storeToRefs(useProductManage())

// 成品列表详情
useSeoMeta({
  title: '列表详情',
})
const route = useRoute()
const productParams = ref<Product>({} as Product)
/** 文件上传列表 */
const previewFileList = ref<any[]>([])
async function getInfo() {
  if (route.query.code) {
    await getProductInfo(route.query.code as string)
    productParams.value = JSON.parse(JSON.stringify(productInfo.value))
  }
}

await getInfo()
await getProductWhere()

// 参数转换相应类型
function transformData() {
  for (const key in productParams.value) {
    const k = key as keyof Product
    let v = productParams.value[k]
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
    productParams.value = { ...productParams.value, [k]: v }
  }
  updata()
}

async function updata() {
  const res = await updateProductInfo(productParams.value)
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
  productParams.value = JSON.parse(JSON.stringify(productInfo.value))
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
      case 'float':
        return {
          label: filter.preset[key],
          value: Number.parseFloat(key),
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

/** 产品状态 */
const goodsStatus = {
  0: '全部',
  1: '正常',
  2: '报损',
  3: '调拨',
  4: '已售',
  5: '退货',
  6: '盘点中',
}
// 上传
async function customRequest({ file }: UploadCustomRequestOptions) {
  if (!file?.file)
    return
  // 上传接口
  const params = {
    image: file.file,
    product_id: productInfo.value.code,
  }

  const res = await uploadProductImg(params)
  if (res.code === HttpCode.SUCCESS) {
    productParams.value.images.push(res.data.url)
  }
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="px-4 pt-5">
        <div>
          <div class="flex items-center">
            <div class="flex gap-4 flex-wrap">
              <template v-for="(img, index) in productInfo.images" :key="index">
                <div>
                  <img :src="ImageUrl(img)" width="100" height="100">
                </div>
              </template>
              <div>
                <n-upload
                  action="#"
                  :style="{ width: '100px', height: '100px' }"
                  list-type="image-card"
                  :default-file-list="previewFileList"
                  :custom-request="customRequest"
                  @before-upload="beforeUpload"
                />
              </div>
            </div>
          </div>
          <div class="flex-1 grid gap-y-2 text-[#FFF] text-[12px] my-4">
            <div class="flex justify-between">
              <div>状态</div>
              <common-tags type="orange" :text="goodsStatus[productInfo.status] ?? ''" />
            </div>
            <div class="flex justify-between">
              <div>所在门店</div>
              <div>{{ productInfo.store.name }}</div>
            </div>
            <div class="flex justify-between">
              <div>供应商</div>
              <div>{{ filterList.supplier?.preset[productInfo.supplier] }}</div>
            </div>
          </div>
        </div>
        <div class="pb-20">
          <template v-for="(item, index) in filterListToArray" :key="index">
            <template v-if="item.update">
              <div class="flex flex-col gap-4 col-12" uno-lg="col-8 offset-2" uno-sm="col-12">
                <div class="mb-4">
                  <div class="label">
                    {{ item.label }}
                  </div>
                  <template v-if="item.input === 'text'">
                    <n-input
                      v-model:value="productParams[item.name]"
                      :placeholder="String(productParams[item.name])"
                    />
                  </template>
                  <template v-else-if="item.input === 'number'">
                    <n-input-number
                      v-model:value="productParams[item.name]"
                      :placeholder="String(productParams[item.name])"
                      :default-value="0"
                    />
                  </template>
                  <template v-else-if="item?.input === 'select'">
                    <n-select
                      v-model:value="productParams[item.name]"
                      menu-size="large"
                      :placeholder="`选择${item.label}`"
                      :options="optonsToSelect(item.preset, false)"
                      clearable
                    />
                  </template>
                  <template v-else-if="item?.input === 'switch'">
                    <n-switch v-model:value="productParams[item.name]" />
                  </template>
                  <template v-else-if="item?.input === 'textarea'">
                    <n-input
                      v-model:value="productParams[item.name]"
                      :placeholder="String(productParams[item.name])"
                    />
                  </template>
                  <template v-else-if="item?.input === 'list'">
                    <template v-for="(certific, i) in productParams[item.name]" :key="i">
                      <div class="grid grid-cols-[50px_auto_80px] gap-2 items-center">
                        <div class="w-[60px] text-[14px] text-[rgba(102,102,102,1)]">
                          编号{{ i + 1 }}：
                        </div>
                        <n-input
                          v-model:value="productParams[item.name][i]"
                          :placeholder="certific"
                        />
                        <div class="flex gap-1 pb-2">
                          <div class="w-[32px] h-[32px] rounded-full bg-[#FFF] flex justify-center items-center" @click="productParams[item.name].splice(i, 1)">
                            <icon name="i-svg:subtract" size="16" />
                          </div>
                          <template v-if="i === productParams[item.name].length - 1">
                            <div class="w-[32px] h-[32px] rounded-full bg-[#FFF] flex justify-center items-center" @click="productParams[item.name].push('')">
                              <icon name="i-svg:add" size="16" />
                            </div>
                          </template>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
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
