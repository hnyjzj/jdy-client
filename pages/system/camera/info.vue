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
              <div class="flex items-center justify-between mb-[2px] text-[14px]">
                <div class="text-[#808089]">
                  设备名称
                </div>
                <div class="text-[#333333]">
                  郑州老庙大卫城店
                </div>
              </div>
              <div class="flex items-center justify-between mb-[2px]">
                <div class="text-[#808089]">
                  序列号
                </div>
                <div class="text-[#333333]">
                  A02A02A02A02A02A02
                </div>
              </div>
              <div class="flex items-center justify-between mb-[2px]">
                <div class="text-[#808089]">
                  设备状态
                </div>
                <div class="flex items-center">
                  <div class="w-[6px] h-[6px] bg-[#41CF84] rounded-full" />
                  <div class="ml-1 text-[#8C97A7] text-[12px]">
                    设备在线
                  </div>
                </div>
              </div>
            </div>
          </template>
        </common-card-info>
        <common-card-info title="摄像头X个">
          <template #info>
            <div>
              <div class="grid grid-cols-3 grid-rows-3 gap-2 w-fit">
                <template v-for="i in 9" :key="i">
                  <div
                    @click="jump('/system/camera/single')">
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
              </div>
            </div>
          </template>
        </common-card-info>
      </div>
    </common-layout-center>
  </div>
</template>
