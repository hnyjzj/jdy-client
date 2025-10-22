<script lang="ts" setup>
const { getTargetWhere, getTargetInfo, getPersonalWhere } = useTarget()
const { targetInfo, targetFilterListToArray, personalFilterListToArray } = storeToRefs(useTarget())
// const { $toast } = useNuxtApp()
const route = useRoute()
useSeoMeta({
  title: '销售目标详情',
})

async function handleValidateButtonClick() {

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
</script>

<template>
  <div class="pb-20 pt-4 px-4">
    <common-layout>
      <div class="rounded-6 bg-white w-auto blur-bga top">
        <common-gradient title="基础信息">
          <template #body>
            <div class="flex flex-col gap-2">
              <div class="operation-information flex flex-col gap-1">
                <div class="other-information flex flex-col gap-1" uno-sm="grid grid-cols-[1fr_1fr] gap-x-10">
                  <template v-for="(item, index) in targetFilterListToArray" :key="index">
                    <div class="info-row">
                      <div class="info-title">
                        {{ item.label }}
                      </div>
                      <div class="info-val">
                        <div class="text-align-end">
                          <template v-if="item.name === 'store_id'">
                            {{ targetInfo?.store?.name }}
                          </template>
                          <template v-else>
                            <template v-if="item.input === 'radio'">
                              {{ item.preset[String(targetInfo[item.name])] || '' }}
                            </template>
                            <template v-else-if="item.input === 'date'">
                              {{ targetInfo[item.name] ? formatTimestampToDateTime(String(targetInfo[item.name])) : '' }}
                            </template>
                            <template v-else-if="item.input === 'switch'">
                              {{ targetInfo[item.name] ? '是' : '否' }}
                            </template>
                            <template v-else-if="item.input === 'multiple'">
                              {{ getMultipleLabel(targetInfo[item.name], item.preset) }}
                            </template>
                            <template v-else>
                              {{ targetInfo[item.name] }}
                            </template>
                          </template>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <template v-if="targetInfo.object === 1">
                <div v-for="(group, gIndex) in targetInfo.groups" :key="gIndex" class="mb-6">
                  <div class="flex items-center">
                    <div class="font-bold text-xxl mb-2">
                      {{ group.name }}
                    </div>
                  </div>

                  <!-- 表格 -->
                  <table class="w-full border border-gray-400" style="border:1px solid #eee;border-collapse: collapse;">
                    <thead>
                      <tr class="bg-gray-100">
                        <template v-for="({ label, find }, index) in personalFilterListToArray" :key="index">
                          <template v-if="find">
                            <th class="px-4 py-2 text-left border-b border-gray-200 text-center">
                              {{ label }}
                            </th>
                          </template>
                        </template>
                      </tr>
                    </thead>

                    <tbody>
                      <template v-for="(personal, pIndex) in targetInfo.personals" :key="pIndex">
                        <template v-if="personal.group_id === group.id">
                          <tr>
                            <template v-for="({ name, find, input }, index) in personalFilterListToArray" :key="index">
                              <template v-if="find">
                                <td class="px-4 py-2 border-b border-gray-100">
                                  <template v-if="name === 'staff_id'">
                                    {{ personal.staff.nickname }}
                                  </template>
                                  <template v-else>
                                    <template v-if="input === 'switch'">
                                      {{ personal[name] ? '是' : '否' }}
                                    </template>
                                    <template v-else>
                                      {{ personal[name] }}
                                    </template>
                                  </template>
                                </td>
                              </template>
                            </template>
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
                      <template v-for="({ label, find, name }, index) in personalFilterListToArray" :key="index">
                        <template v-if="find && name !== 'is_leader'">
                          <th class="px-4 py-2 text-left border-b border-gray-200 text-center">
                            {{ label }}
                          </th>
                        </template>
                      </template>
                    </tr>
                  </thead>

                  <tbody>
                    <template v-for="(personal, pIndex) in targetInfo.personals" :key="pIndex">
                      <tr>
                        <template v-for="({ name, find, input }, index) in personalFilterListToArray" :key="index">
                          <template v-if="find && name !== 'is_leader'">
                            <td class="px-4 py-2 border-b border-gray-100">
                              <template v-if="name === 'staff_id'">
                                {{ personal.staff.nickname }}
                              </template>
                              <template v-else>
                                <template v-if="input === 'switch'">
                                  {{ personal[name] ? '是' : '否' }}
                                </template>
                                <template v-else>
                                  {{ personal[name] }}
                                </template>
                              </template>
                            </td>
                          </template>
                        </template>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </template>
            </div>
          </template>
        </common-gradient>
      </div>
      <div class="top" />
    </common-layout>
    <div class="fixed bottom-0 left-0 w-full py-4 blur-bgc px-8" uno-sm="px-0">
      <common-layout-center>
        <common-button-rounded content="新增销售目标" @button-click="handleValidateButtonClick" />
      </common-layout-center>
    </div>
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
