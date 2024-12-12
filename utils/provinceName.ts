import { areaList } from '@vant/area-data'

export const toProvinces = (province: string, city: string, area: string) => {
  const name = ref('')
  Object.keys(areaList.province_list).forEach((key) => {
    if (key === province) {
      name.value += areaList.province_list[key]
    }
  })
  Object.keys(areaList.city_list).forEach((key) => {
    if (key === city) {
      name.value += areaList.city_list[key]
    }
  })
  Object.keys(areaList.county_list).forEach((key) => {
    if (key === area) {
      name.value += areaList.county_list[key]
    }
  })
  return name.value
}
