<script lang="ts" setup>
useSeoMeta({
  title: '权限管理',
})

const authList = ref([
  {
    name: '公司管理',
    list: [
      '全部',
      'API账号管理',
      '实名认证',
    ],
  },
  {
    name: '安全与集成',
    list: [
      '全部',
      '安全IP设置',
      '公司变更查询',
    ],
  },
])
const navItems = ref(['权限', '成员'])
const activeIndex = ref(0)
const setActive = (index: number) => {
  activeIndex.value = index
}
</script>

<template>
  <div class="px-4 pt-6">
    <common-gradient title="用户组（2）">
      <template #body>
        <div class="user-box">
          <div class="text-[16px]">
            公司管理员
          </div>
          <div class="mt-4 flex flex-end">
            <Icon name="i-icon:userinfo-not" color="#000" :size="16" />
            <span class="pt-1 pl-1">2</span>
          </div>
        </div>
        <div class="user-box mt-3">
          <div class="text-[16px]">
            公司普通管理员
          </div>
          <div class="mt-4 flex flex-end">
            <Icon name="i-icon:userinfo-not" color="#000" :size="16" />
            <span class="pt-1 pl-1">2</span>
          </div>
        </div>
        <div class="pt-4 text-center">
          + 添加用户组
        </div>
      </template>
    </common-gradient>
    <div class="my-4 flex items-center">
      <span class="text-[18px] font-bold">
        公司普通成员
      </span>
      <div class="label">
        系统
      </div>
    </div>

    <div class="nav mb-4">
      <div
        v-for="(item, index) in navItems"
        :key="index"
        :class="{ 'select-nav': activeIndex === index }"
        class="nav-item"
        @click="setActive(index)"
      >
        {{ item }}
      </div>
    </div>
    <common-gradient title="公司管理">
      <template #body>
        <div class>
          <template v-for="(auth, aindex) in authList" :key="aindex">
            <div class="text-[16px] my-2">
              {{ auth.name }}
            </div>
            <template v-for="(item, i) in auth.list" :key="i">
              <n-checkbox
                :label="item"
                :style="{
                  '--n-color-checked': '#0068ff',
                  '--n-border-color-active': '#000',
                  '--n-check-mark-color': 'white', // 可选：✔ 图标颜色
                }"
              />
            </template>
          </template>
        </div>
      </template>
    </common-gradient>
  </div>
</template>

<style lang="scss" scoped>
.user-box {
  border: 1px solid #ddd7d7;
  --uno: 'rounded-[8px] p-2';
}
.label {
  --uno: 'ml-2 px-[2px] rounded-[2px] bg-[rgba(230,230,232,1)] text-[rgba(128,128,137,1)]';
}

.nav {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 16px;
  padding: 0;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 4px;
}

.nav-item {
  position: relative;
  padding: 8px 0;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  line-height: 1.2;
}

.select-nav {
  color: #007bff;
}

.select-nav::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  bottom: -5px;
  height: 2px;
  background-color: #007bff;
}
</style>
