<script lang="ts" setup>
useSeoMeta({
  title: '设备详情',
})
</script>

<template>
  <div>
    <common-layout-center>
      <div class="p-4">
        <common-card-info title="基础信息">
          <template #titleSuffix>
            <div class="flex items-center justify-end flex-1">
              <div class="flex items-center text-[#FF2F2F]">
                <icon name="i-svg:unbundle" size="14" />
                <span class="pl-1">解绑</span>
              </div>
            </div>
          </template>
          <template #info>
            <div>
              <div class="flex items-center justify-between mb-[2px].0">
                <div class="text-[#808089]">
                  设备名称
                </div>
                <div class="text-[#333333]">
                  郑州老庙大卫城店
                </div>
              </div>
              <div class="flex items-center justify-between mb-[2px]">
                <div class="text-[#808089]">
                  摄像头
                </div>
                <div class="text-[#333333]">
                  A02A02A02A02A02A02
                </div>
              </div>
              <video
                src="https://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8"
                class="w-full h-full object-cover"
                controls
                autoplay
                muted
                playsinline
              />
            </div>
          </template>
        </common-card-info>
      </div>
    </common-layout-center>
  </div>
</template>
