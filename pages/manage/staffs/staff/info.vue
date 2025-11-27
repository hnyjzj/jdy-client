<script lang="ts" setup>
useSeoMeta({
  title: '员工详情',
})
const { $toast } = useNuxtApp()
const route = useRoute()
const { getStaffInfo, deleteStaff } = useStaff()
const { staffInfo } = storeToRefs(useStaff())
const { userinfo } = storeToRefs(useUser())
if (route.query.id) {
  getStaffInfo({ id: route.query.id as string })
}
const sex = (val: number) => {
  return val === 0 ? '未知' : val === 1 ? '男' : '女'
}

const router = useRouter()
const toEdit = () => {
  if (userinfo.value.identity > (staffInfo.value.identity as number)) {
    router.push(`/manage/staffs/staff/edit?id=${route.query.id}`)
  }
  else {
    $toast.error('权限不足')
  }
}
const confirmShow = ref(false)
const deleteConfirm = async () => {
  const res = await deleteStaff({ id: route.query.id as string })
  if (res) {
    $toast.success('删除成功')
  }
  else {
    $toast.error('删除失败')
  }
  router.back()
}

const delStaff = () => {
  confirmShow.value = true
}
</script>

<template>
  <div class="pt-6">
    <common-layout-center>
      <common-card-info title="员工详情">
        <template #status>
          <div class="flex items-center gap-[12px]">
            <div class="cursor-pointer" @click="delStaff()">
              <icon name="i-svg:delete" :size="16" />
            </div>
            <div class="px-[12px] py-[6px] bg-[#2B78EF] color-[#fff] rounded-[12px] text-[14px] cursor-pointer" @click="toEdit()">
              编辑
            </div>
          </div>
        </template>
        <template #info>
          <div>
            <template v-if="staffInfo.avatar">
              <div class="pb-[8px]">
                <img :src="ImageUrl(staffInfo.avatar)" class="shadow-2xl" alt="" style="width: 48px;height: 48px;border-radius: 8px;">
              </div>
            </template>
            <common-cell label="姓名" :value="staffInfo.nickname" />
            <common-cell label="用户名" :value="staffInfo.username" />
            <common-cell label="性别" :value="sex(staffInfo.gender)" />
            <common-cell label="手机号" :value="staffInfo.phone" />
            <common-cell label="email" :value="staffInfo.email" />
          </div>
        </template>
      </common-card-info>
      <common-card-info title="门店">
        <template #info>
          <div class="text-[14px] color-[#666]">
            <n-tabs type="segment" animated>
              <n-tab-pane name="chap1" tab="所属" :disabled="!staffInfo.stores?.length">
                <div class="flex flex-wrap flex-start">
                  <template v-for="(item, index) in staffInfo.stores" :key="index">
                    <div class="ml-[12px] model-item">
                      {{ item.name }}
                    </div>
                  </template>
                </div>
              </n-tab-pane>

              <n-tab-pane name="chap2" tab="负责" :disabled="!staffInfo.store_superiors?.length">
                <div class="flex flex-wrap flex-start">
                  <template v-for="(item, index) in staffInfo.store_superiors" :key="index">
                    <div class="ml-[12px] model-item">
                      {{ item.name }}
                    </div>
                  </template>
                </div>
              </n-tab-pane>
              <n-tab-pane name="chap3" tab="管理" :disabled="!staffInfo.store_admins?.length">
                <div class="flex flex-wrap flex-start">
                  <template v-for="(item, index) in staffInfo.store_admins" :key="index">
                    <div class="ml-[12px] model-item">
                      {{ item.name }}
                    </div>
                  </template>
                </div>
              </n-tab-pane>
            </n-tabs>
          </div>
        </template>
      </common-card-info>
      <common-card-info title="区域">
        <template #info>
          <div class="text-[14px] color-[#666]">
            <n-tabs type="segment" animated>
              <n-tab-pane name="chap1" tab="所属" :disabled="!staffInfo.regions?.length">
                <div class="flex flex-wrap flex-start">
                  <template v-for="(item, index) in staffInfo.regions" :key="index">
                    <div class="ml-[12px] model-item">
                      {{ item.name }}
                    </div>
                  </template>
                </div>
              </n-tab-pane>
              <n-tab-pane name="chap2" tab="负责" :disabled="!staffInfo.region_superiors?.length">
                <div class="flex flex-wrap flex-start">
                  <template v-for="(item, index) in staffInfo.region_superiors" :key="index">
                    <div class="ml-[12px] model-item">
                      {{ item.name }}
                    </div>
                  </template>
                </div>
              </n-tab-pane>
              <n-tab-pane name="chap3" tab="管理" :disabled="!staffInfo.region_admins?.length">
                <div class="flex flex-wrap flex-start">
                  <template v-for="(item, index) in staffInfo.region_admins" :key="index">
                    <div class="ml-[12px] model-item">
                      {{ item.name }}
                    </div>
                  </template>
                </div>
              </n-tab-pane>
            </n-tabs>
          </div>
        </template>
      </common-card-info>
    </common-layout-center>
    <common-confirm
      v-model:show="confirmShow"
      title="删除提示"
      text="是否删除此员工?"
      icon="error"
      @submit="deleteConfirm"
    />
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
:deep(.n-tabs-nav) {
  width: 300px;
}
.model-item {
  padding: 6px 12px;
  background-color: #2b78ef;
  font-size: 14px;
  color: #fff;
  border-radius: 45px;
  margin-bottom: 12px;
}
</style>
