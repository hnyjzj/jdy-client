<script lang="ts" setup>
import type { UploadFileInfo } from 'naive-ui'

useSeoMeta({
  title: '新增维修单',
})
const { myStore, StoreStaffList } = storeToRefs(useStores())
const { getStoreStaffList } = useStores()
const { getMemberList } = useMemberManage()
const { memberList } = storeToRefs(useMemberManage())
const { createMember } = useMemberManage()
const { OldMaterialsWhere } = useOrder()
const { getAddRepairOrderWhere, createRepairOrder, getRepairOrderWhere, uploadRepairOrderImg } = useRepair()
const { repairGoodsFilterListToArray, repairFilterList } = storeToRefs(useRepair())
const { getFinishedList } = useFinished()
const { finishedList } = storeToRefs(useFinished())
const layoutLoading = ref(false)
await OldMaterialsWhere()
await getAddRepairOrderWhere()
await getRepairOrderWhere()

const searchServiceGoods = async (val: string) => {
  await getFinishedList({ page: 1, limit: 5, where: { store_id: myStore.value.id, code: val, all: true, status: 5 } })
  return finishedList.value || []
}
const { $toast } = useNuxtApp()
// 新增会员
const addNewMember = async (val: Member) => await createMember(val)
// 获取门店员工列表
const getStaff = async () => {
  const res = await getStoreStaffList({ id: myStore.value.id })
  if (res) {
    $toast.error(res?.data.value?.message || '获取员工列表失败')
  }
}
const areaBorder = ref(false)
const region = ref({
  province: undefined,
  district: undefined,
  city: undefined,
})
const showServiceGoods = ref<serviceGoods[]>([]) // 展示维修货品
const previewFileList = ref<UploadFileInfo[]>([])
const formRef = ref()
const initform = ref<serviceOrederCreate>({
  store_id: '',
  receptionist_id: undefined,
  member_id: undefined,
  desc: '',
  name: '', // 维修项目
  expense: undefined, // 维修费用
  cost: undefined, // 维修成本
  delivery_method: 1, // 1: '自提', 2: '配送'
  address: undefined,
  products: [],
  payments: [{ amount: undefined, payment_method: 1 }],
  images: [],
})
const formData = ref<serviceOrederCreate>({
  store_id: '',
  receptionist_id: undefined,
  member_id: undefined,
  desc: '',
  name: '', // 维修项目
  expense: undefined, // 维修费用
  cost: undefined, // 维修成本
  delivery_method: 1, // 1: '自提', 2: '配送'
  address: undefined,
  products: [],
  payments: [{ amount: undefined, payment_method: 1 }],
  images: [],
})
const rules = {
  receptionist_id: { required: true, message: '请选择接待人', trigger: ['blur', 'change'] },
  cashier_id: { required: true, message: '请选择收银员', trigger: ['blur', 'change'] },
  name: { required: true, message: '请输入项目名称', trigger: ['blur', 'change'] },
  desc: { required: true, message: '请输入项目描述', trigger: ['blur', 'change'] },

}

const vilidateArea = () => {
  if (region.value.province === '' || region.value.city === '' || region.value.district === '' || region.value.province === undefined || region.value.city === undefined || region.value.district === undefined) {
    areaBorder.value = true
    return false
  }
  formData.value.province = region.value.province
  formData.value.city = region.value.city
  formData.value.area = region.value.district
  return true
}
// 获取会员列表
const getMember = async (val: string) => {
  await getMemberList({ page: 1, limit: 5, where: { phone: val } })
  return memberList.value || []
}
const Key = ref()
// 点击验证表单
const handleValidateButtonClick = async (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      formData.value.store_id = myStore.value.id
      if (!formData.value.member_id) {
        $toast.error('请先添加会员')
        return
      }
      // 如果选择邮寄,判断省市区是否选择
      if (formData.value.delivery_method === 2) {
        if (!vilidateArea()) {
          $toast.error('请选择省市区')
          return false
        }
      }
      else {
        formData.value.province = undefined
        formData.value.city = undefined
        formData.value.area = undefined
      }

      formData.value.products = [...showServiceGoods.value]
      formData.value.images = []
      previewFileList.value.forEach((item: UploadFileInfo) => {
        formData.value.images?.push(item.name as string)
      })
      layoutLoading.value = true
      try {
        const res = await createRepairOrder(formData.value)
        if (res) {
          $toast.success('创建维修单成功')
          navigateTo('/sale/service/list', { external: true, replace: true, redirectCode: 200 })
          showServiceGoods.value = []
          previewFileList.value = []
          formData.value = { ...initform.value }
          Key.value = Date.now().toString()
        }
        else {
          $toast.error(res || '创建维修单失败')
        }
        layoutLoading.value = false
      }
      catch (error: any) {
        layoutLoading.value = false
        throw new Error(error)
      }
    }
    else {
      $toast.error('请填写必填信息')
      if (formData.value.delivery_method === 2) {
        if (!vilidateArea()) {
          return false
        }
      }
      else {
        formData.value.province = undefined
        formData.value.city = undefined
        formData.value.area = undefined
      }
    }
  })
}

