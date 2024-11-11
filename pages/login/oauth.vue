<script setup lang="ts">
const route = useRoute()
const authStore = useAuth()

onMounted(async () => {
  await nextTick()
  const code = route.query?.code as string
  const state = route.query?.state as string
  if (code) {
    const res = await authStore.wxworkLogin({ code, state })
    if (res) {
      await jump('/')
    }
  }
})
</script>

<template>
  <div>
    获取授权中
  </div>
</template>
