<script setup lang="ts">
useSeoMeta({
  title: '打印模板列表',
})

const { $toast } = useNuxtApp()

const { getPrintTempList, deletePrintTemplate, copyPrintTemplate, setSelectedTemplate } = useSystemPrint()
const { getMyStore } = useStores()

const { printList, printListTotal } = storeToRefs(useSystemPrint())
const { myStore, myStoreList } = storeToRefs(useStores())
const { searchPage } = storeToRefs(usePages())
const delModel = ref(false)
const copyModel = ref(false)

const limit = 12

const getStoreList = async () => await getMyStore({ page: 1, limit: 20 })

await getStoreList()

async function getList(where = {} as Partial<PrintTemplate>) {
  const params = { page: searchPage.value, limit, where: { store_id: myStore.value.id } } as ReqList<PrintTemplate>
  if (JSON.stringify(where) !== '{}') {
    params.where = where
  }
  await getPrintTempList(params)
}

const changeStores = async () => {
  await getList()
}

await getList()

const destTempId = ref<string | undefined>('')
const destStoreId = ref('')
const changeName = ref('')

// 初始化
const cleanUp = () => {
  destTempId.value = ''
  destStoreId.value = ''
  changeName.value = ''
}

// 触发删除
const del = async (id: string) => {
  delModel.value = true
  destTempId.value = id
}

// 确认删除
const delConfirm = async () => {
  if (destTempId.value) {
    const res = await deletePrintTemplate(destTempId.value)

    if (res?.code === HttpCode.SUCCESS) {
      await getList()

      cleanUp()
      $toast.success('删除成功')
    }
    else {
      $toast.error(res?.message ?? '删除失败')
    }

    delModel.value = false
  }
}

// 触发复制
const copy = (id: string | undefined, store_id: string | undefined, index: number) => {
  if (id === '') {
    const selectedTemplate = printList.value[index]

    setSelectedTemplate(selectedTemplate)
    jump('/system/print/new')
  }
  else {
    copyModel.value = true
    destTempId.value = id
  }
}

// 确认复制
const copyConfirm = async () => {
  if (destTempId.value) {
    const res = await copyPrintTemplate({ id: destTempId.value, store_id: destStoreId.value, name: changeName.value })

    if (res?.code === HttpCode.SUCCESS) {
      await getList()

      cleanUp()
      $toast.success('复制成功')
    }
    else {
      $toast.error(res?.message ?? '复制失败')
    }

    copyModel.value = false
  }
}

// 编辑打印模板
const edit = (id: string, type: number, store_id: string) => {
  jump('/system/print/edit', { id, type, store_id })
}

// 取消
const modCancel = () => {
  delModel.value = false
  copyModel.value = false
}

const cancel = () => {
  const { back } = useRouter()
  back()
}

const confirm = () => {
  jump('/system/print/new')
}
</script>

<template>
  <div class="grid-12">
    <common-model
      v-model:model-value="delModel"
      :show-ok="true"
      title="删除打印模板"
      @confirm="delConfirm"
      @cancel="modCancel"
    >
      <div class="font-[14px] color-[#333] my-[56px] text-center">
        打印模板删除后<span class="font-semibold color-[#FF2F2F] px-[4px]">无法恢复</span>，是否确认删除？
      </div>
    </common-model>

    <common-model
      v-model:model-value="copyModel"
      :show-ok="true"
      title="复制打印模板"
      @confirm="copyConfirm"
      @cancel="modCancel"
    >
      <div class="flex flex-col gap-[20px] pb-[32px]">
        <div class="model-name flex flex-col gap-[6px]">
          <div class="font-[14px] color-[#333]">
            模板名称
          </div>

          <n-input
            v-model:value="changeName"
            placeholder="请输入模板名称(非必填项)"
            @keydown.enter.prevent
          />
        </div>

        <div class="target-loc flex flex-col gap-[6px]">
          <div class="font-[14px] color-[#333]">
            复制到
          </div>

          <n-select
            v-model:value="destStoreId"
            placeholder="请选择复制位置"
            :options="myStoreList.map(v => ({
              label: v.name,
              value: v.id,
            }))"
            clearable
            remote
          />
        </div>
      </div>
    </common-model>

    <div class="py[16px] px-[16px] col-12 color-[#fff] font-size-[14px]" uno-lg="col-8 offset-2">
      <div class="flex flex-row justify-between items-center">
        <product-manage-company @change="changeStores" />
        <div>
          共 {{ printListTotal }} 条打印模板
        </div>
      </div>
    </div>

    <div class="col-12" uno-lg="col-8 offset-2">
      <div class="body">
        <template v-if="printList.length">
          <print-lists-list :list="printList" @delete="del" @copy="copy" @edit="edit" />
        </template>

        <template v-else>
          <common-emptys />
        </template>
      </div>
    </div>

    <div class="fixed z-1">
      <common-button-bottom
        cancel-text="取消"
        confirm-text="新增模板"
        @cancel="cancel"
        @confirm="confirm"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.body {
  --uno: 'bg-[rgba(255,255,255,.7)] h-100vh p-[16px] rounded-t-[24px] border-solid border-[1px] border-[#EFF0F6]';
}
</style>
