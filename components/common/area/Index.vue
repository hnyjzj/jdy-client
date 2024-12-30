<script setup lang="ts">
import type { TabsInst } from 'naive-ui'
import { useCascaderAreaData } from '@vant/area-data'

const emits = defineEmits<{
  onFinish: [val: ProvinceTab[]] // 完成选择
}>()
const show = defineModel('show')
const options = useCascaderAreaData()
const selectProvinceTab = ref<ProvinceTab[]>([{ name: 'province', text: '请选择', value: '', children: [] as areaitem[] }])

const tabindex = ref('province')
const tabsInstRef = ref<TabsInst | null>(null)
// 选择省市区
const Next = (val: areaitem, index: number) => {
  selectProvinceTab.value[index].text = val.text
  selectProvinceTab.value[index].value = val.value
  if (index === 2) {
    // 导出数据
    emits('onFinish', selectProvinceTab.value)
    show.value = false
    return
  }
  selectProvinceTab.value.push({ name: index === 0 ? 'city' : index === 1 ? 'area' : '', text: '请选择', value: '', children: [] as areaitem[] })
  selectProvinceTab.value[index + 1].children = val.children
  nextTick(() => {
    tabindex.value = selectProvinceTab.value[index + 1].name
  })
}
// 点击选择左侧省市区
const selectTab = (val: string) => {
  if (val === 'province') {
    selectProvinceTab.value = [{ name: 'province', text: '请选择', value: '', children: [] as areaitem[] }]
  }
  else if (val === 'city') {
    selectProvinceTab.value.splice(-1, 1)
  }
}
// 设置默认地址 ，传入 [province, city, area] 例如：['110000', '110100', '110101']
const setDefault = (val: string[]) => {
  // 初始化省市区选项
  selectProvinceTab.value = [{ name: 'province', text: '请选择', value: '', children: [] as areaitem[] }]

  // 查找省份
  const province = options.find(item => item.value === val[0]) as areaitem
  if (!province)
    return
  // 更新ui
  Next(province, 0)

  // 查找城市
  const city = province.children?.find(item => item.value === val[1])
  if (!city)
    return
  Next(city, 1)

  // 查找区县
  const area = city.children?.find(item => item.value === val[2])
  if (!area)
    return
  Next(area, 2)
}
defineExpose({
  setDefault,
})
</script>

<template>
  <template v-if="show">
    <div class="area-box">
      <div class="flex-between px-[4px] py-[2px]">
        <div class="font-semibold pl-[4px] text-[14px]">
          <!-- 省市区选择 -->
        </div>
        <div class="colse flex-center-row  w-[30px]  h-[30px] z-10" @click="show = false">
          <icon name="i-icon:error" color="#666" size="24" />
        </div>
      </div>
      <n-tabs
        ref="tabsInstRef" v-model:value="tabindex" type="line" placement="left" size="small" animated @update:value="selectTab">
        <template v-for="(items, index) in selectProvinceTab" :key="index">
          <n-tab-pane :name="items.name" :tab="items.text">
            <div class="content">
              <template v-for="select_item in (index === 0 ? options : items.children)" :key="select_item.value">
                <div class="province py-[6px] cursor-pointer pl-[6px]" :style="{ color: items.value === select_item.value ? '#18A058' : '' }" @click="Next(select_item as areaitem, index)">
                  {{ select_item.text }}
                </div>
              </template>
            </div>
          </n-tab-pane>
        </template>
      </n-tabs>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.area-box {
  --uno: ' bg-[#fff] relative z-9999 rounded-16px';
  .content {
    --uno: 'h-300px ';
    overflow-y: auto;
    .province:hover {
      background: #ececec;
      border-radius: 10px;
    }
  }
}
</style>
