<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'

const { getFinishedRetrieval, getFinishedWhere, uploadFinishedImg } = useFinished()
const { finishedInfo, finishedFilterList, finishedFilterListToArray } = storeToRefs(useFinished())
const { uploadProductImg } = useProductManage()

const { $toast } = useNuxtApp()
const { useWxWork } = useWxworkStore()
const loading = ref(false)
const productName = ref('')
// 成品列表详情
useSeoMeta({
  title: '上传图片',
})
const productCode = ref()
const statusCode = ref()
productName.value = finishedInfo.value?.name || ''
await getFinishedWhere()

/** 图片列表 */
const previewFileList = ref<Array<UploadFileInfo>>([])
/** 照片墙照片初始化 */
function initImgWall() {
  if (finishedInfo.value?.images?.length) {
    const arr: Array<UploadFileInfo> = []
    finishedInfo.value.images.forEach((item, index) => {
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

async function getInfo(code: string) {
  productCode.value = code
  const data = await getFinishedRetrieval(code)
  if (data?.code !== 200) {
    $toast.error(data?.message || '获取成品信息失败')
    return
  }
  initImgWall()
  statusCode.value = 200
}
/** 扫码 */
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    getInfo(code)
  }
}

// 校验上传文件
const beforeUpload = (data: any) => {
  if (data.file.file?.type !== 'image/png' && data.file.file?.type !== 'image/jpeg') {
    $toast.error('只能上传png,jpeg格式的图片文件,请重新上传')
    return false
  }
}

/** 删除照片墙图片 */
function removeImg(data: { index: number }) {
  const tempList = JSON.parse(JSON.stringify(previewFileList.value))
  tempList.splice(data.index, 1)
}

// 文件变更：更新预览列表
const handleFileChange = ({ fileList }: { fileList: UploadFileInfo[] }) => {
  previewFileList.value = fileList
}

// 上传按钮触发
async function uploadImg() {
  if (!previewFileList.value.length) {
    $toast.error('请上传图片')
    return
  }

  loading.value = true
  const uploadUrls: string[] = []

  try {
    for (const file of previewFileList.value) {
      if (file.url) {
        uploadUrls.push(file.url)
        continue
      }

      const res = await uploadProductImg({
        image: file.file as File,
        product_id: finishedInfo.value.code,
      })

      if (res?.code === HttpCode.SUCCESS) {
        uploadUrls.push(res.data.url)
      }
      else {
        $toast.error(res?.message || '图片上传失败')
        return
      }
    }

    const res = await uploadFinishedImg({
      id: finishedInfo.value.id,
      images: uploadUrls,
    } as UpdateProductFinishedImages)

    if (res?.code === HttpCode.SUCCESS) {
      $toast.success('上传成功')
      await getInfo(productCode.value)
    }
    else {
      $toast.error(res?.message || '上传失败')
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <common-layout-center>
      <div class="p-4">
        <div class="color-[#fff] py-[12px] flex justify-between">
          <product-manage-company />
          <div class="flex-1 px-2 sm:px-4">
            <product-filter-search placeholder="搜索条码" @submit="getInfo" />
          </div>
          <div
            class="flex items-center justify-end cursor-pointer"
            @click="scanCode()">
            <icon class="ml-2" name="i-icon:scanit" :size="18" />
          </div>
        </div>

        <template v-if="finishedInfo && statusCode === 200">
          <common-gradient theme="theme" title="上传图片">
            <template #body>
              <div class="flex items-center">
                <n-upload
                  action="#"
                  :default-upload="false"
                  list-type="image-card"
                  :file-list="previewFileList"
                  :before-upload="beforeUpload"
                  :on-change="handleFileChange"
                  show-download-button
                  :show-progress="true"
                  @remove="(file) => removeImg(file)"
                />
              </div>
              <div class="mt-4">
                <button class="btn cursor-pointer w-[100%]" @click="uploadImg">
                  上传
                </button>
              </div>
            </template>
          </common-gradient>
          <div class="h-4" />
          <product-manage-info :info="finishedInfo" :filter-list="finishedFilterList" :filter-list-to-array="finishedFilterListToArray" />
        </template>
      </div>
    </common-layout-center>
    <common-loading v-model="loading" />
  </div>
</template>

<style lang="scss" scoped>
.btn {
  background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
  box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
  --uno: 'text-[16px] py-[8px] border-none flex-1 rounded-[36px] text-[#FFFFFF]';
}
</style>
