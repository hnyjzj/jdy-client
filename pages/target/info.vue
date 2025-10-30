<script lang="ts" setup>
const { myStore } = storeToRefs(useStores())

const { getTargetWhere, getTargetInfo, getPersonalWhere } = useTarget()
const { targetInfo, targetFilterListToArray } = storeToRefs(useTarget())
const route = useRoute()
useSeoMeta({
  title: '销售目标详情',
})

async function handleValidateButtonClick() {
  jump('/target/update', { id: route.query.id })
}

function getMultipleLabel(arr: any, preset: any) {
  if (!arr || !preset)
    return ''

  return arr.map((item: number) => preset[item]).join(',')
}

if (route.query.id) {
  await getTargetInfo(route.query.id as string)
  await getTargetWhere()
  await getPersonalWhere()
}

/**
 * 统计
 * @param group 目标组 不传时计算全部
 * @param key 字段名
 */
function statistics(key: string, group?: TargetGroup): number {
  try {
    let relevantPersonals = targetInfo.value.personals // 默认整个数组

    // 如果 group 提供，才按组过滤
    if (group) {
      relevantPersonals = targetInfo.value.personals.filter((cur: any) => {
        return cur.group.id === group.id
      })
    }

    // 如果没有项，直接返回 0
    if (relevantPersonals.length === 0) {
      return 0
    }

    // 累加计算指定 key 的值
    const sum = relevantPersonals.reduce((pre: number, cur: any) => {
      const value = cur[key]
      if (value !== undefined && value !== null && !Number.isNaN(Number(value))) {
        return pre + Number(value)
      }
      return pre
    }, 0)

    // 保留两位小数（四舍五入）
    return Math.round(sum * 100) / 100
  }
  catch {
    return 0
  }
}

function isShowGoods(item: any) {
  if (!Array.isArray(targetInfo.value[item.name as keyof TargetInfo]))
    return false
  return true
}

function percent(achieved: any, purpose: any, digits = 0) {
  const a = Number(achieved) || 0
  const p = Number(purpose) || 0
  if (p <= 0)
    return (0).toFixed(digits)
  return ((a / p) * 100).toFixed(digits)
}
</script>

