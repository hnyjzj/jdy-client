<script lang="ts" setup>
import type { FormRules } from 'naive-ui'

const props = defineProps<{
  nowEditState?: number
  searchServiceGoods: (val: string) => Promise<ProductFinisheds[]>
}>()
const oldRules = ref<FormRules>({
  name: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入货品名称',
  },

})
const searchShow = defineModel<boolean>('show', { default: false })
const showServiceGoods = defineModel<serviceGoods[]>('list', { default: [] })

const searchCode = ref()
const nowServiceGoods = defineModel<serviceGoods>('nowServiceGoods', { default: {} })

// 旧料表单 Ref
const oldMasterRef = ref()

const { $toast } = useNuxtApp()
// 搜索旧料后的 确认操作
const searchConfirm = async () => {
  oldMasterRef.value?.validate(async (errors: any) => {
    if (!errors) {
      const isDuplicate = showServiceGoods.value.find(item => item.code === nowServiceGoods.value.code)
      if (isDuplicate && props.nowEditState === undefined) {
        $toast.error('不能添加相同商品')
      }
      else {
        if (props.nowEditState !== undefined) {
          showServiceGoods.value.splice(props.nowEditState, 1, nowServiceGoods.value)
          searchShow.value = false
          searchCode.value = ''
          nowServiceGoods.value = {} as serviceGoods
        }
        else {
          showServiceGoods.value.push(nowServiceGoods.value)
          searchShow.value = false
          searchCode.value = ''
          nowServiceGoods.value = {} as serviceGoods
        }
      }
    }
    else {
      $toast.error(errors[0][0].message)
    }
  })
}
const search = async () => {
  if (!searchCode.value) {
    $toast.error('请输入商品条码')
    return
  }
  const res = await props.searchServiceGoods(searchCode.value)
  if (res.length === 0) {
    $toast.error('没有找到该商品')
  }
  else {
    const { id, code, quality, gem, weight_metal, name, material, category, label_price, weight_total, craft, brand, clarity, remark, color_gem, weight_gem } = res[0]
    Object.assign(nowServiceGoods.value, { product_id: id, code, quality, gem, weight_metal, name, material, category, label_price, weight_total, craft, brand, clarity_gem: clarity, remark, color_gem, weight_gem })
    nowServiceGoods.value.weight_metal = Number(nowServiceGoods.value.weight_metal)
    nowServiceGoods.value.is_our = true
  }
}
// 扫码
const { useWxWork } = useWxworkStore()
const scanCode = async () => {
  const wx = await useWxWork()
  const code = await wx?.scanQRCode()
  if (code) {
    searchShow.value = true
    searchCode.value = code
    nowServiceGoods.value = {} as serviceGoods
    search()
  }
}
</script>

<template>
  <div>
    <common-model
      v-model="searchShow" title="条码搜索" :show-ok="true" :show-cancel="true" @confirm="searchConfirm()" @cancel="() => {
        searchCode = ''
        nowServiceGoods = {}
        searchShow = false
      }">
      <div class="grid-12 h-[400px] overflow-y-auto">
        <div class="col-12">
          <div class="flex items-center pb-[16px]">
            <div class="flex-1">
              <n-input
                v-model:value="searchCode"
                size="large"
                type="text"
                clearable
                placeholder="请输入商品条码" @focus="focus" />
            </div>
            <div class="pl-[16px] flex">
              <n-button type="info" round @click="search()">
                搜索
              </n-button>
              <template v-if="checkEnv()">
                <div class="pl-[8px]">
                  <n-button strong secondary type="info" round @click="scanCode()">
                    扫码
                  </n-button>
                </div>
              </template>
            </div>
          </div>
          <div class=" py-[16px]">
            <div>
              <template v-if="Object.keys(nowServiceGoods).length !== 0">
                <n-form ref="oldMasterRef" :model="nowServiceGoods" :rules="oldRules">
                  <n-grid :cols="24" :x-gap="8">
                    <n-form-item-gi
                      :span="12" label="是否本司货品">
                      {{ nowServiceGoods.is_our ? '是' : '否' }}
                    </n-form-item-gi>
                    <n-form-item-gi
                      :span="12" label="条码">
                      {{ nowServiceGoods.code }}
                    </n-form-item-gi>
                    <n-form-item-gi
                      :span="12" label="货品名称">
                      <span class="color-[#0074FC]">{{ nowServiceGoods.name }}</span>
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="金重" path="weight_metal">
                      <n-input-number
                        v-model:value="nowServiceGoods.weight_metal"
                        :show-button="false"
                        placeholder="请输入金重"
                        round
                        min="0"
                        :precision="3"
                        @focus="focus"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="备注" path="remark">
                      <n-input
                        v-model:value="nowServiceGoods.remark"
                        :rows="1"
                        type="textarea"
                        :show-button="false"
                        placeholder="请输入备注"
                        round
                        min="0"
                        :precision="3"
                        @focus="focus"
                      />
                    </n-form-item-gi>
                  </n-grid>
                </n-form>
              </template>
              <template v-else>
                <common-empty text="暂无数据" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>

</style>
