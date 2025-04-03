<script setup>
//导入vanta.js和three.js，以及ref等hooks
import * as THREE from 'three'
import NET from 'vanta/src/vanta.net'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'
import { setToken, setTime, setName, setEmail, setPhoto } from '@/plugins/auth_jwt'
const router = useRouter()
const navigation = [
  { name: '功能概述', href: '/', current: false, id: 'summary' },
  { name: '我们的团队', href: '/', current: false, id: 'team' },
  { name: '其他工作', href: '/', current: false, id: 'others' },
]

//使用ref引用挂载区域
const Area = ref(null)
const user_email = ref(null)
const user_password = ref(null)
const user_checked = ref(null)
const user_login = ref(null)
//创建一个全局的变量来使用vanta.js
/**
*因为在vue2中，是使用this.vantaEffect来创建指定的3d动画模板的
*但是vue3 setup中是没有this，所以要另外创建一个
**/
let vantaEffect = null;
//在两个生命周期钩子内创建vantaEffect
onMounted(() => {
  vantaEffect = NET({
    el: Area.value,
    THREE: THREE,
    //如果需要改变样式，要写在这里
    //因为这里vantaEffect是没有setOptions这个方法的
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: 0x1f2937,
    color: 0x3f6dff
  })
})
onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy()
  }
})
const fetchSignIn = async (user_email_value, user_password_value) => {
  try {
    await axios({
      method: "post",
      url: '/user/login',
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        user_email: user_email_value,
        user_password: user_password_value
      })
    }).then(res => {
      console.log(res)                //请求成功后执行函数
      if (res.message == "用户登录成功") {
        //利用localstorage存储到本地
        setToken(res.data.token)
        setTime(res.data.expires_in)
        setName(res.data.user_name)
        setEmail(res.data.user_email)
        setPhoto(res.data.user_photo)
        router.push('/user_sys')	//登录验证成功路由实现跳转
        console.log("用户登录成功")
        console.log(res.data.token)
        console.log(res.data.user_name)
      }
      else if (res.message == "管理员登录成功") {
        //利用localstorage存储到本地
        setToken(res.data.token)
        setTime(res.data.expires_in)
        setName(res.data.user_name)
        setEmail(res.data.user_email)
        setPhoto(res.data.user_photo)
        router.push('/admin_sys')	//登录验证成功路由实现跳转
        console.log("管理员登录成功")
        console.log(res.data.token)
      }
      else {
        console.log("登录失败")
        console.log(res.message)
        alert(res.message)
      }
    }).catch(err => {                   //请求错误后执行函
      console.log("用户登录请求错误")
    })
  } catch (error) {
    console.error('登录错误', error);
  }
};
function signIn(event) {
  event.preventDefault()
  var sign = true
  if (user_password.value.value.length < 6 || user_password.value.value.length > 32) {
    alert("用户密码长度应在6-32位之间")
    sign = false
  }
  var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!pattern.test(user_email.value.value)) {
    alert("邮箱填写不正确")
    sign = false
  }
  if (!user_checked.value.value == "on") {
    alert("未同意用户协议")
    sign = false
  }
  if (sign == true) {
    fetchSignIn(user_email.value.value, user_password.value.value)
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
  <div class="vanta_area flex content-center items-center justify-center" ref="Area">
    <!-- Features -->
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div class="relative p-6 md:p-16">
        <!-- Grid -->
        <div class="relative z-10 lg:grid lg:grid-cols-16 lg:gap-16 lg:items-center">
          <div class="mb-10 lg:mb-0 lg:col-span-8 lg:col-start-10 lg:order-2">
            <div class="mt-7 bg-slate-200/50 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
              <div class="p-4 sm:p-7">
                <div class="text-center mt-3">
                  <h1 class="block text-2xl font-bold text-slate-900">登录您的账号</h1>
                </div>

                <div class="mt-5">
                  <!-- Form -->
                  <form>
                    <div class="grid gap-y-4">
                      <!-- Form Group -->
                      <div>
                        <label for="email" class="block text-lg font-extrabold mb-2 mt-3 dark:text-white">邮箱</label>
                        <div class="relative">
                          <input type="email" id="email" ref="user_email" name="email" placeholder="例如:xxx@126.com"
                            class="py-3 px-4 block w-full mt-5 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                            required aria-describedby="email-error">
                          <div class="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                            <svg class="size-5 text-red-500" width="16" height="16" fill="currentColor"
                              viewBox="0 0 16 16" aria-hidden="true">
                              <path
                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                            </svg>
                          </div>
                        </div>
                        <p class="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email
                          address so we can get back to you</p>
                      </div>
                      <!-- End Form Group -->

                      <!-- Form Group -->
                      <div>
                        <div class="flex justify-between items-center">
                          <label for="password"
                            class="block text-lg font-extrabold mb-2 dark:text-white mt-5">密码</label>
                          <!-- <a class="inline-flex items-center gap-x-1 text-sm mt-5 text-violet-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                            href="../examples/html/recover-account.html">忘记密码?</a> -->
                        </div>
                        <div class="relative">
                          <input type="password" id="password" name="password" ref="user_password" placeholder="输入您的密码"
                            class="py-3 mt-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                            required aria-describedby="password-error">
                          <div class="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                            <svg class="size-5 text-red-500" width="16" height="16" fill="currentColor"
                              viewBox="0 0 16 16" aria-hidden="true">
                              <path
                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                            </svg>
                          </div>
                        </div>
                        <p class="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
                      </div>
                      <!-- End Form Group -->

                      <!-- Checkbox -->
                      <div class="flex items-center mt-5">
                        <div class="flex">
                          <input id="remember-me" name="remember-me" ref="user_checked" type="checkbox"
                            class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800">
                        </div>
                        <div class="ms-3">
                          <label for="remember-me"
                            class="text-base dark:text-white font-extrabold">同意使用本系统时符合法律法规</label>
                        </div>
                      </div>
                      <!-- End Checkbox -->

                      <button type="submit" @click="signIn"
                        class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-base font-medium rounded-lg border border-transparent bg-cyan-500 text-white hover:bg-cyan-600 focus:outline-none focus:bg-cyan-600 disabled:opacity-50 disabled:pointer-events-none">登录</button>
                    </div>
                  </form>
                  <div class="flex flex-wrap mt-6">
                    <div class="w-1/2 mt-1">
                      <a href="#pablo" class="text-gray-200">您还没有账号?</a>
                    </div>
                    <div class="w-1/2 text-right">
                      <button type="button"
                        class="py-2 px-3 inline-flex items-center gap-x-2 text-base font-medium rounded-lg border border-transparent bg-teal-100 text-teal-800 hover:bg-teal-200 focus:outline-none focus:bg-teal-200 disabled:opacity-50 disabled:pointer-events-none dark:text-teal-500 dark:bg-teal-800/30 dark:hover:bg-teal-800/20 dark:focus:bg-teal-800/20">
                        创建账号
                      </button>
                    </div>
                  </div>
                  <!-- End Form -->
                </div>
              </div>
            </div>
          </div>
          <!-- End Col -->
          <div class="lg:col-span-8">
            <div class="relative">
              <!-- Tab Content -->
              <div>
                <div id="tabs-with-card-1" role="tabpanel" aria-labelledby="tabs-with-card-item-1">
                  <img class="rounded-xl dark:shadow-gray-900/20" src="../assets/shield.png" alt="Features Image">
                </div>
              </div>
              <!-- End Tab Content -->
            </div>
          </div>
          <!-- End Col -->
        </div>
        <!-- End Grid -->
      </div>
    </div>
    <!-- End Features -->
  </div>
</template>
<style scoped>
.vanta_area {
  height: 100vh;
}
</style>