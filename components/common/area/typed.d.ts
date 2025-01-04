interface areaitem {
  value: string
  text: string
  children: areaitem[]
}
interface ProvinceTab extends areaitem {
  name: string // 新增属性
}
