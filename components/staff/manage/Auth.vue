<script setup lang="ts">
const props = defineProps<{
  roleWhereList: any
  getroleListFn: (val: number) => Promise<any[]>
}>()
const emits = defineEmits<{
  updateRole: []
}>()

const auth = defineModel<updateAuthRole>('authform', {
  default: {
    id: '',
    identity: 0,
    role_id: '',
  },
})

const roleList = ref<any[]>([])
function transformRoleObjToArray(obj: any) {
  return Object.entries(obj).map(([key, value]) => ({
    num: Number.parseInt(key),
    role: value,
  }))
}
if (props.roleWhereList) {
  roleList.value = transformRoleObjToArray(props.roleWhereList)
}
// 修改密码
const editRole = () => {
  emits('updateRole')
}

const array = ref<any[]>([])
const updateRole = async (e: any) => {
  array.value = []
  const res = await props.getroleListFn(e)
  res.forEach((item) => {
    array.value.push({ label: item.name, value: item.id })
  })
  auth.value.role_id = array.value[0].value
}
if (auth.value.identity) {
  array.value = []
  const res = await props.getroleListFn(auth.value.identity)
  res.forEach((item) => {
    array.value.push({ label: item.name, value: item.id })
  })
}
</script>

<template>
  <div>
    <div class="pt-[12px]">
      <common-fold title="分配权限" from-color="#9EBAF9" to-color="#fff">
        <div class="p-[16px]">
          <n-form
            :model="auth"
            label-placement="top"
            size="medium"
          >
            <n-grid :cols="24" x-gap="8">
              <n-form-item-gi :span="24" label="角色">
                <n-radio-group v-model:value="auth.identity" @update:value="updateRole">
                  <n-space>
                    <template v-for="(item, index) in roleList" :key="index">
                      <n-radio
                        :value="item.num" :style="{
                          '--n-box-shadow-hover': 'inset 0 0 0 1px #0068ff',
                          '--n-box-shadow-active': 'inset 0 0 0 1px #0068ff',
                          '--n-dot-color-active': '#0068ff',
                          '--n-box-shadow-focus': 'inset 0 0 0 1px #0068ff, 0 0 0 2px rgba(24, 65, 160, 0.2)' }">
                        {{ item.role }}
                      </n-radio>
                    </template>
                  </n-space>
                </n-radio-group>
              </n-form-item-gi>
              <n-form-item-gi :span="24" label="权限">
                <n-select v-model:value="auth.role_id" :options="array" placeholder="请选择权限" />
              </n-form-item-gi>
            </n-grid>
            <div class="grid-12 px-[26px]">
              <div
                class="font-semibold  cursor-pointer col-12" uno-sm="col-8 offset-2" uno-lg="col-6 offset-3">
                <div @click="editRole">
                  <common-button-rounded content="更新权限" />
                </div>
              </div>
            </div>
          </n-form>
          <n-grid :cols="24" :x-gap="8" />
        </div>
      </common-fold>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-item {
  --uno: 'h-full w-full border-none bg-transparent dark:placeholder-color-[#fff]';
}
.label {
  --uno: 'pb-[8px] dark:color-#fff';
}

.n-radio .n-radio__dot.n-radio__dot--checked {
  box-shadow: inset 0 0 0 1px #0068ff;
}
</style>
