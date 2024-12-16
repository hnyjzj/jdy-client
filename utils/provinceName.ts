import { areaList } from '@vant/area-data'

export const toProvinces = (province: string, city: string, area: string): string => {
  try {
    const provinceName = areaList.province_list[province] || ''
    const cityName = areaList.city_list[city] || ''
    const areaName = areaList.county_list[area] || ''

    return `${provinceName}${cityName}${areaName}`
  }
  catch (error) {
    console.error('区域代码解析失败:', error)
    return ''
  }
}
