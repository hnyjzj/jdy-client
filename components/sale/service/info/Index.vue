<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui'

const props = defineProps<{
  detail: ServiceOrderInfo
  finishedWhere: Where<ProductFinisheds>
  orderWhere: Where<service>
  identity: number
  store: string
  updateOrder: (req: updateRepairParams) => Promise<boolean>
  uploadFile: (file: any) => Promise<string | false>
  refund: (req: { id: string, remark: string }) => Promise<boolean>
  getDetail: () => void
  operation: (req: { id: string, operation: number }) => Promise<boolean>
}>()
const router = useRouter()
const { $toast } = useNuxtApp()
const previewFileList = ref<UploadFileInfo[]>([])
const region = ref({} as { province: string, city: string, district: string })
const areaBorder = ref(false)

const form = ref({
  id: props.detail.id,
  name: '',
  desc: '',
  delivery_method: 1,
  images: [],
  address: undefined,
} as updateRepairParams)
if (props.detail.name) {
  form.value.name = props.detail.name
}
if (props.detail.desc) {
  form.value.desc = props.detail.desc
}
if (props.detail.delivery_method) {
  form.value.delivery_method = props.detail.delivery_method
  if (props.detail.delivery_method === 2) {
    region.value = {
      province: props.detail.province || '',
      city: props.detail.city || '',
      district: props.detail.area || '',
    }
    form.value.address = props.detail.address || ''
  }
}
if (props.detail.images?.length) {
  props.detail.images?.forEach((item) => {
    previewFileList.value.push({
      id: useId(),
      name: item,
      status: 'finished',
      url: ImageUrl(item),
    })
  })
}
// 更新
const updateButton = async () => {
  if (props.store !== props.detail.store_id) {
    $toast.error('当前门店与操作门店不匹配,无法操作')
    return
  }
  if (props.detail.status === serviceOrderStatus.Completed) {
    return $toast.error('已完成订单无法修改')
  }
  if (props.detail.status === serviceOrderStatus.Cancelled) {
    return $toast.error('已取消订单无法修改')
  }
  if (form.value.delivery_method === 2) {
    form.value.province = region.value.province
    form.value.city = region.value.city
    form.value.area = region.value.district
  }
  form.value.images = []
  previewFileList.value.forEach((item) => {
    form.value.images?.push(item.name)
  })
  // 更新请求
  const res = await props.updateOrder(form.value)
  if (res) {
    $toast.success('更新成功')
    await props.getDetail()
  }
  else {
    $toast.error('更新失败')
  }
}
const showModel = ref(false)
const dialog = ref(false)
const tipsTitle = ref('')
const tipsText = ref('')
const tipsTextb = ref('')
// 操作/标记

const changeParams = {
  id: props.detail.id,
  operation: props.detail.status,
}
const changeStatusBtn = async () => {
  if (props.store !== props.detail.store_id) {
    $toast.error('当前门店与操作门店不匹配,无法操作')
    return
  }

  if (props.detail.status === serviceOrderStatus.Refund) {
    $toast.error('已退款不支持标记操作')
    return
  }
  if (props.detail.status === serviceOrderStatus.Cancelled) {
    $toast.error('已取消不支持标记操作')
    return
  }
  // 当前门店已收货 ,标记为送去维修
  if (props.detail.status === serviceOrderStatus.StoreReceived) {
    changeParams.operation = serviceOrderStatus.SentForRepair
    tipsTitle.value = '标记已送出维修'
    tipsText.value = '门店收货，已送出到总部或者工厂维修'
    dialog.value = true
    return
  }
  // 当前 已送出维修 标记为维修中
  if (props.detail.status === serviceOrderStatus.SentForRepair) {
    changeParams.operation = serviceOrderStatus.UnderRepair
    tipsTitle.value = '标记维修中'
    tipsText.value = '总部或工厂已收到货，确认无误，正在维修'
    dialog.value = true
    return
  }
  // 当前 维修中 标记为维修已送回
  if (props.detail.status === serviceOrderStatus.UnderRepair) {
    changeParams.operation = serviceOrderStatus.RepairedAndReturned
    tipsTitle.value = '标记已维修送回'
    tipsText.value = '总部或工厂已维修完成，确认无误，已送回门店'
    dialog.value = true
    return
  }
  // 当前 维修已送回 标记为 待取货
  if (props.detail.status === serviceOrderStatus.RepairedAndReturned) {
    changeParams.operation = serviceOrderStatus.ReadyForPickup
    tipsTitle.value = '标记顾客待取货'
    tipsText.value = '门店已收到维修完成的货，确认无误，通知顾客取货'
    dialog.value = true
  }

  // 标记已取货
  if (props.detail.status === serviceOrderStatus.ReadyForPickup) {
    changeParams.operation = serviceOrderStatus.Completed
    tipsTitle.value = '标记已取货'
    tipsText.value = '请确认顾客已收到货品，再点击确认收货'
    dialog.value = true
  }
}

