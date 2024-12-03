<script setup lang="ts">
import { useCascaderAreaData } from '@vant/area-data'

const store = useStores()

// 当前选中的省市区
const cascaderValue = ref('')
// 上级门店
const upStore = ref('')
// 上级门店列表
const upStoreList = ref([{
  text: '郑州总店',
  value: '330000',
  children: [{ text: '二七店', value: '330100' }],
}, {
  text: '开封总店',
  value: '111111',
}])
// 上级门店选择器显示状态
const upStoreShow = ref(false)

// 省市区数据
const options = useCascaderAreaData()
// 顶部搜索框
const searchKey = ref('')
const complate = ref(0)
// 搜索弹窗显示状态
const show = ref(false)
// 地址选择器显示状态
const addressShow = ref(false)
// 用于显示 上级门店中文 和  省市区中文
const showName = ref({
  parent_name: '',
  province_name: '',
})
// 表单数据
const formList = ref<filterForm>({
  parent_id: undefined,
  address: undefined,
  name: undefined,
  province: undefined,
  city: undefined,
  district: undefined,
  contact: undefined,
  wxwork_id: undefined,
})

useSeoMeta({
  title: '门店列表',
})
/**
 * 在表单提交完成时调用的函数
 * 该函数主要用于更新表单数据和控制地址选择器的显示状态
 * @param {object} values - 包含选定地址信息的对象
 */
const onFinish = (values: any) => {
  // 更新表单数据中的省份信息
  formList.value.province = values.selectedOptions[0].value
  // 更新表单数据中的城市信息
  formList.value.city = values.selectedOptions[1].value
  // 更新表单数据中的地区信息
  formList.value.district = values.selectedOptions[2].value
  // 更新显示名称，合并省份、城市和地区的文本
  showName.value.province_name = values.selectedOptions[0].text + values.selectedOptions[1].text + values.selectedOptions[2].text
  // 隐藏地址选择器
  addressShow.value = false
}
/**
 * 完成上级门店选择操作
 * 此函数在选择上级门店后调用，用于更新界面显示和表单数据
 * @param {object} values - 包含选定门店信息的对象
 *        - value: 选定的门店ID
 *        - selectedOptions: 选定的门店选项数组
 *        - tabIndex: 当前选项卡的索引
 */
const finshUpStore = (values: any) => {
  // 隐藏上级门店选择界面
  upStoreShow.value = false
  // 更新表单中的上级门店ID
  formList.value.parent_id = values.value
  // 更新显示的上级门店名称
  showName.value.parent_name = values.selectedOptions[values.tabIndex].text
}

const searchFn = async () => {
  await store.getStoreList({ page: 1, limit: 10, where: formList.value })
}
</script>

<template>
  <div>
    <!-- 筛选 -->
    <product-filter
      v-model:id="complate" v-model:search="searchKey">
      <template #company>
        <product-manage-company
          @click="() => {
            show = true
          }" />
      </template>
    </product-filter>
    <!-- 小卡片组件 -->
    <div class="px-[16px]">
      <product-manage-card />
    </div>

    <common-popup v-model="show">
      <div class="p-[16px] bg-[#F1F5FE] h-full">
        <stores-search
          v-model="formList"
          :show-name="showName"
          @select-city="addressShow = true"
          @select-store="upStoreShow = true"
          @clean-province="() => {
            // 清空省市区
            formList.province = undefined
            formList.city = undefined
            formList.district = undefined
            cascaderValue = ''
          }"
          @clean-parent-id="() => {
            // 情况上级门店
            formList.parent_id = undefined
          }"
          @submit="searchFn" />
      </div>
    </common-popup>
    <van-popup v-model:show="addressShow" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="options"
        @close="addressShow = false"
        @finish="onFinish"
      />
    </van-popup>

    <van-popup v-model:show="upStoreShow" round position="bottom">
      <van-cascader
        v-model="upStore"
        title="请选择上级门店"
        :options="upStoreList"
        @close="upStoreShow = false"
        @finish="finshUpStore"
      />
    </van-popup>
  </div>
</template>
