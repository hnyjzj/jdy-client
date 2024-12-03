<script lang="ts" setup>
import type { Rules } from 'common-form'

definePageMeta({ layout: 'solid' })
const { userinfo } = storeToRefs(useUser())
const { getOauthUri } = useAuth()
// 头像列表
const fileList = ref<fileListArr[]>([])
// 其他授权方式列表
const otherList = ref<{ name: string, icon: string }[]>([])
// 上传参数
const userinfoForm = ref<FormReq>({
  avatar: '',
  nickname: '',
  phone: '',
  email: '',
  gender: 0,
  password: '',
})

const { avatar, nickname, phone, email, gender } = userinfo.value
userinfoForm.value = {
  ...userinfoForm.value, // 保留原有的所有字段
  avatar,
  nickname,
  phone,
  email,
  gender,
}

const rules = ref<Rules<FormReq>>({
  nickname: [
    {
      message: '昵称不能为空',
      validator: 'required',
    },
  ],
  phone: [
    {
      message: '手机号不能为空',
      validator: 'required',
    },
  ],
  email: [
    {
      message: '邮箱不能为空',
      validator: 'required',
    },
  ],
  password: [
    {
      message: '密码不能为空',
      validator: 'required',
    },
  ],

})
fileList.value.push({ url: avatar })

if (import.meta.client) {
  if ((isWxWorkClient() || isWeChatClient())) {
    otherList.value.push({
      name: 'wxwork',
      icon: 'i-svg:qwicon',
    })
  }
}

// 上传文件
const afterRead = () => {

}
const beforeRead = (file: any) => {
  // 验证文件类型
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    showToast('请上传 jpg 格式图片')
    return false
  }
  return true
}

const submitForm = () => {
  console.log(userinfoForm.value)
}

const otherAuth = async (data: string) => {
  if (data === 'wxwork') {
    const route = useRoute()
    await getOauthUri(route.path || '', '/my/user/oauth')
  }
}
</script>

<template>
  <div class="px-[16px] py-[16px]">
    <div class="grid-12">
      <div class="pb-[8px] col-12 flex-center-col" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
        <van-uploader
          v-model="fileList" multiple :after-read="afterRead" :before-read="beforeRead" max-count="1" :style="{
            '--van-uploader-border-radius': '50%',
            '--van-uploader-upload-background': 'white',
          }" :preview-options="{ closeable: true }" />
        <div class="py-[8px] color-[#666]">
          上传头像
        </div>
      </div>

      <div class="pb-[32px] col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
        <div class="bg-[#fff] px-[16px] rounded-[8px] color-[#848484]">
          <common-form v-model="userinfoForm" :rules="rules" @submit="submitForm">
            <template #nickname="{ validate, error }">
              <div class="items">
                <div>昵称</div>
                <input v-model="userinfoForm.nickname" type="text" class="text-right border-none color-black py-[10px]" placeholder="请输入" @change="validate()">
              </div>
              <template v-if="error">
                <div class="error">
                  {{ error }}
                </div>
              </template>
            </template>
            <template #email="{ error, validate }">
              <div class="items">
                <div>邮箱</div>
                <input v-model="userinfoForm.email" type="text" class="text-right border-none color-black py-[10px]" placeholder="请输入" @change="validate()">
              </div>
              <template v-if="error">
                <div class="error">
                  {{ error }}
                </div>
              </template>
            </template>
            <template #gender>
              <div class="items">
                <div>性别</div>
                <div class="py-[9px]">
                  <van-radio-group v-model="userinfoForm.gender" direction="horizontal">
                    <van-radio :name="1">
                      男
                    </van-radio>
                    <van-radio :name="2">
                      女
                    </van-radio>
                  </van-radio-group>
                </div>
              </div>
            </template>
            <template #phone="{ error, validate }">
              <div class="items">
                <div>手机号</div>
                <input v-model="userinfoForm.phone" type="text" class="text-right border-none color-black py-[10px]" placeholder="请输入" @change="validate()">
              </div>
              <template v-if="error">
                <div class="error">
                  {{ error }}
                </div>
              </template>
            </template>
            <template #password="{ error, validate }">
              <div class="items ">
                <div>密码</div>
                <input v-model="userinfoForm.password" type="text" class="text-right border-none color-black py-[10px]" placeholder="请输入" @change="validate()">
              </div>
              <template v-if="error">
                <div class="error">
                  {{ error }}
                </div>
              </template>
            </template>
            <template #actions="{ submit }">
              <div class="py-[32px] col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
                <div class="ok cursor-pointer" @click="submit">
                  保存
                </div>
              </div>
            </template>
          </common-form>
        </div>
      </div>
    </div>

    <template v-if="otherList.length">
      <login-other text="其他授权方式" :list="otherList" @other="otherAuth" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.items {
  --uno: 'flex-between border-b-[1px] border-b-solid border-b-[#F7F7F7]  py-[6px]';
}
.ok {
  --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px]  text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
}
.error {
  --uno: 'color-[red] text-size-[14px] line-height-[20px] mt-10px';
}
::v-deep .van-uploader__upload {
  margin: 0;
}
</style>