const confirmChange = async () => {
  const res = await props.operation(changeParams)
  if (res) {
    $toast.success('操作成功')
    await props.getDetail()
  }
}
</script>

<template>
  <div class="grid-12 gap-[12px]">
    <div class="col-12" uno-sm="col-6 offset-3" uno-md="col-6 offset-3" uno-lg="col-4 offset-4" uno-lt="col-3">
      <common-card-info title="基础信息">
        <template #info>
          <div class="info">
            <common-cell label="门店" :value="props.detail.store?.name!" rcol="col-8" lcol="col-4" />
            <common-cell label="门店电话" :value="props.detail.store?.phone" rcol="col-8" lcol="col-4" />
            <common-cell label="维修单编号" :value="props.detail.id" rcol="col-8" lcol="col-4" />
            <common-cell label="维修单状态" :value="props.orderWhere.status?.preset[props.detail.status] " rcol="col-8" lcol="col-4" val-color="#0B57D0" />
            <common-cell label="接待人" :value="props.detail.operator?.nickname" rcol="col-8" lcol="col-4" />
            <common-cell label="会员昵称" :value="props.detail.member?.nickname" rcol="col-8" lcol="col-4" />
            <common-cell label="会员信息" :value="props.detail.member?.phone" rcol="col-8" lcol="col-4" />
            <common-cell label="维修费" :value="props.detail.expense" rcol="col-8" lcol="col-4" />
            <common-cell label="维修成本" :value="props.detail.cost" rcol="col-8" lcol="col-4" />
            <n-grid x-gap="12" :cols="2" :y-gap="12">
              <n-grid-item>
                <div class="pb-[8px]">
                  维修项目
                </div>
                <n-input v-model:value="form.name" type="text" placeholder="维修项目" :disabled="props.detail.status === serviceOrderStatus.Completed" @focus="focus" />
              </n-grid-item>
              <n-grid-item>
                <div class="pb-[8px]">
                  问题描述
                </div>
                <n-input v-model:value="form.desc" type="text" placeholder="问题描述" :disabled="props.detail.status === serviceOrderStatus.Completed" @focus="focus" />
              </n-grid-item>

              <n-grid-item>
                <div class="pb-[8px]">
                  取货方式
                </div>
                <div>
                  <n-radio-group v-model:value="form.delivery_method" name="radiogroup" :disabled="props.detail.status === serviceOrderStatus.Completed">
                    <n-space>
                      <n-radio
                        v-for="(items, index) in [{ value: 1, label: '自提' }, { value: 2, label: '邮寄' }]" :key="index" :value="items.value" :style="{
                          '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                          '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                          '--n-dot-color-active': '#0068ff',
                          '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
                        {{ items.label }}
                      </n-radio>
                    </n-space>
                  </n-radio-group>
                </div>
              </n-grid-item>
              <template v-if="form.delivery_method === 2">
                <n-grid-item :span="2">
                  <div class="pb-[8px]">
                    省市区选择
                  </div>
                  <common-area-select :disabled="props.detail.status === serviceOrderStatus.Completed" :border="areaBorder" :is-required="false" :showtitle="false" :form="region" />
                </n-grid-item>

                <n-grid-item :span="2">
                  <div class="pb-[8px]">
                    详细地址
                  </div>
                  <n-input v-model:value="form.address" type="text" placeholder="详细地址" :disabled="props.detail.status === serviceOrderStatus.Completed" @focus="focus" />
                </n-grid-item>
              </template>
            </n-grid>
          </div>
        </template>
      </common-card-info>

      <div class="pt-[16px]">
        <common-card-info title="货品信息">
          <template #info>
            <div>
              <template v-for="(item, index) in props.detail.products" :key="index">
                <common-cell label="条码" :value="item.code" rcol="col-8" lcol="col-4" />
                <common-cell label="货品名称" :value="item.name" rcol="col-8" lcol="col-4" />
                <common-cell label="本店货品" :value="item.is_our" rcol="col-8" lcol="col-4" />
                <common-cell label="材质" :value="props.finishedWhere.material?.preset[item.material!]" rcol="col-8" lcol="col-4" />
                <common-cell label="成色" :value="props.finishedWhere.quality?.preset[item.quality!]" rcol="col-8" lcol="col-4" />
                <common-cell label="主石" :value="props.finishedWhere.gem?.preset[item.gem!] " rcol="col-8" lcol="col-4" />
                <common-cell label="品类" :value="props.finishedWhere.category?.preset[item.category!] " rcol="col-8" lcol="col-4" />
                <common-cell label="金重" :value="item.weight_metal" rcol="col-8" lcol="col-4" />
                <common-cell label="主石重" :value="item.weight_gem" rcol="col-8" lcol="col-4" />
                <common-cell label="主石颜色" :value="props.finishedWhere.color_gem?.preset[item.color_gem!] " rcol="col-8" lcol="col-4" />
                <common-cell label="主石净度" :value="props.finishedWhere.clarity?.preset[item.clarity!] " rcol="col-8" lcol="col-4" />
                <common-cell label="总重" :value="item.weight_total" rcol="col-8" lcol="col-4" />
                <common-cell label="标签价" :value="item.label_price" rcol="col-8" lcol="col-4" />
                <common-cell label="备注" :value="item.remark" rcol="col-8" lcol="col-4" />
                <div class="line" />
                <template
                  v-if="item.status === serviceOrderStatus.StoreReceived && props?.identity > 1 && props.store === props.detail.store_id">
                  <div class="flex-end">
                    <common-button-rounded content="退款" @button-click="showModel = true" />
                  </div>
                </template>
              </template>
            </div>
          </template>
        </common-card-info>
      </div>
      <div class="pt-[16px]">
        <sale-service-add-pictures v-model:pictures="previewFileList" :detail="props.detail" :upload-file="uploadFile" />
      </div>
    </div>
    <div class="footer">
      <div class="grid-12 gap-[12px] px-[16px]">
        <div class="col-6 offset-3" uno-sm="col-4 offset-4">
          <div class="grid-12 gap-[12px]">
            <div class="col-6">
              <common-button-rounded
                content="更新" bgc="#0068FF" color="#FFF" @button-click="updateButton()" />
            </div>
            <div class="col-6">
              <template
                v-if="[
                  serviceOrderStatus.StoreReceived,
                  serviceOrderStatus.SentForRepair,
                  serviceOrderStatus.UnderRepair,
                  serviceOrderStatus.RepairedAndReturned,
                ].includes(props.detail.status)">
                <common-button-rounded
                  content="标记" bgc="#fff" color="#0068FF" @button-click="changeStatusBtn()" />
              </template>
              <template
                v-if="props.detail.status === serviceOrderStatus.ReadyForPickup">
                <common-button-rounded
                  content="取货" bgc="#fff" color="#0068FF" @button-click="changeStatusBtn()" />
              </template>
              <template
                v-if="[
                  serviceOrderStatus.Cancelled,
                  serviceOrderStatus.Completed,
                  serviceOrderStatus.PendingPayment,
                ].includes(props.detail.status)">
                <common-button-rounded
                  content="返回" bgc="#fff" color="#0068FF" @button-click="router.back()" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <sale-service-info-returnmoney v-model:show="showModel" :detail="props.detail" :return-money="props.refund" :get-detail="props.getDetail" />
    <common-confirm
      v-model:show="dialog"
      icon="warning"
      :title="tipsTitle"
      :text="tipsText"
      :textb="tipsTextb"
      @submit="confirmChange" />
  </div>
</template>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid #e6e6e8;
  --uno: 'fixed bottom-0 left-0 block w-full bg-[#F1F5FE] dark:bg-[rgba(0,0,0,0.6)] blur-8px py-3';
}
.info {
  --uno: 'flex flex-col gap-[3px]';
}
.line {
  --uno: 'h-[1px] w-full bg-[#E0E0E0] my-[8px]';
}
</style>
