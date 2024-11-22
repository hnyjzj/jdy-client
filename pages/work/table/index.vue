<script setup lang="ts">
import type { Rules } from 'common-form'

const { addWorkbench, getWorkbenchList } = useWorkbenche()
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
  title: [
    {
      message: '标题不能为空',
      validator: 'required',
    },
  ],
  icon: [
    {
      message: '图标不能为空',
      validator: 'required',
    },
  ],
  path: [
    {
      message: '跳转地址不能为空',
      validator: 'required',
    },
  ],
})
// 获取工作台列表
await getWorkbenchList()
// 新增工作台页面
async function addWorkbenchFn(val: AddWorkbencheReq) {
  const res = await addWorkbench(val)
  if (res.code === 200) {
    show.value = false
    params.value = {
      parent_id: undefined,
      title: '',
      icon: '',
      path: '',
    }
    await getWorkbenchList()
  }
}
const foldStatus = ref<WorkTablesStatus>({})
workBenchList.value.forEach((item: WorkBench) => {
  foldStatus.value[item.id] = true
})
// 折叠
function fold(id: string) {
  foldStatus.value[id] = !foldStatus.value[id]
}
function addBench(id: string) {
  show.value = true
  params.value.parent_id = id
}
</script>

<template>
  <div class="flex flex-col">
    <div class="color-[#fff] grid-12 px-[16px] py-[12px]">
      <div class="col-4" uno-sm="col-3 offset-1" uno-lg="col-2 offset-2" uno-xl="col-1 offset-3">
        <product-manage-company />
      </div>
      <div class="col-7 offset-5" uno-sm="col-6 offset-5" uno-lg="col-5 offset-5" uno-xl="col-4 offset-5">
        <product-filter-search />
      </div>
      <!-- 工作台入口 -->
      <div class="mt-6 mb-14 col-12" uno-sm="col-10 offset-1" uno-lg="col-8 offset-2" uno-xl="col-6 offset-3">
        <div class="text-[#000]" @click="show = true">
          添加模块
        </div>
        <work-bench :list="workBenchList" :fold-status="foldStatus" @add="addBench" @fold="fold" />
      </div>
    </div>
    <common-model v-model:model-value="show" title="新增" :show-ok="true" @confirm="() => addWorkbenchform?.submit()">
      <div class="py-[16px]">
        <common-form ref="addWorkbenchform" v-model="params" :rules="rules" @submit="(val) => addWorkbenchFn(val)">
          <template #title="{ label }">
            <div class="pb-[16px]">
              <div class="flex-between border-b-[#E6E6E8] border-b-solid border-b-[1px] pb-[16px]">
                <div>标题</div>
                <input v-model="params[label]" type="text" class="border-none bg-transparent" placeholder="输入标题">
              </div>
            </div>
          </template>
          <template #icon="{ label }">
            <div class="pb-[16px]">
              <div class="flex-between border-b-[#E6E6E8] border-b-solid border-b-[1px] pb-[16px]">
                <div>图标</div>
                <input v-model="params[label]" type="text" class="border-none bg-transparent" placeholder="输入图标">
              </div>
            </div>
          </template>
          <template #path="{ label }">
            <div class="pb-[16px]">
              <div class="flex-between border-b-[#E6E6E8] border-b-solid border-b-[1px] pb-[16px]">
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
