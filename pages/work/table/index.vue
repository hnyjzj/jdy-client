<script setup lang="ts">
import type { Rules } from 'common-form'
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'

definePageMeta({
  layout: 'nav',
})

const { $toast } = useNuxtApp()
const { addWorkbench, getWorkbenchList, delWorkbench, updateWorkbench, uploadIcon } = useWorkbenche()
const { workBenchList } = storeToRefs(useWorkbenche())
const { searchPage, showtype } = storeToRefs(usePages())
searchPage.value = 1
showtype.value = 'list'
useSeoMeta({
  title: '工作台',
})
// 删除确认框
const deleteDialog = ref(false)
// 暂存要删除的id
const deleteId = ref('')
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
/** 图片列表 */
const previewFileList = ref<Array<UploadFileInfo>>([])
// 重置表单和显示状态
const resetForm = (isshow: boolean = false) => {
  params.value = {
    parent_id: undefined,
    title: '',
    path: '',
    icon: '',
  }
  show.value = isshow
  previewFileList.value = []
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
    // fileList.value = [{ url: ImageUrl(bench.icon), isImage: true }]
    previewFileList.value = [{
      id: bench.id,
      status: 'finished',
      url: ImageUrl(bench.icon),
      name: 'avatar',
    }]
  }
  if (bench.path)
    params.value.path = bench.path
}

// 删除工作台
const delBench = async () => {
  try {
    const data = await delWorkbench(deleteId.value)
    if (data?.code === 200) {
      await getWorkbenchList()
      $toast.success('删除成功')
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

function removeImg(data: { index: number }) {
  const tempList = JSON.parse(JSON.stringify(previewFileList.value))
  tempList.splice(data.index, 1)
  previewFileList.value = tempList
}

/**
 * 上传详情图
 */
const customRequest = useDebounceFn(async ({ file }: UploadCustomRequestOptions) => {
  if (!file?.file)
    return

  try {
    const res = await uploadIcon({ image: file.file })
    if (res.data?.value?.data?.url) {
      params.value.icon = res.data.value.data.url
    }
  }
  catch (error) {
    throw new Error(`图片上传失败: ${error || '未知错误'}`)
  }
}, 300)

const beforeUpload = (data: any) => {
  if (data.file.file?.type !== 'image/png' && data.file.file?.type !== 'image/jpeg') {
    $toast.error('只能上传png,jpeg格式的图片文件,请重新上传')
    return false
  }
}
</script>

<template>
  <div class="">
    <div class="sticky top-0 z-4 search-bg bg-[#3875C5]">
      <common-layout-center>
        <div class="color-[#fff] py-[12px] flex justify-between px-4">
          <product-manage-company />
          <div class="flex-1 px-2 sm:px-4">
            <product-filter-search @submit="searchListFn" />
          </div>
          <auth-verify :min="UserLevel.IdentitySuperAdmin">
            <div
              class="flex items-center justify-end cursor-pointer"
              @click="set">
              <icon name="i-svg:setup" :size="14" color="#FFF" />
              <div class="text-[#fff] text-[14px] pl-1">
                {{ isSetup ? '退出' : '编辑' }}
              </div>
            </div>
          </auth-verify>
        </div>
      </common-layout-center>
    </div>
    <common-layout-center>
      <div class="pb-10 px-4">
        <!-- 工作台入口 -->
        <div class="mt-2 mb-14 col-12">
          <work-bench v-model="isSetup" :list="workBenchList" :fold-status="foldStatus" @add="addBench" @del="(id) => { deleteDialog = true;deleteId = id }" @update="updateBench" @fold="fold" @change-page="changePage" />
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
              <div class="add-row-noline">
                <div>标题</div>
                <input v-model="params[label]" type="text" class="border-none bg-transparent outline-none focus:ring-0 focus:outline-none text-color" placeholder="输入标题" @focus="focus">
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
                  <n-upload
                    action="#"
                    list-type="image-card"
                    :default-file-list="previewFileList"
                    :custom-request="customRequest"
                    :max="1"
                    class="circle-upload"
                    @before-upload="beforeUpload"
                    @remove="(file) => removeImg(file)"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-if="modelType === 3" #path="{ label, error }">
            <div class="pb-[16px]">
              <div class="add-row">
                <div>跳转地址</div>
                <input v-model="params[label]" type="text" class="border-none bg-transparent outline-none focus:ring-0 focus:outline-none text-color" placeholder="输入跳转地址" @focus="focus">
                <div class="text-[#FF2F2F] text-[12px] pt-2">
                  {{ error }}
                </div>
              </div>
            </div>
          </template>
        </common-form>
      </div>
    </common-model>
    <common-confirm v-model:show="deleteDialog" icon="error" title="删除工作台页面" text="该操作存在一定风险，您确定要删除吗？?" @submit="delBench" />

    <common-tabbar text="table" />
  </div>
</template>

<style lang="scss" scoped>
.add-row-noline {
  --uno: 'grid grid-cols-[1fr_2fr] items-center';
}
.add-row {
  --uno: 'grid grid-cols-[1fr_2fr] items-center border-t-[#E6E6E8] border-t-solid border-t-[1px] pt-[16px]';
}

.search-bg {
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 180px;
    top: 0;
    right: 0;
    background-image: url('@/assets/icons/index-six.svg');
    background-repeat: no-repeat;
    background-position: right;
  }
}
</style>
