<script setup>
import MightyNavBarUser from '@/components/MightyNavBarUser.vue';
import { ref, onMounted, onUnmounted, onBeforeMount, getCurrentInstance } from 'vue';
import { getToken, setToken, removeToken, getEmail, getName, getPhoto } from '@/plugins/auth_jwt';
import { useRouter } from 'vue-router'
import { initFlowbite } from 'flowbite'
import Paginate from 'vuejs-paginate-next'
import axios from '@/plugins/axios'
const router = useRouter()
const user_name = ref(null)
const user_email = ref(null)
const currentPage = ref(1)
const componentKey = ref(0)
const download_data = ref(null)
const result_box = ref(null)
const updateKey = () => {
    // 更新 key 值，触发重新渲染
    componentKey.value += 1;
};
const real_details = ref(null)
let websocket_url = "ws://localhost:3407/mighty_socket"
let token = getToken()
let mighty_socket = null
let service_count = ref(13)
let items = [
    { id: 1, created_time: "暂无", service_type: "暂无", service_data: "暂无", service_result: "暂无" },
]
const onClickHandler = (page) => {
    console.log(page);
    fetchMightyService(page, 13)
};
const initMightyService = async (offset_value, limit_value) => {
    try {
        await axios.get(
            "/user/get_service_history/?offset=" + offset_value + "&limit=" + limit_value).then(res => {
                console.log(res.data)                //请求成功后执行函数
                service_count = res.data.total
                items = res.data.service_history
                componentKey.value += 1
                console.log(items)
            }).catch(err => {
                console.log("获取服务历史记录失败")
            })
    } catch (error) {
        console.log("获取服务历史记录错误")
    }
};
const fetchMightyService = async (offset_value, limit_value) => {
    try {
        await axios.get(
            "/user/get_service_history/?offset=" + offset_value + "&limit=" + limit_value).then(res => {
                console.log(res.data)                //请求成功后执行函数
                service_count = res.data.total
                items = res.data.service_history
                componentKey.value += 1
                console.log(items)
            }).catch(err => {
                console.log("获取服务历史记录失败")
            })
    } catch (error) {
        console.log("获取服务历史记录错误")
    }
};
const fetchResult = async (target_id) => {
    try {
        await axios.get(
            "/user/get_mighty_result/?service_id=" + target_id).then(res => {
                console.log(res.data)                //请求成功后执行函数
                result_box.value.value = res.data
            }).catch(err => {
                console.log("获取服务结果失败")
            })
    } catch (error) {
        console.log("获取服务结果错误")
    }
};
function checkDetails(event) {
    real_details.value.click()
    const target_id = event.target.parentNode.parentNode.childNodes[0].innerText
    const target_data = event.target.parentNode.parentNode.childNodes[3].innerText
    fetchResult(target_id)
    if (target_data == "无附加数据") {
        download_data.value.class = "hidden"
    }
    else {
        download_data.value.class = ""
        if (event.target.parentNode.parentNode.childNodes[2].innerText == "照片采集" || event.target.parentNode.parentNode.childNodes[2].innerText == "AGGAN伪造" || event.target.parentNode.parentNode.childNodes[2].innerText == "STARGAN伪造" || event.target.parentNode.parentNode.childNodes[2].innerText == "FGAN伪造" || event.target.parentNode.parentNode.childNodes[2].innerText == "FGAN伪造" || event.target.parentNode.parentNode.childNodes[2].innerText == "ATTGAN伪造")
            download_data.value.href = 'http://127.0.0.1:3407/user/watch_mighty_image/?image_id=' + target_id
        else
            download_data.value.href = "http://127.0.0.1:3407" + "/user/get_mighty_data/?service_id=" + target_id
    }
}

