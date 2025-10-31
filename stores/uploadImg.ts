export const useUploadImg = defineStore('uploadImg', {
  actions: {
    // 上传图片
    async uploadImg(req: { image: File }) {
      try {
        const { data } = await https.upload<UploadRes, { image: File }>('/upload/common', req)
        return data.value
      }
      catch (error) {
        throw new Error(`上传图片失败: ${error || '未知错误'}`)
      }
    },
  },
})
