<!--这里创建一个vantajs的挂载区域-->
<script setup>
//导入vanta.js和three.js，以及ref等hooks
import * as THREE from 'three'
import WAVES from 'vanta/src/vanta.waves'
import { useRouter } from 'vue-router'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const navigation = [
  { name: '功能概述', href: '/', current: false, id: 'summary' },
  { name: '我们的团队', href: '/', current: false, id: 'team' },
  { name: '其他工作', href: '/', current: false, id: 'others' },
]
//使用ref引用挂载区域
const Area = ref(null)
const verify_code = ref(null)
const user_created = ref(null)
//输入框绑定内容 用户名 邮箱 密码 邮箱验证码
const user_name = ref(null)
const user_email = ref(null)
const user_password = ref(null)
const user_input_code = ref(null)
const user_checked = ref(null)
const router = useRouter()
//创建一个全局的变量来使用vanta.js
/**
  *因为在vue2中，是使用this.vantaEffect来创建指定的3d动画模板的
  *但是vue3 setup中是没有this，所以要另外创建一个
**/
let vantaEffect = null;
//在两个生命周期钩子内创建vantaEffect
onMounted(() => {
  vantaEffect = WAVES({
    el: Area.value,
    THREE: THREE,
    //如果需要改变样式，要写在这里
    //因为这里vantaEffect是没有setOptions这个方法的
    color: 0x1f2937,
  })
})
onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
})
const fetchCode = async (target_email) => {
  try {
    await fetch('http://127.0.0.1:3407/user/email_verify/?email_address=' + target_email).then(function (data) {
      return data.json();
    }).then(function (data) {
      console.log(data)
      verify_code.value = data.data
      console.log(verify_code.value)
    })
  } catch (error) {
    console.error('系统验证码模块错误', error);
  }
};
const fetchSignUp = async (user_name_value, user_password_value, user_email_value) => {
  try {
    await fetch('http://127.0.0.1:3407/user/register', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_name: user_name_value,
        user_password: user_password_value,
        user_email: user_email_value
      })
    }).then(function (data) {
      return data.json();
    }).then(function (data) {
      console.log(data)
      user_created.value = data.data
      console.log(user_created.value)
      if (user_created.value == "用户创建成功") {
        alert(user_created.value + ",跳转登录页面")
        router.push("/sign_in")
      }
    })
  } catch (error) {
    console.error('用户注册错误', error);
  }
};
function verify_email(event) {
  event.preventDefault()
  // 获取输入的邮箱的值
  const target_email = user_email.value.value;
  fetchCode(target_email)
}
function signup(event) {
  event.preventDefault()
  var sign = true
  if (user_name.value.value.length < 3 || user_name.value.value.length > 16) {
    alert("用户名长度应在3-16位之间")
    sign = false
  }
  if (user_password.value.value.length < 6 || user_password.value.value.length > 32) {
    alert("用户密码长度应在6-32位之间")
    sign = false
  }
  var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!pattern.test(user_email.value.value)) {
    alert("邮箱填写不正确")
    sign = false
  }
  if (verify_code.value == null || verify_code.value != user_input_code.value.value) {
    alert("用户邮箱验证码不一致")
    sign = false
  }
  if (!user_checked.value.value == "on") {
    alert("未同意用户协议")
    sign = false
  }
  if (sign == true) {
    fetchSignUp(user_name.value.value, user_password.value.value, user_email.value.value)
  }
}
</script>
<template>
  <header>
    <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
      <div class="mx-auto max-w-18xl px-2 sm:px-1.5 lg:px-3">
        <div class="relative flex h-16 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button-->
            <DisclosureButton
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex flex-shrink-0 items-center">
              <img class="h-8 w-auto" src="../assets/logo.png" alt="Your Company" />
            </div>
            <div class="hidden sm:ml-0 sm:block">
              <div class="flex space-x-4">
                <a :class="['text-white', 'rounded-md px-3 py-2  font-medium']">人脸深度伪造防御原型系统</a>
              </div>
            </div>
            <div class="hidden sm:ml-12 sm:block">
              <div class="flex space-x-4">
                <RouterLink v-for="item in navigation" :key="item.name" :to="item.href" :id="item.id"
                  :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2  font-medium']"
                  :aria-current="item.current ? 'page' : undefined">{{ item.name }}</RouterLink>
              </div>
            </div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <RouterLink to="/sign_in"
              class="middle none center mr-4 rounded-lg bg-gray-800 py-2 px-5 font-sans text-base font-bold uppercase text-white transition-all active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true">
              登录
            </RouterLink>
            <RouterLink to="/sign_up"
              class="middle none center mr-4 rounded-lg bg-blue-500 py-2 px-5 font-sans text-base font-bold uppercase text-white shadow-md shadow-slate-500/20 transition-all hover:shadow-lg hover:shadow-slate-500/50 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              data-ripple-light="true">
              注册
            </RouterLink>
          </div>
        </div>
      </div>
      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pb-3 pt-2">
          <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href"
            :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']"
            :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </header>
  <div class="vanta_area" ref="Area">
    <div class="container mx-auto px-4 h-full">
      <div class="flex content-center items-center justify-center h-full">
        <div class="w-full lg:w-4/12 px-4">
          <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
            <div class="rounded-t mb-0 px-6 py-6">
              <hr class="mt-6 border-b-1 border-gray-400" />
            </div>
            <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div class="text-gray-500 text-center mb-3 font-bold text-5xl">
                <small>创建您的账号</small>
              </div>
              <form>
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-gray-700 text-base font-bold mb-2"
                    for="grid-username">用户名</label><input type="text" ref="user_name"
                    class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    placeholder="例如:赤红" style="transition: all 0.15s ease 0s;" required />
                </div>
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-gray-700 text-base font-bold mb-2" for="grid-email">邮箱</label>
                  <input type="email" ref="user_email"
                    class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    placeholder="例如:xxx@126.com" style="transition: all 0.15s ease 0s;" required />
                </div>
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-gray-700 text-base font-bold mb-2"
                    for="grid-password">密码</label><input type="password" ref="user_password"
                    class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    placeholder="输入您的密码" style="transition: all 0.15s ease 0s;" required />
                </div>
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-gray-700 text-base font-bold mb-2"
                    for="grid-password-re">邮箱验证码</label>
                  <input type="code" ref="user_input_code"
                    class="border-0 px-3 py-3 inline-block placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow w-7/12"
                    placeholder="输入邮箱验证码" style="transition: all 0.15s ease 0s;" required />
                  <div class="w-1/12 inline-block"></div>
                  <button @click="verify_email"
                    class="w-4/12 rounded-lg border border-gray-700 bg-gray-700 px-5 py-2.5 text-center text-sm font-medium 
                    text-white shadow-sm transition-all hover:border-gray-900 hover:bg-gray-900 focus:ring 
                    focus:ring-gray-200 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300">发送验证码</button>
                </div>
                <div>
                  <label class="inline-flex items-center cursor-pointer">
                    <input id="customCheckLogin" type="checkbox" ref="user_checked"
                      class="form-checkbox border-0 rounded text-gray-800 ml-1 w-5 h-5"
                      style="transition: all 0.15s ease 0s;" required /><span
                      class="ml-2 text-sm font-semibold text-gray-700" required>我已经阅读并同意了<RouterLink
                        class="text-purple-600">
                        有关条款&注意事项</RouterLink></span></label>
                </div>
                <div class="text-center mt-6">
                  <button @click="signup"
                    class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                    type="button" style="transition: all 0.15s ease 0s;">
                    注册
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vanta_area {
  height: 100vh;
}
</style>
