<script setup lang="ts">
import type { Rules } from 'common-form'
import { showConfirmDialog } from 'vant'

const { $toast } = useNuxtApp()
const { addWorkbench, getWorkbenchList, delWorkbench, updateWorkbench, uploadIcon } = useWorkbenche()
const { workBenchList } = storeToRefs(useWorkbenche())
const { searchPage } = storeToRefs(useOrder())
searchPage.value = 1
useSeoMeta({
  title: '工作台',
})

const addWorkbenchform = templateRef('addWorkbenchform')
const show = ref(false)
const params = ref<AddWorkbencheReq>({
  parent_id: undefined,
  title: '',
  path: '',
  icon: '',
})
const rules = ref<Rules<AddWorkbencheReq>>({
  title: [{ message: '标题不能为空', validator: 'required' }],
})
// 折叠状态
const foldType = ref<Record<string, boolean>>({})
// 是否设置状态
const isSetup = ref(false)
// 提交表单时状态
const submitStatus = ref<'add' | 'update'>('add')

// 上传图片列表
const fileList = ref<fileListArr[]>([])
// 重置表单和显示状态
const resetForm = (isshow: boolean = false) => {
  params.value = {
    parent_id: undefined,
    title: '',
    path: '',
    icon: '',
  }
  show.value = isshow
  fileList.value = []
}

const foldStatus = useState('allFold', () => {
  return foldType.value
})

// 打开所有工作台
const allFold = () => {
  workBenchList.value.forEach((item) => {
    item.is_fold = false
  })
}

// 切换单个工作台的折叠状态
const fold = (index: number) => {
  workBenchList.value[index].is_fold = !workBenchList.value[index].is_fold
}
const modelType = ref()
// 添加/更新工作台表单
const addBench = (id: string, type: number) => {
  modelType.value = type
  resetForm(true)
  submitStatus.value = 'add'
  params.value.parent_id = id
}

const updateBench = (bench: WorkBench, type: number = 1) => {
  modelType.value = type
  resetForm(true)
  submitStatus.value = 'update'
  params.value.id = bench.id
  params.value.parent_id = bench.parent_id
  if (bench.title)
    params.value.title = bench.title
  if (bench.icon) {
    params.value.icon = bench.icon
    fileList.value = [{ url: ImageUrl(bench.icon), isImage: true }]
  }
  if (bench.path)
    params.value.path = bench.path
}

// 删除工作台
const delBench = async (id: string) => {
  try {
    const res = await showConfirmDialog({
      title: '删除工作台页面',
      message: '该操作存在一定风险，您确定要删除吗？',
    })
    if (res === 'confirm') {
      const data = await delWorkbench(id)
      if (data?.code === 200) {
        await getWorkbenchList()
        $toast.success('删除成功')
      }
    }
  }
  catch (error) {
    throw new Error(`${error || '未知错误'}`)
  }
}

// 编辑工作台
const set = () => {
  allFold()
  isSetup.value = !isSetup.value
}

// 页面显示时获取工作台列表
if (!workBenchList.value.length) {
  await getWorkbenchList()
}

// 新增/更新工作台
async function submit(val: AddWorkbencheReq) {
  const submitFn = submitStatus.value === 'add' ? addWorkbench : updateWorkbench
  const res = await submitFn(val)
  if (res?.code === 200) {
    resetForm()
    await getWorkbenchList()
    return $toast.success('操作成功', 1000)
  }
  $toast.error(res?.message || '操作失败')
}

// 编辑或跳转分页
async function changePage(bench: WorkBench) {
  modelType.value = 3
  if (isSetup.value) {
    return updateBench(bench, 3)
  }
  if (!bench.path) {
    return
  }
  navigateTo(bench.path)
}

// 删除头像
const deleteFile = () => {
  fileList.value = []
}
// 上传前
const beforeRead = (file: any) => {
  // 验证文件类型
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    showToast('请上传 jpg 格式图片')
    return false
  }
  return true
}

