<script setup lang="ts">
import type { Rules } from 'common-form'
import { showConfirmDialog } from 'vant'

const { $toast } = useNuxtApp()

const { addWorkbench, getWorkbenchList, delWorkbench, updateWorkbench, uploadIcon } = useWorkbenche()
const { workBenchList } = storeToRefs(useWorkbenche())

useSeoMeta({
  title: '工作台',
})

const addWorkbenchform = templateRef('addWorkbenchform')
const show = ref(false)
const params = ref<AddWorkbencheReq>({
  parent_id: undefined,
  title: '',
  icon: '',
  path: '',
})
const rules = ref<Rules<AddWorkbencheReq>>({
  title: [{ message: '标题不能为空', validator: 'required' }],
  icon: [{ message: '图标不能为空', validator: 'required' }],
  path: [{ message: '跳转地址不能为空', validator: 'required' }],
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
    icon: '',
    path: '',
  }
  show.value = isshow
  fileList.value = []
}

const foldStatus = useState('allFold', () => {
  return foldType.value
})

// 初始化折叠状态
const initFold = () => {
  workBenchList.value.forEach((item: WorkBench) => {
    if (!(item.id in foldStatus.value)) {
      foldStatus.value[item.id] = false
    }
  })
}
// 打开所有工作台
const allFold = () => {
  workBenchList.value.forEach((item: WorkBench) => {
    foldStatus.value[item.id] = false
  })
}

// 切换单个工作台的折叠状态
const fold = (id: string) => {
  foldStatus.value[id] = !foldStatus.value[id]
}

// 添加/更新工作台表单
const addBench = (id: string) => {
  resetForm(true)
  submitStatus.value = 'add'
  show.value = true
  params.value.parent_id = id
}
const updateBench = (bench: WorkBench) => {
  resetForm(true)
  submitStatus.value = 'update'
  show.value = true
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
      if (data.code === 200) {
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
usePageShow(() => {
  getWorkbenchList()
  initFold()
})

// 新增/更新工作台
async function submit(val: AddWorkbencheReq) {
  const submitFn = submitStatus.value === 'add' ? addWorkbench : updateWorkbench
  const res = await submitFn(val)
  if (res.code === 200) {
    resetForm()
    await getWorkbenchList()
    return $toast.success('操作成功')
  }
  $toast.error(res?.message || '操作失败')
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
  const res = await uploadIcon({ image: file.file })
  params.value.icon = res.data.value.data.url
}
</script>

<template>
  <div class="flex flex-col">
    <div class="color-[#fff] grid-12 px-[16px] py-[12px]">
      <div class="col-4" uno-sm="col-3 offset-1" uno-lg="col-2 offset-2" uno-xl="col-1 offset-3">
        <product-manage-company />
      </div>
      <div class="col-6 offset-4 px-1" uno-sm="col-6 offset-4" uno-lg="col-5 offset-4" uno-xl="col-4 offset-4">
        <product-filter-search />
      </div>
      <div
        class="col-2 offset-10 flex items-center justify-end cursor-pointer" uno-sm="col-1 offset-10" uno-lg="col-1 offset-9" uno-xl="col-1 offset-8"
        @click="set">
        <icon name="i-svg:setup" size="14" color="#FFF" />
        <div class="text-[#fff] text-[14px] pl-1">
          {{ isSetup ? '退出' : '编辑' }}
        </div>
      </div>
    </div>
    <div class="grid-12 px-[16px]">
      <!-- 工作台入口 -->
      <div class="mt-6 mb-14 col-12" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
        <work-bench v-model="isSetup" :list="workBenchList" :fold-status="foldStatus" @add="addBench" @del="delBench" @update="updateBench" @fold="fold" />
        <template v-if="isSetup">
          <button style="all: unset;">
            <div class="flex items-center mb-4 cursor-pointer" @click="resetForm(true);show = true">
              <icon name="i-icon:addsth" size="26px" color="#000" />
              <div class="text-[14px] text-[#000] pl-1">
                添加模块
              </div>
            </div>
          </button>
        </template>
      </div>
    </div>
    <common-model v-model:model-value="show" title="新增" :show-ok="true" @confirm="() => addWorkbenchform?.submit()">
      <div class="py-[16px]">
        <common-form ref="addWorkbenchform" v-model="params" :rules="rules" @submit="(val) => submit(val)">
          <template #title="{ label }">
            <div class="pb-[16px]">
              <div class="add-row">
                <div>标题</div>
                <input v-model="params[label]" type="text" class="border-none bg-transparent" placeholder="输入标题">
              </div>
            </div>
          </template>
          <template #icon>
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
          <template #path="{ label }">
            <div class="pb-[16px]">
              <div class="add-row">
                <div>跳转地址</div>
                <input v-model="params[label]" type="text" class="border-none bg-transparent" placeholder="输入跳转地址">
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
