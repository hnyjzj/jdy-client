<script setup lang="ts">
useSeoMeta({
  title: '打印模板列表',
})

const delModel = ref(false)
const copyModel = ref(false)

// 删除打印模板
const del = () => {
  // TODO:调用删除模板

  // then
  delModel.value = false
}

// 复制打印模板
const copy = () => {

}

// 编辑打印模板
const edit = () => {
  jump('/print/edit/temp')
}

// 弹窗展开
const modelShow = (kind: string) => {
  if (kind === 'del') {
    delModel.value = true
  }
  if (kind === 'copy') {
    copyModel.value = true
  }
}

// 取消
const modCancel = () => {
  delModel.value = false
}

const cancel = () => {
  const { back } = useRouter()
  back()
}

const confirm = () => {
  jump('/print/edit/temp')
}

// TODO:暂时占位测试用，后续删除
const showEmp = ref(true)
</script>

<template>
  <div class="grid-12">
    <common-model
      v-model:model-value="delModel"
      :show-ok="true"
      title="删除打印模板"
      @confirm="del"
      @cancel="modCancel"
    >
      <div class="font-[14px] color-[#333] my-[56px] text-center">
        删除后<span class="font-semibold color-[#FF2F2F] px-[4px]">无法恢复</span>，是否确认删除？
      </div>
    </common-model>

    <common-model
      v-model:model-value="copyModel"
      :show-ok="true"
      title="复制打印模板"
      @confirm="copy"
      @cancel="modCancel"
    >
      <div class="flex flex-col gap-[20px] pb-[32px]">
        <div class="model-name flex flex-col gap-[6px]">
          <div class="font-[14px] color-[#333]">
            模板名称
          </div>

          <n-input type="text" placeholder="请输入模板名称" />
        </div>

        <div class="target-loc flex flex-col gap-[6px]">
          <div class="font-[14px] color-[#333]">
            复制到
          </div>

          <n-select type="text" placeholder="请选择复制位置" />
        </div>
      </div>
    </common-model>

    <div class="top-bar col-4 color-[#fff] pb-[12px] p-[16px]" uno-lg="col-2 offset-2">
      <!-- 切换门店 -->
      <product-manage-company />
    </div>

    <div class="col-12" uno-lg="col-8 offset-2">
      <template v-if="showEmp">
        <div class="body">
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-[#fff] border-solid border-[1px] border-[#EFF0F6] rounded-[24px] overflow-hidden">
              <div class="exhibition p-[16px]">
                <div class="font-[14px] font-semibold color-[#000] mb-[8px]">
                  打印模板标题
                </div>
                <div class="font-[14px] color-[#666666]">
                  门店名字
                </div>
              </div>

              <div class="operating bg-[#EFF0F6] px-[16px] py-[10px]">
                <div class="flex-center-row gap-[20px]">
                  <div class="ope-but color-[#FF2F2F]" @click="modelShow('del')">
                    删除
                  </div>

                  <div class="ope-but color-[#3971F3]" @click="modelShow('copy')">
                    复制
                  </div>

                  <div class="ope-but color-[#3971F3]" @click="edit">
                    编辑
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <common-emptys />
      </template>
    </div>

    <common-button-bottom
      cancel-text="取消"
      confirm-text="新增模板"
      @cancel="cancel"
      @confirm="confirm"
    />
  </div>
</template>

<style scoped lang="scss">
.body {
  --uno: 'bg-[rgba(255,255,255,.7)] h-100vh p-[16px] rounded-t-[24px] border-solid border-[1px] border-[#EFF0F6]';
}

.ope-but {
  --uno: 'font-[14px] font-semibold cursor-pointer';
}
</style>
