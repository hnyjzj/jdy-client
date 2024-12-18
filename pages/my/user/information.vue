<script lang="ts" setup>
import type { Rules } from 'common-form'

definePageMeta({ layout: 'solid' })
const { getUserInfo } = useUser()
// 获取用户信息
await getUserInfo()
const { userinfo } = storeToRefs(useUser())
const { getOauthUri } = useAuth()
const { $toast } = useNuxtApp()
const staff = useStaff()
// 头像列表
const fileList = ref<fileListArr[]>([])
// 其他授权方式列表
const otherList = ref<{ name: string, icon: string }[]>([])
// 上传参数
const userinfoForm = ref<FormReq>({
  avatar: '',
  username: '',
  nickname: '',
  phone: '',
  email: '',
  gender: 0,
  password: '',
})
const againPass = ref('')
// 初始化数据 给表单赋值 userinfoForm
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
  email: [
    {
      message: '邮箱不能为空',
      validator: 'required',
    },
  ],

})
// 初始化头像
fileList.value = [{ url: ImageUrl(avatar), isImage: true }]

onMounted(() => {
  // 其他授权方式 判断是否有微信企业微信授权
  if ((isWxWorkClient() || isWeChatClient())) {
    otherList.value.push({
      name: 'wxwork',
      icon: 'i-svg:qwicon',
    })
  }
})
// 上传前
const beforeRead = (file: any) => {
  // 验证文件类型
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    showToast('请上传 jpg 格式图片')
    return false
  }

  return true
}
// 上传文件后
const afterRead = async (file: any) => {
  // 上传文件接口
  const res = await staff.uploadAvatar({ avatar: file.file })
  if (res.data.value.code !== HttpCode.SUCCESS) {
    $toast.error(res.data.value?.message || '上传失败')
  }
  userinfoForm.value.avatar = res.data.value.data.url
  fileList.value = [{ url: ImageUrl(res.data.value.data.url), isImage: true }]
}

/**
 * 异步函数：提交表单
 * 本函数用于更新用户信息通过调用后端API
 */
const submitForm = async () => {
  // 判断两个密码是否一样
// 如果密码输入了并且 两次密码不一致
  // 则提示两次密码不一致
  if (userinfoForm.value.password && (againPass.value !== userinfoForm.value.password)) {
    // 如果没输入 确认密码
    if (!againPass.value) {
      $toast.error('请输入确认密码')
      return false
    }
    $toast.error('两次密码不一致')
    return false
  }

  // 发起更新用户信息的请求
  const res = await staff.updateStaff({ platform: 'account', account: userinfoForm.value })

  // 根据响应结果判断更新是否成功
  if (res.code === HttpCode.SUCCESS) {
    // 更新成功时，显示成功提示信息
    $toast.success('更新成功')
    await getUserInfo()
  }
}

/**
 * 执行其他第三方认证
 *
 * 此函数根据传入的认证类型字符串，执行相应的第三方认证流程
 * 它特别处理了微信企业号（wxwork）的认证流程
 *
 * @param {string} data - 第三方认证类型标识符，例如'wxwork'表示微信企业号
 */
const otherAuth = async (data: string) => {
  // 当认证类型为微信企业号时
  if (data === 'wxwork') {
    // 获取当前路由信息
    const route = useRoute()
    // 调用获取OAuth URI的函数，准备进行微信企业号认证
    // 第一个参数是当前路由的路径，第二个参数是认证成功后的重定向路径
    await getOauthUri(route.path || '', '/my/user/oauth')
  }
}
// 删除头像
const deleteAvatar = () => {
  fileList.value = []
  userinfoForm.value.avatar = ''
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
          }" :preview-options="{ closeable: true }" @delete="deleteAvatar" />
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
                    <template v-if="userinfo.gender === 0">
                      <van-radio :name="0">
                        保密
                      </van-radio>
                    </template>
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
            <template #phone>
              <div class="items">
                <div>手机号</div>
                <div class="color-black  py-[10px]">
                  {{ userinfoForm.phone }}
                </div>
              </div>
            </template>
            <template #password>
              <div class="items ">
                <div>密码</div>
                <input v-model="userinfoForm.password" type="password" class="text-right border-none color-black py-[10px]" placeholder="请输入密码">
              </div>
              <template v-if="userinfoForm.password">
                <div class="items ">
                  <div>确认密码</div>
                  <input v-model="againPass" type="password" class="text-right border-none color-black py-[10px]" placeholder="请确认密码">
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
:deep(.van-uploader__upload) {
  margin: 0;
}
:deep(.van-uploader__preview) {
  margin: 0;
}
</style>
