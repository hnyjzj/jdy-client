<script lang="ts" setup>
import type { Rules } from 'common-form'
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'

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
const otherList = ref<{ name: string, icon: string, title: string }[]>([])
// 上传参数
const userinfoForm = ref<Staff>({
  avatar: '',
  nickname: '',
  username: '',
  phone: '',
  email: '',
  gender: 0,
  password: '',
})
const againPass = ref('')
// 初始化数据 给表单赋值 userinfoForm
const { avatar, nickname, phone, email, gender, username } = userinfo.value
userinfoForm.value = {
  ...userinfoForm.value, // 保留原有的所有字段
  avatar,
  nickname,
  username,
  phone,
  email,
  gender,
}

const rules = ref<Rules<Staff>>({
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
fileList.value = [{ url: avatar, isImage: true }]

onMounted(() => {
  // 其他授权方式 判断是否有微信企业微信授权
  if ((isWxWorkClient() || isWeChatClient())) {
    otherList.value.push({
      name: 'wxwork',
      title: '微信企业',
      icon: 'i-svg:qwicon',
    })
  }
})
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
  const res = await staff.updateStaff(userinfoForm.value)

  // 根据响应结果判断更新是否成功
  if (res?.code === HttpCode.SUCCESS) {
    // 更新成功时，显示成功提示信息
    $toast.success('更新成功')
    await getUserInfo()
  }
  else {
    $toast.error(res?.message || '更新失败')
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

/** 图片列表 */
const previewFileList = ref<Array<UploadFileInfo>>([])
if (userinfo.value.avatar) {
  previewFileList.value = [{
    id: userinfo.value.avatar,
    status: 'finished',
    url: userinfo.value.avatar,
    name: 'avatar',
    type: 'image/png',
  }]
}
function removeImg(data: { index: number }) {
  const tempList = JSON.parse(JSON.stringify(previewFileList.value))
  tempList.splice(data.index, 1)
  previewFileList.value = tempList
}

/**
 * 上传详情图
 */
const customRequest = useDebounceFn(async ({ file }: UploadCustomRequestOptions) => {
  if (!file?.file)
    return

  try {
    const res = await staff.uploadAvatar({ avatar: file.file })
    if (res.data?.value?.data?.url) {
      userinfoForm.value.avatar = res.data.value?.data.url as string
      fileList.value = [{ url: res.data.value?.data.url, isImage: true }]
    }
  }
  catch (error) {
    throw new Error(`图片上传失败: ${error || '未知错误'}`)
  }
}, 300)

const beforeUpload = (data: any) => {
  if (data.file.file?.type !== 'image/png' && data.file.file?.type !== 'image/jpeg') {
    $toast.error('只能上传png,jpeg格式的图片文件,请重新上传')
    return false
  }
}
</script>

<template>
  <div class="px-[16px] py-[16px]">
    <div class="grid-12">
      <div class="pb-[8px] col-12 flex-center-col" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
        <div class="w-[96px] h-[96px]">
          <n-upload
            action="#"
            list-type="image-card"
            :default-file-list="previewFileList"
            :custom-request="customRequest"
            :max="1"
            @before-upload="beforeUpload"
            @remove="removeImg"
          />
        </div>
        <div class="py-[8px] text-color">
          上传头像
        </div>
      </div>

      <div class="pb-[32px] col-12" uno-sm="col-8 offset-2" uno-lg="col-4 offset-4">
        <div class="blur-bgc  px-[16px] rounded-[8px] text-color">
          <common-form v-model="userinfoForm" :rules="rules" @submit="submitForm">
            <template #nickname="{ validate, error }">
              <div class="items">
                <div>昵称</div>
                <input
                  v-model="userinfoForm.nickname" type="text"
                  class="text-right border-none text-color py-[10px] blur-bgc "
                  placeholder="请输入" @focus="focus" @change="validate()">
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
                <input
                  v-model="userinfoForm.email" type="text"
                  class="text-right border-none text-color py-[10px] blur-bgc "
                  placeholder="请输入" @focus="focus" @change="validate()">
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
                  <n-radio-group v-model:value="userinfoForm.gender">
                    <template v-if="userinfo.gender === 0">
                      <n-radio
                        :value="0">
                        保密
                      </n-radio>
                    </template>
                    <n-radio :value="1">
                      男
                    </n-radio>
                    <n-radio :value="2">
                      女
                    </n-radio>
                  </n-radio-group>
                </div>
              </div>
            </template>
            <template #phone>
              <div class="items">
                <div>手机号</div>
                <div class="text-color  py-[10px]">
                  {{ userinfoForm.phone }}
                </div>
              </div>
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
  --uno: 'flex-between line-color-b py-[6px]';
}
.ok {
  --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px]  text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
}
.error {
  --uno: 'color-[red] text-size-[14px] line-height-[20px] mt-10px';
}
</style>
