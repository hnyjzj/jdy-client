<script lang="ts" setup>
const { getPhraseWhere, getPhraseList, addPhrase, deletePhrase, updatePhrase } = usePhrase()
const { filterListToArray, List, page, total } = storeToRefs(usePhrase())
const { myStore } = storeToRefs(useStores())
const isModel = ref(false)
const editStatus = ref(false)
await getPhraseWhere()

const filterData = ref({} as Phrase)
const getList = async (where = {} as Partial<Phrase>) => {
  const params = { page: page.value, limit: 12, where: { store_id: myStore.value.id } } as ReqList<Phrase>
  if (JSON.stringify(where) !== '{}') {
    params.where = { ...params.where, ...where }
  }
  await getPhraseList(params)
}
await getList()
const formRef = ref()
const model = ref({
} as Phrase)
const rules = {}
const changeStores = async () => {
  await getList()
}

const confirm = async () => {
  model.value.store_id = myStore.value.id
  if (!editStatus.value) {
    await addPhrase(model.value)
    await getList()
    isModel.value = false
    model.value = {} as Phrase
  }
  else {
    await updatePhrase(model.value)
    await getList()
    isModel.value = false
    model.value = {} as Phrase
  }
}

const deleteDialog = ref(false)
const dleId = ref<Phrase['id']>('')
const delProduct = async (item: Phrase) => {
  dleId.value = item.id
  deleteDialog.value = true
}
const { $toast } = useNuxtApp()
const deleteConfirm = async () => {
  const res = await deletePhrase({ id: dleId.value })
  if (res?.code === 200) {
    $toast.success(res.message || '删除成功')
  }
  else {
    $toast.error(res?.message || '删除失败')
  }
  await getList()
  deleteDialog.value = false
}

const editText = async (item: Phrase) => {
  if (editStatus.value) {
    isModel.value = true
    model.value.content = item.content
    model.value.id = item.id
  }
}

const updatePage = async (pages: number) => {
  page.value = pages
  await getList()
}

const isFilter = ref(false)
const openFilter = () => {
  isFilter.value = true
}

const submitWhere = async (f: Phrase) => {
  filterData.value = { ...filterData.value, ...f }
  List.value = []
  page.value = 1
  await getList(filterData.value as Phrase)
}
const resetWhere = async () => {
  filterData.value = {} as Phrase
}

const searchText = async (data: string) => {
  page.value = 1
  List.value = []
  await getList({ content: data })
}
const clearFn = async () => {
  List.value = []
  page.value = 1
  await getList()
}
</script>

<template>
  <div class="grid-12 p-[20px]">
    <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
      <div class="flex flex-row gap-2">
        <product-manage-company class="color-[#fff]" @change="changeStores" />
        <product-filter-search
          placeholder="搜索常用语" class="color-[#fff] flex-1" @submit="searchText" @clear="clearFn" />
      </div>
      <div class="flex-center-between gap-2 py-[16px]">
        <div class="text-size-[14px] color-[#fff]">
          共{{ total }}条数据
        </div>
        <div @click="openFilter()">
          <product-filter-senior class="color-[#fff]" />
        </div>
      </div>
    </div>
    <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
      <common-fold :is-collapse="false">
        <template #title>
          <div class="flex justify-between items-center w-full">
            <div>常用语管理</div>
            <div class="flex">
              <template v-if="!editStatus">
                <div class="px-[12px] py-[4px] bg-[#1890ff] text-[#fff] cursor-pointer rounded-[30px] text-center" @click="isModel = true">
                  新增
                </div>
              </template>
              <div class="px-[12px] py-[4px] bg-[#fff] text-[#1890ff] cursor-pointer rounded-[30px] text-center ml-[12px]" @click="editStatus = !editStatus">
                {{ editStatus ? '取消' : '编辑' }}
              </div>
            </div>
          </div>
        </template>
        <div class="p-[16px]">
          <div class="flex-col">
            <template v-if="editStatus">
              <div class="py-[4px] color-[#666] text-[12px] px-[6px]">
                点击短语进行修改
              </div>
            </template>
            <template v-for="(item, index) in List" :key="index">
              <div class="py-[6px] px-[6px] bg-[rgb(247,247,247)] mb-[12px] rounded-[8px] relative cursor-pointer" @click="editText(item)">
                <div>
                  {{ item.content }}
                </div>
                <template v-if="editStatus">
                  <div class="wh-[30px] flex justify-center items-center cursor-pointer absolute right-0 bottom-0">
                    <icon name="i-svg:delete" :size="16" @click.stop="delProduct(item)" />
                  </div>
                </template>
              </div>
            </template>
            <template v-if="List.length === 0">
              <common-emptys />
            </template>
            <common-page v-model:page="page" :total="total" :limit="12" @update:page="updatePage" />
          </div>
        </div>
      </common-fold>
    </div>
    <common-model v-model="isModel" :title="!editStatus ? '新增常用语' : '编辑常用语'" :show-ok="true" confirm-text="确定" @confirm="confirm">
      <div class="mb-8 relative min-h-[60px]">
        <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-placement="top"
        >
          <n-grid :cols="24">
            <template v-for="(item, index) in filterListToArray" :key="index">
              <template v-if="item.create && item.name !== 'store_id'">
                <n-form-item-gi :span="24" :label="item.label" :path="item.label">
                  <n-input v-model:value="(model[item.name] as string)" :placeholder="`请输入${item.label}`" />
                </n-form-item-gi>
              </template>
            </template>
          </n-grid>
        </n-form>
      </div>
    </common-model>
    <common-filter-where v-model:show="isFilter" :data="filterData" :filter="filterListToArray" @submit="submitWhere" @reset="resetWhere" />

    <common-confirm v-model:show="deleteDialog" icon="error" title="删除产品" text="确认要删除此短语吗?" @submit="deleteConfirm" />
  </div>
</template>
