<script lang="ts" setup>
import type { UploadCustomRequestOptions, UploadFileInfo, UploadOnRemove } from 'naive-ui'

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
/** 图片列表 */
const previewFileList = ref<Array<UploadFileInfo>>([])
async function getInfo() {
  if (route.query.code) {
    await getProductInfo(route.query.code as string)
    initImgWall()
    productParams.value = productInfo.value
    // 证书手动添加一个数组项
    if (!productInfo.value.certificate) {
      productInfo.value.certificate = ['']
    }
  }
}

/** 照片墙照片初始化 */
function initImgWall() {
  if (productInfo.value?.images?.length) {
    const arr: Array<UploadFileInfo> = []
    productInfo.value.images.forEach((item, index) => {
      arr.push(
        {
          id: `${index}`,
          name: '图片',
          status: 'finished',
          url: ImageUrl(item),
        },
      )
    })
    previewFileList.value = arr
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
    if (previewFileList.value.length) {
      const imgData: string[] = []
      previewFileList.value.forEach((item) => {
        if (item.url) {
          imgData.push(item.url)
        }
      })
      productParams.value.images = imgData
    }
    productParams.value = { ...productParams.value, [k]: v }
  }
  updata()
}

async function updata() {
  const res = await updateProductInfo(productParams.value)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('更新成功')
    await getInfo()
  }
  else {
    $toast.warning(res?.message ?? '更新失败')
  }
}
// 取消更新 数据恢复为修改之前
function cancelUpdata() {
  productParams.value = JSON.parse(JSON.stringify(productInfo.value))
}

// 校验上传文件
const beforeUpload = (data: any) => {
  if (data.file.file?.type !== 'image/png' && data.file.file?.type !== 'image/jpeg') {
    $toast.error('只能上传png,jpeg格式的图片文件,请重新上传')
    return false
  }
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

  try {
    const res = await uploadProductImg(params)
    if (res?.code === HttpCode.SUCCESS) {
      // 最新图片添加到照片墙
      previewFileList.value.push(
        {
          id: `${previewFileList.value.length}`,
          name: '图片',
          status: 'finished',
          url: ImageUrl(res?.data.url),
        },
      )
      $toast.success('图片上传成功')
      // 保存修改到服务器
      await updateProductInfo(productParams.value)
    }
    else {
      $toast.error(res?.message || '图片上传失败')
    }
  }
  catch (error) {
    throw new Error(`图片上传失败: ${error || '未知错误'}`)
  }
}
/** 值为0时 找不到匹配项 显示未选择 */
function filteredOptions(preset: any, val: number) {
  if (val === 0) {
    const obj = { label: '未选择', value: 0 }
    preset.unshift(obj)
  }
  return preset
}

function removeImg(data: { index: number }) {
  previewFileList.value.splice(data.index, 1)
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="px-4 pt-5">
        <div>
          <div class="flex items-center">
            <n-upload
              action="#"
              list-type="image-card"
              :default-file-list="previewFileList"
              :custom-request="customRequest"
              @before-upload="beforeUpload"
              @remove="(file) => removeImg(file)"
            />
          </div>
          <div>{{ previewFileList }}</div>
          <div class="flex-1 grid gap-y-2 text-[#FFF] text-[12px] my-4">
            <div class="flex justify-between">
              <div>状态</div>
              <common-tags type="orange" :text="filterList.status?.preset[productInfo.status] ?? ''" />
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
        <div class="pb-20 w-[100%]">
          <div uno-sm="grid grid-cols-[1fr_1fr] gap-4">
            <template v-for="(item, index) in filterListToArray" :key="index">
              <template v-if="item.update">
                <div class="mb-4">
                  <div class="label">
                    {{ item.label }}
                  </div>
                  <template v-if="item.input === 'text'">
                    <n-input
                      v-model:value="productParams[item.name]"
                      clearable
                      :placeholder="`${item.label}`"
                    />
                  </template>
                  <template v-else-if="item.input === 'number'">
                    <n-input-number
                      v-model:value="productParams[item.name]"
                      :placeholder="String(productParams[item.name])"
                      :default-value="0"
                      min="0"
                      :format="(value) => String(Math.floor(Number(value) || 1))"
                    />
                  </template>
                  <template v-else-if="item?.input === 'select'">
                    <n-select
                      v-model:value="productParams[item.name]"
                      menu-size="large"
                      :placeholder="`选择${item.label}`"
                      :options="filteredOptions(optonsToSelect(item.preset), productParams[item.name])"
                      clearable
                    />
                  </template>
                  <template v-else-if="item?.input === 'switch'">
                    <n-switch v-model:value="productParams[item.name]" />
                  </template>
                  <template v-else-if="item?.input === 'textarea'">
                    <n-input
                      v-model:value="productParams[item.name]"
                      :placeholder="`${item.label}`"
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
              </template>
            </template>
          </div>
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
