<script lang="ts" setup>
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'

const props = defineProps<{
  uploadFile: (file: any) => Promise<string | false>
  detail?: ServiceOrderInfo
}>()

// 展示预览图
const showModalRef = ref(false)
const { $toast } = useNuxtApp()
const previewFileList = defineModel('pictures', { default: [] as UploadFileInfo[] })

// 校验上传文件
const beforeUpload = (data: any) => {
  if (data.file.file?.type !== 'image/png' && data.file.file?.type !== 'image/jpeg') {
    $toast.error('只能上传png,jpeg格式的图片文件,请重新上传')
    return false
  }
}
// 上传
const customRequest = async ({ file, onFinish }: UploadCustomRequestOptions) => {
  // 上传接口
  const res = await props.uploadFile(file.file)
  if (res) {
    previewFileList.value.push({
      id: useId(),
      name: res,
      status: 'finished',
      url: ImageUrl(res),
    })
  }
  onFinish?.()
}
const removeFile = (options: { file: UploadFileInfo, fileList: Array<UploadFileInfo>, index: number }) => {
  const newList = [...previewFileList.value]
  newList.splice(options.index, 1)
  previewFileList.value = newList
}
</script>

<template>
  <div>
    <common-card-info title="添加维修相关图片">
      <template #info>
        <div class="p-[16px] color-[#0068FF] dark:color-[#fff]">
          <n-upload
            action="#"
            :style="{
              '--n-dragger-border-hover': '#0068FF',
            }"
            :custom-request="customRequest"
            :default-file-list="previewFileList"
            list-type="image-card"
            :disabled="props.detail?.status === serviceOrderStatus.Completed"
            @before-upload="beforeUpload"
            @preview="showModalRef = true"
            @remove="removeFile"
          />
        </div>
      </template>
    </common-card-info>
  </div>
</template>

<style lang="scss" scoped>

</style>
