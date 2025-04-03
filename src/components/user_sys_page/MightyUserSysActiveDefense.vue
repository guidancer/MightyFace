<script setup>
import MightyNavBarUser from '@/components/MightyNavBarUser.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { getToken, setToken, removeToken, getEmail, getName, getPhoto } from '@/plugins/auth_jwt';
import { useRouter } from 'vue-router'
import { initFlowbite } from 'flowbite'
import axios from '@/plugins/axios'
import Paginate from 'vuejs-paginate-next'
const router = useRouter()
const user_name = ref(null)
const user_email = ref(null)
const currentTab = ref(null)
const epsilon_ref = ref(null)
const active_defense_real = ref(null)
const active_defense_res = ref(null)
const active_defense_msgbox = ref(null)
const active_defense_image_repo = ref(null)
const agCurrentPage = ref(1);
const agComponentKey = ref(0);
const agUpdateKey = () => {
    // 更新 key 值，触发重新渲染
    agComponentKey.value += 1;
};
let agPreview = ref(null)
let websocket_url = "ws://localhost:3407/mighty_socket"
let token = getToken()
let mighty_socket = null
let imgs_in_repo_num = ref(8)
currentTab.value = 1
const agFetchMightyImageRepo = async (offset_value, limit_value) => {
    try {
        await axios.get(
            "/user/get_image_repo/?offset=" + offset_value + "&limit=" + limit_value).then(res => {
                console.log(res.data)                //请求成功后执行函数
                imgs_in_repo_num = res.data.total
                let imgs_content_id = res.data.imgs_id
                let imgs_content_counts = imgs_content_id.length
                console.log(imgs_content_id)
                for (let count of [1, 2, 3, 4, 5, 6, 7, 8]) {
                    let image_box = document.getElementById("ag_image_box_" + count)
                    if (count <= imgs_content_counts) {
                        image_box.src = 'http://127.0.0.1:3407/user/watch_mighty_image/?image_id=' + imgs_content_id[count - 1]
                        image_box.style = "width:7rem;height:7rem"
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
const agInitMightyImageRepo = async (offset_value, limit_value) => {
    try {
        await axios.get(
            "/user/get_image_repo/?offset=" + offset_value + "&limit=" + limit_value).then(res => {
                console.log(res.data)                //请求成功后执行函数
                imgs_in_repo_num = res.data.total
                agUpdateKey()
                let imgs_content_id = res.data.imgs_id
                let imgs_content_counts = imgs_content_id.length
                console.log(imgs_content_id)
                for (let count of [1, 2, 3, 4, 5, 6, 7, 8]) {
                    let image_box = document.getElementById("ag_image_box_" + count)
                    if (count <= imgs_content_counts) {
                        image_box.src = 'http://127.0.0.1:3407/user/watch_mighty_image/?image_id=' + imgs_content_id[count - 1]
                        image_box.style = "width:7rem;height:7rem"
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
const agOnClickHandler = (page) => {
    agFetchMightyImageRepo(page, 8)
};
function agChangeChecked(event) {
    if (event.target.src != "")
        agPreview.value.src = event.target.src
}
function agImgRepo(event) {
    active_defense_image_repo.value.click()
    agInitMightyImageRepo(1, 8)
}
function agConfirmChecked() {
    active_defense_real.value.src = agPreview.value.src
    active_defense_real.value.style = "height:410px;weight:410px"
}
const activeFetchDefense = async (image_id_value, epsilon_value) => {
    try {
        await axios({
            method: "post",
            url: '/user/active_defense',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                image_id: image_id_value,
                epsilon: epsilon_value
            })
        }).then(res => {
            console.log(res)                //请求成功后执行函数
            if (res.message == "主动防御成功!") {
                active_defense_res.value.src = "data:image/png;base64," + res.data
                active_defense_res.value.style = "width:410px;height:410px"
                active_defense_msgbox.value.value += '\n'
            }
            else {
                alert(res.message)
            }
        }).catch(err => {                   //请求错误后执行函
            console.log("active_defense请求错误")
        })
    } catch (error) {
        console.error('active_defense错误', error);
    }
};
function activeDefense() {
    let real_image_src = active_defense_real.value.src
    console.log(real_image_src)
    let real_image_id_index = real_image_src.indexOf("image_id=")
    console.log(real_image_id_index)
    let image_id_value = parseInt(real_image_src.substring(real_image_id_index + 9, real_image_src.length))
    console.log(image_id_value)
    activeFetchDefense(image_id_value, epsilon_ref.value.value)
}
//整体方法
function mightySocketOpen() {
    console.log("MightySocketOpen")
    active_defense_msgbox.value.value = ""
}
function mightySocketError() {
    console.log("MightySocketError")
}
function mightySocketClose() {
    console.log("MightySocketClose")
}
function mightySocketMessage(event) {
    const received_msg = JSON.parse(event.data)
    if (received_msg.sender_type == "active_defense") {
        active_defense_msgbox.value.value = active_defense_msgbox.value.value + received_msg.sender_msg + "\n"
    }
}
const fetchMightySocket = async () => {
    mighty_socket = new WebSocket(websocket_url, [token])
    mighty_socket.onopen = mightySocketOpen
    mighty_socket.onerror = mightySocketError
    mighty_socket.onclose = mightySocketClose
    mighty_socket.onmessage = mightySocketMessage
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
})
</script>
<template>
    <header>
        <MightyNavBarUser />
    </header>
    <div class="flex w-full h-full flex-row">
        <!-- 侧边栏 -->
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
                                    class="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 bg-sky-100 text-gray-500 hover:bg-sky-200 hover:text-gray-700">
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
                                                        clip-rule="evenodd" fill="#4580FF" fill-opacity="1.000000"
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
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-sky-600 hover:text-sky-700">
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
                                            class="block rounded-lg px-4 py-2 text-md font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
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
        <aside class="h-full w-5/6 flex-col transition-transform bg-blue-100 rounded-xl" style="width: 83%;">
            <div class="items-center justify-center mt-8 mb-12">
                <div>
                    <div class="w-3/12 inline-block">
                        <div class="mt-3 ml-3 bg-white rounded-2xl shadow-xl">
                            <img class="w-auto h-auto rounded-2xl" src="../../assets/people_1.jpg"
                                ref="active_defense_real" @click="agImgRepo" />
                        </div>
                    </div>
                    <div class="w-2/12 inline-block">
                        <div class="rounded-2xl place-content-center place-items-center">
                            <button data-modal-target="active-defense-modal" data-modal-toggle="active-defense-modal"
                                ref="active_defense_image_repo"
                                class="hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                type="button">
                                Toggle Image Repo
                            </button>
                            <!-- Main modal For Calling Camera-->
                            <div id="active-defense-modal" tabindex="-1" aria-hidden="true"
                                class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                                <div class="relative p-4 w-full max-w-2xl max-h-full">
                                    <!-- Modal content -->

                                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <!-- Modal header -->
                                        <div
                                            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                                打开图像库
                                            </h3>
                                            <button type="button"
                                                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-md w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                data-modal-hide="active-defense-modal">
                                                <svg class="w-3 h-3" aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" stroke-linecap="round"
                                                        stroke-linejoin="round" stroke-width="2"
                                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg>
                                                <span class="sr-only">Close modal</span>
                                            </button>
                                        </div>
                                        <div class="mt-5">
                                            <div class="w-2/12 inline-block">
                                            </div>
                                            <div class="w-8/12 inline-block items-center"
                                                style="height: 384px;width: 384px;">
                                                <img class="ml-7 h-full w-full rounded-2xl"
                                                    src="../../assets/image_example_white.png" ref="agPreview" />
                                            </div>
                                            <div class="w-2/12 inline-block">
                                            </div>
                                        </div>
                                        <!-- Modal body -->
                                        <div class="p-4 md:p-5 space-y-4 flex items-center">
                                            <div class="bg-gray-300 rounded-xl h-80 flex" id="ag_img_repo_content"
                                                style="">
                                                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 ml-2.5">
                                                    <div class="h-36 w-36"><img src="" id="ag_image_box_1"
                                                            decoding="sync" class="ag_image_box rounded-xl"
                                                            @click="agChangeChecked"></div>
                                                    <div class="h-36 w-36"><img src="" id="ag_image_box_2"
                                                            decoding="sync" class="ag_image_box rounded-xl"
                                                            @click="agChangeChecked"></div>
                                                    <div class="h-36 w-36"><img src="" id="ag_image_box_3"
                                                            decoding="sync" class="ag_image_box rounded-xl"
                                                            @click="agChangeChecked"></div>
                                                    <div class="h-36 w-36"><img src="" id="ag_image_box_4"
                                                            decoding="sync" class="ag_image_box rounded-xl"
                                                            @click="agChangeChecked"></div>
                                                    <div class="h-36 w-36"><img src="" id="ag_image_box_5"
                                                            decoding="sync" class="ag_image_box rounded-xl"
                                                            @click="agChangeChecked"></div>
                                                    <div class="h-36 w-36"><img src="" id="ag_image_box_6"
                                                            decoding="sync" class="ag_image_box rounded-xl"
                                                            @click="agChangeChecked"></div>
                                                    <div class="h-36 w-36"><img src="" id="ag_image_box_7"
                                                            decoding="sync" class="ag_image_box rounded-xl"
                                                            @click="agChangeChecked"></div>
                                                    <div class="h-36 w-36"><img src="" id="ag_image_box_8"
                                                            decoding="sync" class="ag_image_box rounded-xl"
                                                            @click="agChangeChecked"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mt-5 flex justify-center mb-1" :key="agComponentKey">
                                            <vue-awesome-paginate :total-items="imgs_in_repo_num" ref="pag_nav"
                                                :items-per-page="8" :max-pages-shown="5" v-model="agCurrentPage"
                                                @click="agOnClickHandler" paginate-buttons-class="btn"
                                                active-page-class="btn-active" back-button-class="back-btn"
                                                next-button-class="next-btn" />
                                        </div>
                                        <!-- Modal footer -->
                                        <div
                                            class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                            <button type="button" @click="agConfirmChecked"
                                                data-modal-hide="active-defense-modal"
                                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">确认图片</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class=" text-blue-100">我是不可见的定位符</div>
                        </div>
                    </div>
                    <div class="w-2/12 inline-block">
                        <div class=" text-blue-100 mb-32 ml-10 mt-3 w-full pr-32">
                            <label
                                class="block mb-2 text-lg font-medium text-gray-900 dark:text-white">防御强度阈值(0-1)</label>
                            <label class="block mb-2 text-lg font-medium text-gray-900 dark:text-white">推荐0.05</label>
                            <input type="text" placeholder="0.05" ref="epsilon_ref"
                                class="block w-full text-gray-900 border-gray-200 rounded-lg text-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                required aria-describedby="email-error">
                        </div>
                        <div class=" text-blue-100">我是不可见的定位符</div>
                    </div>
                    <div class="w-2/12 inline-block">
                        <div class="mb-20 rounded-2xl place-content-center place-items-center pl-12">
                            <img class="w-auto h-auto rounded-2xl" src="../../assets/southeast.png" />
                        </div>
                    </div>
                    <div class="w-3/12 inline-block">
                        <div class="mt-3 mr-3 bg-white rounded-2xl shadow-xl">
                            <img class="w-auto h-auto rounded-2xl" src="../../assets/question.jpg"
                                ref="active_defense_res" />
                        </div>
                    </div>
                </div>
                <div>
                    <div class="w-8/12 inline-block ml-3">
                        <label for="message"
                            class="block mb-2 text-md font-medium text-gray-900 dark:text-white">进度信息</label>
                        <textarea id="message" rows="16" ref="active_defense_msgbox"
                            class="block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="等待服务器信息......"></textarea>
                    </div>
                    <div class="inline-block" style="width:32%">
                        <div class="mt-3 rounded-2xl ml-32 mr-3">
                            <img @click="activeDefense" class="w-full h-auto rounded-2xl"
                                src="../../assets/active_defense_icon.png" />
                        </div>
                    </div>
                </div>
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
