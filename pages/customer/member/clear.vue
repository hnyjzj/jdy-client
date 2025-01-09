<script lang="ts" setup>
useSeoMeta({
  title: '积分清零',
})
const modl = ref(false)
</script>

<template>
  <div>
    <common-layout-card>
      <template #header-right>
        <div @click="modl = true">
          清零记录
        </div>
      </template>
      <div />
      <template #footer>
        <div class="col-12">
          <common-button-rounded content="积分清零" />
        </div>
      </template>
    </common-layout-card>
    <common-model v-model="modl" title="清零记录">
      <div>
        123
      </div>
    </common-model>
  </div>
</template>

<style lang="scss" scoped>

</style>
