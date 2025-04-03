<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'
import { getToken, setToken, removeToken, getEmail, getName, getPhoto, removeAll } from '@/plugins/auth_jwt';
const user_name = ref(null)
const user_email = ref(null)
const router = useRouter()
const currentDateTime = ref(new Date().toLocaleString('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
}));
// 更新时间
setInterval(() => {
    currentDateTime.value = new Date().toLocaleString('default', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    });
}, 1000);
onMounted(() => {
    user_name.value = getName()
    user_email.value = getEmail()
})
function signOut(event) {
    removeAll()
    router.push("/sign_in")
}
</script>
<template>
    <div>
        <Disclosure as="nav" class="bg-white w-full h-full" v-slot="{ open }">
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
                            <img class="h-8 w-auto" src="../assets/logo_nobg.png" alt="Your Company" />
                        </div>
                        <div class="hidden sm:ml-0 sm:block">
                            <div class="flex space-x-4">
                                <a :class="['text-gray-800', 'rounded-md px-3 py-2 text-lg font-medium']"
                                    href="/user_sys">人脸深度伪造防御原型系统:用户版</a>
                            </div>
                        </div>
                    </div>
                    <div
                        class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <span class="text-gray-800 text-base font-semibold">
                            您好,{{ user_name }}.
                        </span>
                        <span class="text-gray-800 text-base font-semibold">
                            现在的时间是:{{ currentDateTime }}
                        </span>
                        <a class="ml-8 middle none center mr-4 rounded-lg bg-sky-500 py-2 px-5 font-sans text-base font-bold uppercase text-white shadow-md shadow-slate-500/20 transition-all hover:shadow-lg hover:shadow-slate-500/50 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            data-ripple-light="true" href="https://gitee.com/xyzdz65/MightyFace/blob/master/README.md">
                            系统说明
                        </a>
                        <button @click="signOut"
                            class="middle none center mr-4 rounded-lg bg-red-500 py-2 px-5 font-sans text-base font-bold uppercase text-white shadow-md shadow-slate-500/20 transition-all hover:shadow-lg hover:shadow-slate-500/50 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            data-ripple-light="true">
                            注销
                        </button>
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
    </div>
</template>
