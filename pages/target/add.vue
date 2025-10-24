<script lang="ts" setup>
const { getTargetWhere, createTarget } = useTarget()
const { myStore } = storeToRefs(useStores())

const { targetFilterListToArray } = storeToRefs(useTarget())
const { $toast } = useNuxtApp()
useSeoMeta({
  title: '新增销售目标',
})
const datas = ref({} as Partial<ExpandPage<any>>)

const personalDatas = ref<(Record<string, any>[])[]>([])

const formRef = ref()

async function handleValidateButtonClick() {
  try {
    await formRef.value?.verify()
  }
  catch {
    return
  }
  const params = { store_id: myStore.value.id, ...datas.value }
  const res = await createTarget(params)
  if (res?.code === HttpCode.SUCCESS) {
    $toast.success('创建成功')
    setTimeout(() => {
      if (res.data.id) {
        jump('/target/update', { id: res.data.id })
      }
    }, 1000)
  }
  else {
    $toast.error(res?.message ?? '创建失败')
  }
}

/**
 * 设置默认值
 */
function setRadioValues() {
  targetFilterListToArray.value.forEach((item) => {
    if (item.input === 'radio') {
      const keys = Object.keys(item.preset ?? {})
      if (!keys.length)
        return

      const firstKey = keys[0]
      datas.value[item.name] = item.type === 'number' ? Number(firstKey) : firstKey
    }
  })
  personalDatas.value = [[]]
}

await getTargetWhere()
await setRadioValues()
</script>

<template>
  <div>
    <common-layout-center>
      <div class="pt-4 pb-22">
        <div class="flex flex-col gap-4">
          <div class="rounded-6 bg-white w-auto blur-bga">
            <common-gradient title="新增销售目标">
              <template #body>
                <common-filter-add
                  ref="formRef"
                  v-model:data="datas"
                  :filter="targetFilterListToArray"
                />
              </template>
            </common-gradient>
          </div>
        </div>
      </div>
    </common-layout-center>
    <div class="fixed bottom-0 left-0 w-full py-4 blur-bgc px-8" uno-sm="px-0">
      <common-layout-center>
        <common-button-rounded content="新增销售目标" @button-click="handleValidateButtonClick" />
      </common-layout-center>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.row {
  :first-child {
    min-width: 120px;
  }
}
</style>