const uploadFile = async (file: any) => {
  const { data } = await uploadRepairOrderImg({ image: file || undefined })
  if (data.value?.code !== HttpCode.SUCCESS) {
    $toast.error(data.value?.message || '上传失败')
    return false
  }
  return data.value.data.url
}
// 切换门店的操作
const changeStore = () => {
  showServiceGoods.value = []
  previewFileList.value = []
  formData.value = { ...initform.value }
  Key.value = Date.now().toString()
}
const orderObject = ref<Orders>({} as Orders)
</script>

<template>
  <div>
    <div :key="Key" class="grid-12">
      <div class="flex flex-col w-auto gap-[16px] px-[16px] py-[16px] pb-[80px] col-12" uno-xs="col-12" uno-sm="col-8 offset-2" uno-md="col-6 offset-3">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-align="left"
          size="large"
        >
          <div class="w-[120px] color-[#fff] pb-[12px]">
            <product-manage-company :confirm="true" @change="changeStore" />
          </div>
          <div class="pb-[16px]">
            <sale-service-add-base
              v-model:region="region"
              v-model:form="formData"
              :area-border="areaBorder"
              :staffs="StoreStaffList"
              :get-staff="getStaff" />
          </div>

          <sale-add-member
            v-model="orderObject"
            :get-member="getMember"
            :store="myStore"
            :staffs="StoreStaffList"
            :get-staffs="getStaff"
            :add-new-member="addNewMember"
            @set-member-id="formData.member_id = $event"
          />
          <div class="pb-[16px]">
            <sale-service-add-product
              v-model:list="showServiceGoods"
              title="维修货品"
              :repair-goods-filter-list="repairGoodsFilterListToArray"
              :search-service-goods="searchServiceGoods"
            />
          </div>

          <div class="pb-[16px]">
            <sale-service-add-pictures v-model:pictures="previewFileList" :upload-file="uploadFile" />
          </div>
          <div class="pb-[16px]">
            <sale-service-add-balance v-model="formData" :filter-list="repairFilterList" />
          </div>

          <div class="h-[80px] bg-[#fff] fixed z-1">
            <div class="btn grid-12 px-[16px]">
              <div class="col-12 cursor-pointer" uno-xs="col-12" uno-sm="col-8 offset-2" uno-md="col-6 offset-3" @click="handleValidateButtonClick">
                <common-button-rounded content="开单" />
              </div>
            </div>
          </div>
        </n-form>
      </div>
    </div>
    <common-loading v-model="layoutLoading" />
  </div>
</template>

<style lang="scss" scoped>
.btn {
  --uno: 'fixed bottom-0 left-0 right-0 blur-bga pt-20px pb-[28px] text-[16px] font-bold border-t-[1px] border-t-solid border-[#E0E0E0]';
  &-right {
    background: linear-gradient(to bottom, #1a6beb, #6ea6ff);
    box-shadow: rgba(110, 166, 255, 0.3) 0px 6px 6px;
    --uno: 'text-[16px] py-[8px] border-none flex-1 rounded-[36px] ml-[8px] text-[#FFFFFF]';
  }
}
</style>
