<script setup>
import MightyNavBarAdmin from '@/components/MightyNavBarAdmin.vue';
import { ref, onMounted, onUnmounted, onBeforeMount, getCurrentInstance } from 'vue';
import { getToken, setToken, removeToken, getEmail, getName, getPhoto } from '@/plugins/auth_jwt';
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import Paginate from 'vuejs-paginate-next'
let imageSrc = ref('')
const router = useRouter()
const user_name = ref(null)
const user_email = ref(null)
const user_binded_id = ref(null)
const preview = ref(null)
let token = getToken()
let imgs_in_repo_num = ref(8)
const imageRef = ref(null)
const currentPage = ref(1);
const componentKey = ref(0);
const updateKey = () => {
    // 更新 key 值，触发重新渲染
    componentKey.value += 1;
};
const onClickHandler = (page) => {
    console.log(page);
    fetchMightyImageRepo(page, 8)
};
function changePreview(event) {
    if (event.target.src != "") {
        preview.value.src = event.target.src
        let real_image_id_index = preview.value.src.indexOf("image_id=")
        // console.log(real_image_id_index)
        let image_id_value = parseInt(preview.value.src.substring(real_image_id_index + 9, preview.value.src.length))
        checkRelated(image_id_value)
    }

}
const checkRelated = async (image_id) => {
    try {
        console.log(image_id)
        await axios.get(
            "/admin/check_related/?image_id=" + image_id).then(res => {
                console.log(res.data)                //请求成功后执行函数
                user_binded_id.value = res.data.user_id
                componentKey.value += 1
            }).catch(err => {
                console.log("获取图片库失败")
            })
    } catch (error) {
        console.log("获取图片库错误")
    }
};
const fetchDelete = async () => {
    try {
        let real_image_id_index = preview.value.src.indexOf("image_id=")
        let image_id_value = parseInt(preview.value.src.substring(real_image_id_index + 9, preview.value.src.length))
        console.log(image_id_value)
        await axios.get(
            "/admin/delete_image/?image_id=" + image_id_value).then(res => {
                preview.value.src = "http://localhost:5173/src/assets/image_example_white.png"
                fetchMightyImageRepo(currentPage.value, 8)
            }).catch(err => {
                console.log("维护用户信息失败")
            })
    } catch (error) {
        console.log("维护用户信息错误")
    }
};
const fetchBan = async () => {
    try {
        await axios.get(
            "/admin/ban_user_last/?selected_id=" + user_binded_id.value).then(res => {
            }).catch(err => {
                console.log("维护用户信息失败")
            })
    } catch (error) {
        console.log("维护用户信息错误")
    }
};
function deleteIt(event) {
    fetchDelete()
}
function banIt(event) {
    fetchBan()
}
const fetchMightyImageRepo = async (offset_value, limit_value) => {
    try {
        await axios.get(
            "/admin/get_image_repo/?offset=" + offset_value + "&limit=" + limit_value).then(res => {
                console.log(res.data)                //请求成功后执行函数
                imgs_in_repo_num = res.data.total
                let imgs_content_id = res.data.imgs_id
                let imgs_content_counts = imgs_content_id.length
                console.log(imgs_content_id)
                for (let count of [1, 2, 3, 4, 5, 6, 7, 8]) {
                    let image_box = document.getElementById("image_box_" + count)
                    if (count <= imgs_content_counts) {
                        image_box.src = 'http://127.0.0.1:3407/user/watch_mighty_image/?image_id=' + imgs_content_id[count - 1]
                        image_box.style = "width:12rem;height:12rem"
                    }
                    else {
                        image_box.src = ''
                        image_box.style = ""
                    }
                }

            }).catch(err => {
                console.log("获取图片库失败")
            })
    } catch (error) {
        console.log("获取图片库错误")
    }
};
const initMightyImageRepo = async (offset_value, limit_value) => {
    try {
        await axios.get(
            "/admin/get_image_repo/?offset=" + offset_value + "&limit=" + limit_value).then(res => {
                console.log(res.data)                //请求成功后执行函数
                imgs_in_repo_num = res.data.total
                updateKey()
                let imgs_content_id = res.data.imgs_id
                let imgs_content_counts = imgs_content_id.length
                console.log(imgs_content_id)
                for (let count of [1, 2, 3, 4, 5, 6, 7, 8]) {
                    let image_box = document.getElementById("image_box_" + count)
                    if (count <= imgs_content_counts) {
                        image_box.src = 'http://127.0.0.1:3407/user/watch_mighty_image/?image_id=' + imgs_content_id[count - 1]
                        image_box.style = "width:12rem;height:12rem"
                    }
                    else {
                        image_box.src = ''
                        image_box.style = ""
                    }
                }
            }).catch(err => {
                console.log("获取图片库失败")
            })
    } catch (error) {
        console.log("获取图片库错误")
    }
};
onMounted(() => {
    initMightyImageRepo(1, 8)
    user_name.value = getName()
    user_email.value = getEmail()
    user_binded_id.value = "暂无"
    if (user_name.value == null || user_name.value == undefined) {
        router.push("/sign_in")
    }
    if (user_email.value == null || user_email.value == undefined) {
        router.push("/sign_in")
    }
})
// 调起摄像头
</script>
<template>
    <header>
        <MightyNavBarAdmin />
    </header>
    <div class="flex w-full h-full flex-row bg-gray-800" style="height: 962px;">
        <aside class="h-full w-1/6 flex-col transition-transform">
            <div class="flex flex-col justify-between bg-gray-800">
                <div class="px-4">
                    <span class="grid h-10 w-32 place-content-center rounded-l text-xl font-extrabold text-white">
                        管理员功能栏
                    </span>
                    <ul class="mt-6 space-y-1">
                        <li>
                            <details class="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                    class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 hover:text-gray-900">
                                    <span class="text-md font-medium w-1/12">
                                        <svg width="18.000000" height="18.000000" viewBox="0 0 18 18" fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink">
                                            <desc>
                                                Created with Pixso.
                                            </desc>
                                            <defs />
                                            <g style="mix-blend-mode:normal">
                                                <g style="mix-blend-mode:normal" />
                                                <g style="mix-blend-mode:normal">
                                                    <path id="形状"
                                                        d="M8.25 5.0625C8.25 3.30176 6.82422 1.875 5.0625 1.875C3.30078 1.875 1.875 3.30176 1.875 5.0625C1.875 6.82324 3.30078 8.25 5.0625 8.25L8.25 8.25L8.25 5.0625ZM12.9375 1.875C14.6992 1.875 16.125 3.30176 16.125 5.0625C16.125 6.82324 14.6992 8.25 12.9375 8.25L9.75 8.25L9.75 5.0625C9.75 3.30176 11.1758 1.875 12.9375 1.875ZM6.75 5.0625L6.75 6.75L5.0625 6.75C4.12891 6.75 3.375 5.99414 3.375 5.0625C3.375 4.13086 4.12891 3.375 5.0625 3.375C5.99609 3.375 6.75 4.13086 6.75 5.0625ZM14.625 5.0625C14.625 5.99414 13.8711 6.75 12.9375 6.75L11.25 6.75L11.25 5.0625C11.25 4.13086 12.0039 3.375 12.9375 3.375C13.8711 3.375 14.625 4.13086 14.625 5.0625ZM5.0625 9.75L8.25 9.75L8.25 12.9375C8.25 14.6982 6.82422 16.125 5.0625 16.125C3.30078 16.125 1.875 14.6982 1.875 12.9375C1.875 11.1768 3.30078 9.75 5.0625 9.75ZM9.75 9.75L12.9375 9.75C14.6992 9.75 16.125 11.1768 16.125 12.9375C16.125 14.6982 14.6992 16.125 12.9375 16.125C11.1758 16.125 9.75 14.6982 9.75 12.9375L9.75 9.75ZM3.375 12.9375C3.375 12.0059 4.12891 11.25 5.0625 11.25L6.75 11.25L6.75 12.9375C6.75 13.8691 5.99609 14.625 5.0625 14.625C4.12891 14.625 3.375 13.8691 3.375 12.9375ZM11.25 12.9375L11.25 11.25L12.9375 11.25C13.8711 11.25 14.625 12.0059 14.625 12.9375C14.625 13.8691 13.8711 14.625 12.9375 14.625C12.0039 14.625 11.25 13.8691 11.25 12.9375Z"
                                                        clip-rule="evenodd" fill="#FFFFFF" fill-opacity="1.000000"
                                                        fill-rule="evenodd" />
                                                </g>
                                            </g>
                                        </svg>
                                    </span>
                                    <span class="text-md font-medium w-11/12"> 数据维护功能组 </span>

                                    <span class="shrink-0 transition duration-300 group-open:-rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                </summary>

                                <ul class="mt-2 space-y-1 px-4">
                                    <li class="pl-3">
                                        <a href="/admin_sys_info"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-white hover:bg-emerald-100 hover:text-gray-700">
                                            用户信息维护
                                        </a>
                                    </li>

                                    <li class="pl-3">
                                        <a href="/admin_sys_image"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-emerald-500 hover:bg-emerald-100 hover:text-gray-700">
                                            用户图像维护
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details class="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                    class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-white hover:bg-emerald-600 hover:text-gray-700">
                                    <span class="text-md font-medium w-1/12">
                                        <svg width="18.000000" height="18.000000" viewBox="0 0 18 18" fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink">
                                            <desc>
                                                Created with Pixso.
                                            </desc>
                                            <defs />
                                            <g style="mix-blend-mode:normal">
                                                <g style="mix-blend-mode:normal" />
                                                <g style="mix-blend-mode:normal">
                                                    <path id="形状"
                                                        d="M10.4531 1.6582C9.49609 1.44727 8.50391 1.44727 7.54688 1.65918C7.41797 2.56055 6.90625 3.34961 6.16016 3.80469C5.41016 4.26074 4.50781 4.33301 3.70312 4C3.05078 4.77148 2.55859 5.67578 2.25 6.65723C2.92578 7.22559 3.31641 8.08789 3.31641 9C3.31641 9.91016 2.92578 10.7725 2.25 11.3408C2.55469 12.3232 3.05078 13.2285 3.70312 14C4.50781 13.666 5.41016 13.7383 6.16016 14.1943C6.90625 14.6504 7.41797 15.4404 7.54688 16.3428C8.50391 16.5537 9.49609 16.5527 10.4531 16.3398C10.582 15.4395 11.0938 14.6504 11.8398 14.1953C12.5898 13.7393 13.4922 13.667 14.2969 14C14.9492 13.2285 15.4414 12.3242 15.75 11.3428C15.0977 10.793 14.6836 9.94824 14.6836 9C14.6836 8.08887 15.0742 7.22656 15.75 6.6582C15.4453 5.67578 14.9492 4.77051 14.2969 4C13.4922 4.33301 12.5898 4.26074 11.8398 3.80371C11.0938 3.34863 10.582 2.55957 10.4531 1.6582ZM11.25 9C11.25 10.2422 10.2422 11.25 9 11.25C7.75781 11.25 6.75 10.2422 6.75 9C6.75 7.75781 7.75781 6.75 9 6.75C10.2422 6.75 11.25 7.75781 11.25 9Z"
                                                        clip-rule="evenodd" fill="#D9D9D9" fill-opacity="1.000000"
                                                        fill-rule="evenodd" />
                                                </g>
                                                <g style="mix-blend-mode:normal">
                                                    <g style="mix-blend-mode:normal" />
                                                    <g style="mix-blend-mode:normal">
                                                        <path id="形状"
                                                            d="M1.77344 11.0059C1.94531 11.6162 2.19141 12.2021 2.50781 12.75C2.82422 13.2988 3.20703 13.8057 3.65234 14.2578C4.35938 13.7959 5.26953 13.7715 6.00391 14.1943C6.73438 14.6182 7.16797 15.417 7.125 16.2617C8.35547 16.5811 9.64844 16.582 10.8789 16.2637C10.8359 15.418 11.2695 14.6191 12 14.1953C12.7344 13.7725 13.6445 13.7969 14.3516 14.2578C15.2461 13.3506 15.8906 12.2314 16.2305 11.0049C15.4766 10.6211 15 9.8457 15 9C15 8.15332 15.4766 7.37891 16.2305 6.99512C16.0664 6.39746 15.8203 5.8125 15.4961 5.25C15.1719 4.68848 14.7891 4.18555 14.3516 3.74316C13.6445 4.2041 12.7344 4.22852 12 3.80566C11.2695 3.38281 10.8359 2.58398 10.8789 1.73926C9.64844 1.41992 8.35547 1.41895 7.125 1.7373C7.16797 2.58301 6.73438 3.38184 6.00391 3.80469C5.26953 4.22852 4.35938 4.2041 3.65234 3.74316C2.75781 4.65039 2.11328 5.76953 1.77344 6.99609C2.52734 7.37988 3.00391 8.15527 3.00391 9.00098C3.00391 9.84766 2.52734 10.6221 1.77344 11.0059ZM8.4375 14.9746C8.15234 14.0977 7.55078 13.3584 6.75 12.8975C5.95312 12.4355 5.01172 12.2852 4.10938 12.4746C3.89062 12.168 3.70312 11.8418 3.54688 11.501C4.14844 10.8281 4.5 9.94531 4.5 9C4.50391 8.07812 4.16406 7.1875 3.54688 6.5C3.70312 6.1582 3.89062 5.83301 4.10938 5.52637C5.01172 5.71582 5.95312 5.56445 6.75 5.10254C7.55078 4.6416 8.15234 3.90234 8.44141 3.02539C8.8125 2.99023 9.19141 2.99023 9.5625 3.02539C9.85156 3.90234 10.4531 4.64258 11.25 5.10352C12.0508 5.56543 12.9922 5.71582 13.8945 5.52637C14.1094 5.83301 14.3008 6.15918 14.457 6.5C13.8555 7.17285 13.5 8.05566 13.5 9C13.5 9.92285 13.8398 10.8135 14.457 11.501C14.3008 11.8418 14.1133 12.168 13.8945 12.4746C12.9922 12.2852 12.0508 12.4355 11.25 12.8984C10.4531 13.3594 9.85156 14.0986 9.5625 14.9756C9.1875 15.0107 8.8125 15.0098 8.4375 14.9746ZM9 11.25C7.75781 11.25 6.75 10.2422 6.75 9C6.75 7.75781 7.75781 6.75 9 6.75C10.2422 6.75 11.25 7.75781 11.25 9C11.25 10.2422 10.2422 11.25 9 11.25ZM9.75 9C9.75 9.41406 9.41406 9.75 9 9.75C8.58594 9.75 8.25 9.41406 8.25 9C8.25 8.58594 8.58594 8.25 9 8.25C9.41406 8.25 9.75 8.58594 9.75 9Z"
                                                            clip-rule="evenodd" fill="#383838" fill-opacity="1.000000"
                                                            fill-rule="evenodd" />
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </span>
                                    <span class="text-md font-medium w-11/12"> 服务维护功能组</span>

                                    <span class="shrink-0 transition duration-300 group-open:-rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                </summary>

                                <ul class="mt-2 space-y-1 px-4">
                                    <li class="pl-3">
                                        <a href="/admin_sys_service"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-white hover:bg-emerald-100 hover:text-gray-700">
                                            用户服务历史维护
                                        </a>
                                    </li>

                                    <li class="pl-3">
                                        <a href="/admin_sys_ban"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-white hover:bg-emerald-100 hover:text-gray-700">
                                            用户服务权限维护
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>

                <div class="fixed w-1/6 inset-x-0 bottom-0">
                    <span class="flex items-center gap-2 bg-emerald-500 p-4 hover:bg-emerald-600">
                        <div>
                            <p class="text-xs">
                                <strong class="block font-medium">{{ user_name }}</strong>

                                <span> {{ user_email }}</span>
                            </p>
                        </div>
                    </span>
                </div>
            </div>
        </aside>
        <aside class="h-full m-0.5 flex-col transition-transform" style="width: 43%;">
            <div class="m-1 w-full rounded-md">
                <div class="w-1/12 inline-block"></div>
                <div class="w-10/12 inline-block">
                    <span class="mt-6 text-3xl font-semibold text-white flex items-center justify-center">图像库预览</span>
                    <!-- 预览图像 -->
                    <div class="mt-5">
                        <div class="w-1/12 inline-block">
                        </div>
                        <div class="w-10/12 inline-block">
                            <img class="h-full  w-full rounded-2xl" src="../../assets/image_example_white.png"
                                ref="preview" />
                            <div class="mt-5">
                                <h1 class="text-white mt-2" :key="componentKey">该图像所属用户ID:{{ user_binded_id }}</h1>
                                <button type="button" @click="banIt"
                                    class="text-gray-800 mt-5 bg-red-500 w-72 ml-1 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-xl px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    封禁所属用户</button>
                                <button type="button" @click="deleteIt"
                                    class="text-gray-800 bg-pink-300 ml-5 w-72 hover:bg-pink-500 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-xl font-bold px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    确认删除图片</button>
                            </div>
                        </div>
                        <div class="w-1/12 inline-block">
                        </div>
                    </div>

                </div>
                <div class="w-1/12 inline-block"></div>
            </div>
        </aside>
        <aside class="h-full flex-col transition-transform" style="width: 39%;">
            <div class="m-1 w-full rounded-md">
                <div class="w-1/12 inline-block"></div>
                <div class="w-10/12 inline-block">
                    <span class="mt-2 text-3xl font-semibold text-white flex items-center justify-center">图像库</span>
                    <!-- 预览图像 -->
                    <div class="mt-5">
                        <div class="w-1/12 inline-block">
                        </div>
                        <div class="w-10/12 inline-block">
                            <div class="ml-16 bg-gray-300 rounded-xl flex" id="img_repo_content" style="width:26rem">
                                <div class="grid grid-cols-4 md:grid-cols-2 gap-3 ml-2.5 mb-3 mt-3">
                                    <div class="h-48 w-48"><img src="" id="image_box_1" decoding="sync"
                                            class="image_box rounded-xl" @click="changePreview"></div>
                                    <div class="h-48 w-48"><img src="" id="image_box_2" decoding="sync"
                                            class="image_box rounded-xl" @click="changePreview"></div>
                                    <div class="h-48 w-48"><img src="" id="image_box_3" decoding="sync"
                                            class="image_box rounded-xl" @click="changePreview"></div>
                                    <div class="h-48 w-48"><img src="" id="image_box_4" decoding="sync"
                                            class="image_box rounded-xl" @click="changePreview"></div>
                                    <div class="h-48 w-48"><img src="" id="image_box_5" decoding="sync"
                                            class="image_box rounded-xl" @click="changePreview"></div>
                                    <div class="h-48 w-48"><img src="" id="image_box_6" decoding="sync"
                                            class="image_box rounded-xl" @click="changePreview"></div>
                                    <div class="h-48 w-48"><img src="" id="image_box_7" decoding="sync"
                                            class="image_box rounded-xl" @click="changePreview"></div>
                                    <div class="h-48 w-48"><img src="" id="image_box_8" decoding="sync"
                                            class="image_box rounded-xl" @click="changePreview"></div>
                                </div>
                            </div>
                        </div>
                        <div class="w-1/12 inline-block">
                        </div>
                    </div>
                </div>
                <div class="w-1/12 inline-block"></div>
            </div>
            <div class="mt-5 flex justify-center mb-1" :key="componentKey">
                <vue-awesome-paginate :total-items="imgs_in_repo_num" ref="pag_nav" :items-per-page="8"
                    :max-pages-shown="5" v-model="currentPage" @click="onClickHandler" />
            </div>
        </aside>
    </div>
</template>
<style>
.pagination-container {
    display: flex;

    column-gap: 10px;
}

.paginate-buttons {
    height: 35px;

    width: 35px;

    border-radius: 10px;

    cursor: pointer;

    color: gray;
}

.paginate-buttons:hover {
    background-color: #00FFAA;
}

.active-page {
    background-color: #00bb88;

    border: 1px solid #00aa99;

    color: white;
}

.active-page:hover {
    background-color: #00aa99;
}
</style>