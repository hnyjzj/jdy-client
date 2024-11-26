<script setup lang="ts">
type texts = 'todo' | 'table' | 'userinfo'
const props = withDefaults(defineProps<{
  text?: texts
}>(), {
  text: 'todo',
})
const { $colorMode } = useNuxtApp()
const mode = computed({
  get() {
    return $colorMode.preference === 'dark'
  },
  set(newValue) {
    $colorMode.preference = newValue ? 'dark' : 'light'
  },
})
interface MenuItem {
  key: texts
  name: string
  route: string
  activeIcon: string
  inactiveIcon: string
}

const menuItems: MenuItem[] = [
  { key: 'todo', name: '我的待办', route: '/', activeIcon: 'i-svg:todo-select', inactiveIcon: 'i-icon:todo-not' },
  { key: 'table', name: '工作台', route: '/work/table', activeIcon: 'i-svg:table-select', inactiveIcon: 'i-icon:table-not' },
  { key: 'userinfo', name: '个人中心', route: '/my/user', activeIcon: 'i-svg:userinfo-select', inactiveIcon: 'i-icon:userinfo-not' },
]

const modeFun = () => {
  return mode.value ? '#fff' : '#333'
}
</script>

<template>
  <div class="fixed bottom-0 left-0 flex-center-row w-full" uno-lg="h-full w-auto">
    <div
      class="w-full bg-[#F8FAFF] dark:bg-[#515862] text-[12px] pt-[12px] pb-[4px] px-[40px] flex-between"
      uno-lg="w-auto px-8px py-12px flex-center-col rounded-8px">
      <div v-for="item in menuItems" :key="item.key">
        <nuxt-link :to="item.route">
          <div class="flex-center-col sm:py-[10px]">
            <div class="wh-[24px] mb-[4px]">
              <icon :name="props.text === item.key ? item.activeIcon : item.inactiveIcon" size="24" :color="modeFun()" />
            </div>
            <div
              class="line-height-[20px] color-[#333] dark:color-[#fff]"
              :class="{ 'text-active': props.text === item.key }">
              {{ item.name }}
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-active {
  color: #3971f3;
}
</style>
