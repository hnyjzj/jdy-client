<script lang="ts" setup>
const props = defineProps<{
  equal?: UserLevel
  max?: UserLevel
  min?: UserLevel
  list?: UserLevel[]
}>()
const { userinfo } = storeToRefs(useUser())
const ok = ref(false)
if (!props?.max && !props.min && props.list?.length === 0) {
  ok.value = false
}
if (props?.min && userinfo.value.identity >= props?.min) {
  ok.value = true
}
if (props?.max && userinfo.value.identity <= props?.max) {
  ok.value = true
}
if (props?.equal && userinfo.value.identity === props?.equal) {
  ok.value = true
}
if (props?.list && props?.list?.length > 0 && props.list?.indexOf(userinfo.value.identity) !== -1) {
  ok.value = true
}
</script>

<template>
  <template v-if="ok">
    <slot />
  </template>
</template>

<style lang="scss" scoped>

</style>