const afterRead = async (file: any) => {
  try {
    const res = await uploadIcon({ image: file.file })
    if (res.data?.value?.data?.url) {
      params.value.icon = res.data.value.data.url
    }
    else {
      $toast.error('上传失败')
    }
  }
  catch (error) {
    throw new Error(`更新工作台失败: ${error || '未知错误'}`)
  }
}

const searchListFn = async (val: string) => {
  await getWorkbenchList()
  const filteredData = filterByKeyword(workBenchList.value, val)
  workBenchList.value = filteredData
}

/** 获取新增添加标题 */
function getModelTitle() {
  let modelName = ''
  switch (modelType.value) {
    case 1:
      modelName = '模块'
      break
    case 2:
      modelName = '分类'
      break
    case 3:
      modelName = '栏目'
      break
  }
  if (submitStatus.value === 'add') {
    return `添加${modelName}`
  }
  return `编辑${modelName}`
}
</script>

<template>
  <div class="">
    <div class="sticky top-0 z-3 bg-[#3875C5]">
      <common-layout-center>
        <div class="color-[#fff] py-[12px] flex justify-between px-4">
          <product-manage-company />
          <div class="flex-1 px-2 sm:px-4">
            <product-filter-search @submit="searchListFn" />
          </div>
          <div
            class="flex items-center justify-end cursor-pointer"
            @click="set">
            <icon name="i-svg:setup" :size="14" color="#FFF" />
            <div class="text-[#fff] text-[14px] pl-1">
              {{ isSetup ? '退出' : '编辑' }}
            </div>
          </div>
        </div>
      </common-layout-center>
    </div>
    <common-layout-center>
      <div class="pb-10 px-4">
        <!-- 工作台入口 -->
        <div class="mt-2 mb-14 col-12">
          <work-bench v-model="isSetup" :list="workBenchList" :fold-status="foldStatus" @add="addBench" @del="delBench" @update="updateBench" @fold="fold" @change-page="changePage" />
          <template v-if="isSetup">
            <button style="all: unset;">
              <div class="flex items-center mb-4 cursor-pointer" @click="resetForm(true);show = true;modelType = 1 ">
                <icon name="i-icon:addsth" :size="26" color="#000" />
                <div class="text-[14px] text-[#000] pl-1">
                  添加模块
                </div>
              </div>
            </button>
          </template>
        </div>
      </div>
    </common-layout-center>
    <common-model v-model:model-value="show" :title="getModelTitle()" :show-ok="true" @confirm="() => addWorkbenchform?.submit()">
      <div class="py-[16px] text-color">
        <common-form ref="addWorkbenchform" v-model="params" :rules="rules" @submit="(val: AddWorkbencheReq) => submit(val)">
          <template #title="{ label, error }">
            <div class="pb-[16px]">
              <div class="add-row">
                <div>标题</div>
                <input v-model="params[label]" type="text" class="border-none bg-transparent" placeholder="输入标题">
                <div class="text-[#FF2F2F] text-[12px] pt-2">
                  {{ error }}
                </div>
              </div>
            </div>
          </template>
          <template v-if="modelType === 3" #icon>
            <div class="pb-[16px]">
              <div class="add-row">
                <div>图标</div>
                <div>
                  <van-uploader
                    v-model="fileList" reupload max-count="1" :style="{
                      '--van-uploader-border-radius': '50%',
                      '--van-uploader-upload-background': 'white',
                    }" :after-read="afterRead" :before-read="beforeRead" :preview-options="{ closeable: true }" @delete="deleteFile"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-if="modelType === 3" #path="{ label, error }">
            <div class="pb-[16px]">
              <div class="add-row">
                <div>跳转地址</div>
                <input v-model="params[label]" type="text" class="border-none bg-transparent" placeholder="输入跳转地址">
                <div class="text-[#FF2F2F] text-[12px] pt-2">
                  {{ error }}
                </div>
              </div>
            </div>
          </template>
        </common-form>
      </div>
    </common-model>
    <common-tabbar text="table" />
  </div>
</template>

<style lang="scss" scoped>
.add-row {
  --uno: 'grid grid-cols-[1fr_2fr] items-center border-b-[#E6E6E8] border-b-solid border-b-[1px] pb-[16px]';
}
</style>