function mightySocketOpen() {
    console.log("MightySocketOpen")
}
function mightySocketError() {
    console.log("MightySocketError")
}
function mightySocketClose() {
    console.log("MightySocketClose")
}
const fetchMightySocket = async () => {
    mighty_socket = new WebSocket(websocket_url, [token])
    mighty_socket.onopen = mightySocketOpen
    mighty_socket.onerror = mightySocketError
    mighty_socket.onclose = mightySocketClose
};
onMounted(() => {
    user_name.value = getName()
    user_email.value = getEmail()
    if (user_name.value == null || user_name.value == undefined) {
        router.push("/sign_in")
    }
    if (user_email.value == null || user_email.value == undefined) {
        router.push("/sign_in")
    }
    initFlowbite();
    fetchMightySocket()
    initMightyService(1, 13)
})
// 调起摄像头
</script>
<template>
    <header>
        <MightyNavBarUser />
    </header>
    <div class="flex w-full h-full flex-row">
        <aside class="h-full w-1/6 flex-col transition-transform">
            <div class="flex flex-col justify-between border-e bg-white">
                <div class="px-4">
                    <span class="grid h-10 w-32 place-content-center rounded-l text-xl font-extrabold text-gray-500">
                        用户功能栏
                    </span>
                    <ul class="mt-6 space-y-1">
                        <li>
                            <details class="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                    class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
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
                                                        clip-rule="evenodd" fill="#383838" fill-opacity="1.000000"
                                                        fill-rule="evenodd" />
                                                </g>
                                            </g>
                                        </svg>
                                    </span>
                                    <span class="text-md font-medium w-11/12"> 深度生成功能组 </span>

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
                                        <a href="/user_sys_collect"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                            人脸采集
                                        </a>
                                    </li>

                                    <li class="pl-3">
                                        <a href="/user_sys_gen"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                            深度人脸生成
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </li>

                        <li>
                            <details class="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                    class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                    <span class="w-1/12 text-md font-medium">
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
                                                        d="M15 1.5L3 1.5C2.58594 1.5 2.25 1.83594 2.25 2.25L2.25 16.707C2.25 16.834 2.31641 16.9521 2.42188 17.0215C2.52734 17.0908 2.66016 17.1006 2.77734 17.0488L9 14.2725L15.2227 17.0498C15.3398 17.1016 15.4727 17.0908 15.5781 17.0215C15.6875 16.9531 15.75 16.834 15.75 16.707L15.75 2.25C15.75 1.83594 15.4141 1.5 15 1.5ZM10.7852 8.83008L11.2031 11.2842L9 10.125L6.79688 11.2842L7.21484 8.83008L5.43359 7.09082L7.89844 6.73242L9 4.5L10.1016 6.73242L12.5664 7.09082L10.7852 8.83008Z"
                                                        clip-rule="evenodd" fill="#D9D9D9" fill-opacity="1.000000"
                                                        fill-rule="evenodd" />
                                                </g>
                                                <g style="mix-blend-mode:normal">
                                                    <g style="mix-blend-mode:normal">
                                                        <path id="形状"
                                                            d="M3 1.5L15 1.5C15.4141 1.5 15.75 1.83594 15.75 2.25L15.75 16.707C15.75 16.834 15.6875 16.9531 15.5781 17.0215C15.4727 17.0908 15.3398 17.1016 15.2227 17.0498L9 14.2725L2.77734 17.0488C2.66016 17.1006 2.52734 17.0908 2.42188 17.0215C2.31641 16.9521 2.25 16.834 2.25 16.707L2.25 2.25C2.25 1.83594 2.58594 1.5 3 1.5ZM14.25 14.9736L14.25 3L3.75 3L3.75 14.9736L9 12.6309L14.25 14.9736ZM6.79688 11.2842L9 10.125L11.2031 11.2842L10.7852 8.83008L12.5664 7.09082L10.1016 6.73242L9 4.5L7.89844 6.73242L5.43359 7.09082L7.21484 8.83008L6.79688 11.2842Z"
                                                            clip-rule="evenodd" fill="#383838" fill-opacity="1.000000"
                                                            fill-rule="evenodd" />
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </span>
                                    <span class=" w-11/12 text-md font-medium"> 防御功能组 </span>

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
                                        <a href="/user_sys_proactive_defense"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                            主动防御
                                        </a>
                                    </li>

                                    <li class="pl-3">
                                        <a href="/user_sys_proactive_detection"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                            主动取证
                                        </a>
                                    </li>

                                    <li class="pl-3">
                                        <a href="/user_sys_passive_detection"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                            被动防御
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details class="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                    class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
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
                                                        d="M15.75 2.25L12.75 2.25L12.75 0.75L11.25 0.75L11.25 2.25L6.75 2.25L6.75 0.75L5.25 0.75L5.25 2.25L2.25 2.25C1.83594 2.25 1.5 2.58594 1.5 3L1.5 15C1.5 15.4141 1.83594 15.75 2.25 15.75L15.75 15.75C16.1641 15.75 16.5 15.4141 16.5 15L16.5 3C16.5 2.58594 16.1641 2.25 15.75 2.25ZM3 14.25L3 6.75L15 6.75L15 14.25L3 14.25Z"
                                                        clip-rule="evenodd" fill="#D9D9D9" fill-opacity="1.000000"
                                                        fill-rule="evenodd" />
                                                </g>
                                                <g style="mix-blend-mode:normal">
                                                    <g style="mix-blend-mode:normal" />
                                                    <g style="mix-blend-mode:normal">
                                                        <path id="形状"
                                                            d="M15.75 2.25L12.75 2.25L12.75 0.75L11.25 0.75L11.25 2.25L6.75 2.25L6.75 0.75L5.25 0.75L5.25 2.25L2.25 2.25C1.83594 2.25 1.5 2.58594 1.5 3L1.5 15C1.5 15.4141 1.83594 15.75 2.25 15.75L15.75 15.75C16.1641 15.75 16.5 15.4141 16.5 15L16.5 3C16.5 2.58594 16.1641 2.25 15.75 2.25ZM11.25 3.75L6.75 3.75L6.75 5.25L5.25 5.25L5.25 3.75L3 3.75L3 6.75L15 6.75L15 3.75L12.75 3.75L12.75 5.25L11.25 5.25L11.25 3.75ZM3 8.25L15 8.25L15 14.25L3 14.25L3 8.25ZM6 11.25L6 9.75L4.5 9.75L4.5 11.25L6 11.25ZM8.25 9.75L9.75 9.75L9.75 11.25L8.25 11.25L8.25 9.75ZM13.5 11.25L13.5 9.75L12 9.75L12 11.25L13.5 11.25Z"
                                                            clip-rule="evenodd" fill="#383838" fill-opacity="1.000000"
                                                            fill-rule="evenodd" />
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </span>
                                    <span class="text-md font-medium w-11/12">性能评估功能组</span>

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
                                        <a href="/user_sys_active_defense_eval"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                            主动防御性能综合评估
                                        </a>
                                    </li>

                                    <li class="pl-3">
                                        <a href="/user_sys_active_detection_eval"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                            主动取证性能综合评估
                                        </a>
                                    </li>

                                    <li class="pl-3">
                                        <a href="/user_sys_passive_detection_eval"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                            被动防御性能综合评估
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details class="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                    class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 bg-sky-100 text-gray-500 hover:bg-sky-200 hover:text-gray-700">
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
                                                        clip-rule="evenodd" fill="#4580FF" fill-opacity="1.000000"
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
                                    <span class="text-md font-medium w-11/12"> 用户信息功能组 </span>

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
                                        <a href="/user_sys_info"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                            个人信息
                                        </a>
                                    </li>

                                    <li class="pl-3">
                                        <a href="/user_sys_service_history"
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-sky-600 hover:text-sky-700">
                                            服务历史
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>

                <div class="fixed w-1/6 inset-x-0 bottom-0 border-t border-gray-100">
                    <span class="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
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
        <aside class="h-full m-0.5 flex-col transition-transform" style="width: 82.5%;">
            <div class="w-1/12 inline-block"></div>
            <div class="w-10/12 inline-block">
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <button data-modal-target="details-modal" ref="real_details" data-modal-toggle="details-modal"
                        class="hidden text-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-center "
                        type="button">
                        详情
                    </button>
                    <div id="details-modal" tabindex="-1" aria-hidden="true"
                        class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div class="relative p-4 w-full max-w-3xl max-h-full">
                            <!-- Modal content -->
                            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <!-- Modal header -->
                                <div
                                    class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <span class="text-md font-bold">详情信息</span>
                                    <button type="button"
                                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-md w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                        data-modal-hide="details-modal">
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <!-- Modal body -->
                                <div class="p-4 md:p-5 space-y-4">
                                    <label
                                        class="inline-block mb-2 mr-5 text-md font-bold text-gray-900 dark:text-white">数据下载</label>
                                    <a class="inline" href="#" ref="download_data"><span
                                            class="text-blue-500">下载</span></a>
                                    <label
                                        class="block mb-2 mr-5 text-md font-bold text-gray-900 dark:text-white">服务结果</label>
                                    <textarea rows="13" ref="result_box" placeholder="获取结果中..."
                                        class="block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                                </div>
                                <!-- Modal footer -->
                                <div
                                    class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                    <button type="button" data-modal-target="details-modal"
                                        data-modal-toggle="details-modal"
                                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        查看完毕</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 text-lg py-3">
                                    服务记录ID
                                </th>
                                <th scope="col" class="px-6 text-lg py-3">
                                    服务时间
                                </th>
                                <th scope="col" class="px-6 text-lg py-3">
                                    服务种类
                                </th>
                                <th scope="col" class="px-6 text-lg py-3">
                                    服务数据
                                </th>
                                <th scope="col" class="px-6 text-lg py-3">
                                    服务结果
                                </th>
                                <th scope="col" class="px-6 text-lg py-3">
                                    服务操作
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in items" :key="index" :ref="'row-' + index"
                                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                <th scope="row"
                                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {{ item.id }}
                                </th>
                                <td class="px-6 py-4">
                                    {{ item.created_time }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ item.service_type }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ item.service_data }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ item.service_result }}
                                </td>
                                <td class="px-6 py-4">
                                    <button @click="checkDetails"
                                        class="text-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-center "
                                        type="button">
                                        详情
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div class="mt-5 flex justify-center mb-1" :key="componentKey">
                    <vue-awesome-paginate :total-items="service_count" ref="pag_nav" :items-per-page="13"
                        :max-pages-shown="5" v-model="currentPage" @click="onClickHandler" paginate-buttons-class="btn"
                        active-page-class="btn-active" back-button-class="back-btn" next-button-class="next-btn" />
                </div>
            </div>
            <div class="w-1/12 inline-block">
            </div>
        </aside>
    </div>
</template>
<style>
.pagination-container {
    display: flex;

    column-gap: 10px;
}

.btn {
    height: 35px;

    width: 35px;

    border-radius: 20px;

    cursor: pointer;

    color: black;
}

.btn:hover {
    background-color: #d8d8d8;
}

.btn-active {
    background-color: #3498db;

    border: 1px solid #3498db;

    color: white;
}

.btn-active:hover {
    background-color: #2988c8;
}
</style>
