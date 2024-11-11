<script setup lang="ts">
// const userStore = useUser()
const authStore = useAuth()
// const loginBtn = async () => {
//   const res = await store.mockLogin()

//   if (res) {
//     navigateTo('/')
//   }
// }
// 账号输入
const account = ref<Account>({
  phone: '',
  password: '',
})
// 控制显示是否显示验证码
const codeShow = ref<boolean>(false)
onMounted(() => {

})
// 企业微信登录
const QWLogin = async () => {
  const res = await authStore.OAuthLogin({ uri: 'http://sbf.yjzj.com/login/oauth', state: 'wxwork' })
  if (res) {
    window.location.href = res
  }
}

// 手机号输入框失去焦点  进行验证码显示
const blur = async () => {
  if (account.value.phone.length === 11) {
    await authStore.getCodeImg()
    codeShow.value = true
  }
  else {
    codeShow.value = false
  }
}
</script>

<template>
  <div class="cardbox blur-bgc rounded-[16px]">
    <div>
      <div class="text-[14px] line-height-[20px] mb-[8px] dark:color-[#fff]">
        手机号
      </div>
      <div class="px-[12px] py-[10px] bg-[#fff] rounded-[8px]">
        <input
          v-model="account.phone" type="text" class="bg-transparent border-0 placeholder-text-[#cbcdd1] text-[14px] w-full outline-none "
          maxlength="11" placeholder="全部" @blur="blur()"
        >
      </div>
    </div>

    <div class="mt-[32px]">
      <div class="text-[14px] line-height-[20px] mb-[8px] dark:color-[#fff]">
        密码
      </div>
      <div class="px-[12px] py-[10px] bg-[#fff] rounded-[8px] ">
        <form>
          <input
            v-model="account.password" type="password" autocomplete=" " class="bg-transparent border-0 placeholder-text-[#cbcdd1] text-[14px] w-full outline-none" placeholder="密码"
          >
        </form>
      </div>
    </div>

    <div v-if="codeShow" class="mt-[32px]">
      <div class="text-[14px] line-height-[20px] mb-[8px] dark:color-[#fff]">
        验证码
      </div>
      <div class="px-[12px] py-[10px] bg-[#fff] rounded-[8px] flex-between">
        <form>
          <input
            type="text" autocomplete="" class="bg-transparent border-0 placeholder-text-[#cbcdd1] text-[14px] w-full outline-none h-[40px]" placeholder="验证码"
          >
        </form>
        <div>
          <nuxt-img :src="authStore.imageCaptcha.code" class="w-[100px] h-[40px]" />
        </div>
      </div>
    </div>

    <div class="text-size-[16px]  font-semibold offset-5 mt-[32px]">
      <div class="ok ">
        登录
      </div>
    </div>

    <div class="px-[20px] mt-[112px] flex-center-row">
      <div class="h-[1px] w-[58px] color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[90deg,#CCCCCC00,#CCCCCC]" />
      <div class="color-[#9E9E9E] dark:color-[#fff] px-[9px] text-[12px]">
        其他登录方式
      </div>
      <div class="h-[1px] w-[58px]  color-[#9E9E9E] dark:color-[#fff] bg-gradient-linear-[270deg,#CCCCCC00,#CCCCCC] " />
    </div>
    <div class="flex-center-row py-[24px]">
      <div class="wh-[32px] rounded-full flex-center-row" @click="QWLogin()">
        <icon name="i-svg:qwicon" size="32" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cardbox {
  --uno: 'px-[23px] pb-14px sm:px-[24px] sm:pb-33px pt-0 rounded-b-16px  pt-36px';
  .ok {
    --uno: 'bg-gradient-linear-[180deg,#1A6BEB,#6EA6FF] line-height-[24px] px-[77px] py-[6px] text-center rounded-[36px] color-[#fff] shadow-[0_8px_8px_0px_#3971F33D]';
  }
}
</style>