<template>
  <div class="pb-20 pt-4 px-4">
    <common-layout-center>
      <common-gradient title="基础信息">
        <template #body>
          <div class="flex flex-col gap-2">
            <div class="operation-information flex flex-col gap-1">
              <div class="other-information flex flex-col gap-1" uno-sm="grid grid-cols-[1fr_1fr] gap-x-10">
                <template v-for="(item, index) in targetFilterListToArray" :key="index">
                  <template v-if="item.input === 'multiple'">
                    <template v-if="isShowGoods(item)">
                      <div class="info-row">
                        <div class="info-title">
                          {{ item.label }}
                        </div>
                        <div class="info-val">
                          <div class="text-align-end" style="word-break:break-all;">
                            {{ getMultipleLabel(targetInfo[item.name], item.preset) }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <div class="info-row">
                      <div class="info-title">
                        {{ item.label }}
                      </div>
                      <div class="info-val">
                        <div class="text-align-end" style="word-break:break-all;">
                          <template v-if="item.name === 'store_id'">
                            {{ targetInfo?.store?.name }}
                          </template>
                          <template v-else>
                            <template v-if="item.input === 'radio'">
                              {{ item.preset[String(targetInfo[item.name])] || '' }}
                            </template>
                            <template v-else-if="item.input === 'date' || item.input === 'datetime'">
                              {{ targetInfo[item.name] ? formatTimestampToDateTime(String(targetInfo[item.name])) : '' }}
                            </template>
                            <template v-else-if="item.input === 'switch'">
                              {{ targetInfo[item.name] ? '是' : '否' }}
                            </template>
                            <template v-else>
                              {{ targetInfo[item.name] }}
                            </template>
                          </template>
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
                <div class="info-row">
                  <div class="info-title">
                    状态
                  </div>
                  <div class="info-val">
                    {{ getTimeStatus(targetInfo.start_time, targetInfo.end_time) }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    总目标
                  </div>
                  <div class="info-val">
                    {{ statistics('purpose') }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    总完成
                  </div>
                  <div class="info-val">
                    {{ statistics('achieved') }}
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-title">
                    总完成率
                  </div>
                  <div class="info-val">
                    {{ percent(statistics('achieved'), statistics('purpose'), 2) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </common-gradient>
      <common-gradient title="销售目标详情">
        <template #body>
          <template v-if="targetInfo.object === 1">
            <div v-for="(group, gIndex) in targetInfo.groups" :key="gIndex" class="mb-6">
              <div class="flex items-center gap-2 text-wrap flex-wrap">
                <div class="font-bold text-xxl mb-2 mr-1 whitespace-nowrap">
                  {{ group.name }}
                </div>
                <div class="text-xxl mb-2 whitespace-nowrap">
                  总目标：{{ statistics('purpose', group) }}
                </div>
                <div class="text-xxl mb-2 whitespace-nowrap">
                  总完成：{{ statistics('achieved', group) }}
                </div>
                <div class="text-xxl mb-2 whitespace-nowrap">
                  完成率：{{ percent(statistics('achieved', group), statistics('purpose', group), 2) }}%
                </div>
              </div>

              <!-- 表格 -->
              <table class="w-full border border-gray-400" style="border:1px solid #eee;border-collapse: collapse;">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="px-4 py-2 text-left border-b border-gray-200 text-center">
                      员工
                    </th>
                    <th class="px-4 py-2 text-left border-b border-gray-200 text-center">
                      目标
                    </th>
                    <th class="px-4 py-2 text-left border-b border-gray-200 text-center">
                      已完成
                    </th>
                    <th class="px-4 py-2 text-left border-b border-gray-200 text-center">
                      完成率
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <template v-for="(personal, pIndex) in targetInfo.personals" :key="pIndex">
                    <template v-if="personal.group_id === group.id">
                      <tr>
                        <td class="px-4 py-2 border-b border-gray-100">
                          <div class="flex items-center">
                            <img :src="personal.staff.avatar" alt="widthfix" width="26" class="rounded-full">
                            <div class="ml-2">
                              <div>
                                {{ personal.staff.nickname }}
                              </div>
                              <template v-if="personal.is_leader">
                                <div class="text-xs text-blue-500">
                                  组长
                                </div>
                              </template>
                            </div>
                          </div>
                        </td>
                        <td class="px-4 py-2 border-b border-gray-100">
                          {{ personal.purpose }}
                        </td>
                        <td class="px-4 py-2 border-b border-gray-100">
                          {{ personal.achieved }}
                        </td>
                        <td class="px-4 py-2 border-b border-gray-100">
                          {{ percent(personal.achieved, personal.purpose, 2) }}%
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else>
            <!-- 表格 -->
            <table class="w-full border border-gray-400" style="border:1px solid #eee;border-collapse: collapse;">
              <thead>
                <tr class="bg-gray-100">
                  <th class="px-4 py-2 text-left border-b border-gray-200 text-center">
                    员工
                  </th>
                  <th class="px-4 py-2 text-left border-b border-gray-200 text-center">
                    目标
                  </th>
                  <th class="px-4 py-2 text-left border-b border-gray-200 text-center">
                    已完成
                  </th>
                  <th class="px-4 py-2 text-left border-b border-gray-200 text-center">
                    完成率
                  </th>
                </tr>
              </thead>

              <tbody>
                <template v-for="(personal, pIndex) in targetInfo.personals" :key="pIndex">
                  <tr>
                    <td class="px-4 py-2 border-b border-gray-100">
                      <div class="flex items-center">
                        <img :src="personal.staff.avatar" alt="widthfix" width="26" class="rounded-full">
                        <div class="ml-2">
                          {{ personal.staff.nickname }}
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-2 border-b border-gray-100">
                      {{ personal.purpose }}
                    </td>
                    <td class="px-4 py-2 border-b border-gray-100">
                      {{ personal.achieved }}
                    </td>
                    <td class="px-4 py-2 border-b border-gray-100">
                      {{ ((Number(personal.achieved) / Number(personal.purpose)) * 100).toFixed(2) }}%
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
        </template>
      </common-gradient>
    </common-layout-center>
    <template v-if="myStore.id">
      <div class="fixed bottom-0 left-0 w-full py-4 blur-bgc px-8" uno-sm="px-0">
        <common-layout-center>
          <common-button-rounded content="编辑销售目标" @button-click="handleValidateButtonClick" />
        </common-layout-center>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.info-row {
  --uno: 'flex justify-between mb-2';
  .info-title {
    --uno: 'text-color';
  }
  .info-val {
    --uno: 'text-color-light w-70% text-right';
  }
}
</style>
