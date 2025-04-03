import { createRouter, createWebHistory } from 'vue-router'
import MightySignIn from '@/views/MightySignIn.vue'
import MightySignUp from '@/views/MightySignUp.vue'
import MightyHome from '@/views/MightyHome.vue'
import MightyAdminSys from '@/views/MightyAdminSys.vue'
import MightyUserSys from '@/views/MightyUserSys.vue'
import MightyUserSysCollect from '@/components/user_sys_page/MightyUserSysCollect.vue'
import MightyUserSysGen from '@/components/user_sys_page/MightyUserSysGen.vue'
import MightyUserSysActiveDefense from '@/components/user_sys_page/MightyUserSysActiveDefense.vue'
import MightyUserSysActiveDetection from '@/components/user_sys_page/MightyUserSysActiveDetection.vue'
import MightyUserSysPassiveDetection from '@/components/user_sys_page/MightyUserSysPassiveDetection.vue'
import MightyUserSysActiveDefenseE from '@/components/user_sys_page/MightyUserSysActiveDefenseE.vue'
import MightyUserSysActiveDetectionE from '@/components/user_sys_page/MightyUserSysActiveDetectionE.vue'
import MightyUserSysPassiveDetectionE from '@/components/user_sys_page/MightyUserSysPassiveDetectionE.vue'
import MightyUserSysUserInfo from '@/components/user_sys_page/MightyUserSysUserInfo.vue'
import MightyUserSysServiceHistory from '@/components/user_sys_page/MightyUserSysServiceHistory.vue'
import MightyAdminInfo from '@/components/admin_sys_page/MightyAdminInfo.vue'
import MightyAdminImage from '@/components/admin_sys_page/MightyAdminImage.vue'
import MightyAdminService from '@/components/admin_sys_page/MightyAdminService.vue'
import MightyAdminBan from '@/components/admin_sys_page/MightyAdminBan.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MightyHome,
      meta: {title:'MightyFace首页'}
    },
    {
      path: '/sign_in',
      name: 'sign_in',
    //   component: () => import('../views/MightySignIn.vue')
      component: MightySignIn,
      meta: {title:'登陆MightyFace'}
    },
    {
      path: '/sign_up',
      name: 'sign_up',
      component: MightySignUp,
      meta: {title:'注册MightyFace'}
    },
    {
      path: '/user_sys',
      name: 'user_sys',
      component: MightyUserSys,
      meta: {title:'MightyFace用户系统'}
    },
     {
      path: '/user_sys_collect',
      name: 'user_sys_collect',
      component: MightyUserSysCollect,
      meta: {title:'MightyFace用户系统人脸采集模组'}
    },
    {
      path: '/user_sys_gen',
      name: 'user_sys_gen',
      component: MightyUserSysGen,
      meta: {title:'MightyFace用户系统深度人脸生成模组'}
    },
    {
      path: '/user_sys_proactive_defense',
      name: 'user_sys_proactive_defense',
      component: MightyUserSysActiveDefense,
      meta: {title:'MightyFace用户系统主动防御模组'}
    },
    {
      path: '/user_sys_proactive_detection',
      name: 'user_sys_proactive_detection',
      component: MightyUserSysActiveDetection,
      meta: {title:'MightyFace用户系统主动取证模组'}
    },
    {
      path: '/user_sys_passive_detection',
      name: 'user_sys_passive_detection',
      component: MightyUserSysPassiveDetection,
      meta: {title:'MightyFace用户系统被动取证模组'}
    },
    {
      path: '/user_sys_active_defense_eval',
      name: 'user_sys_active_defense_eval',
      component: MightyUserSysActiveDefenseE,
      meta: {title:'MightyFace用户系统主动防御性能综合评估模组'}
    },
    {
      path: '/user_sys_active_detection_eval',
      name: 'user_sys_active_detection_eval',
      component: MightyUserSysActiveDetectionE,
      meta: {title:'MightyFace用户系统主动取证性能综合评估模组'}
    },
    {
      path: '/user_sys_passive_detection_eval',
      name: 'user_sys_passive_detection_eval',
      component: MightyUserSysPassiveDetectionE,
      meta: {title:'MightyFace用户系统主动取证性能综合评估模组'}
    },
    {
      path: '/user_sys_info',
      name: 'user_sys_info',
      component: MightyUserSysUserInfo,
      meta: {title:'MightyFace用户系统个人信息模组'}
    },
    {
      path: '/user_sys_service_history',
      name: 'user_sys_service_history',
      component: MightyUserSysServiceHistory,
      meta: {title:'MightyFace用户系统服务历史模组'}
    },
    {
      path: '/admin_sys',
      name: 'admin_sys',
      component: MightyAdminSys,
      meta: {title:'MightyFace管理员系统'}
    },
     {
      path: '/admin_sys_info',
      name: 'admin_sys_info',
      component: MightyAdminInfo,
      meta: {title:'MightyFace管理员系统用户信息维护'}
    },
     {
      path: '/admin_sys_image',
      name: 'admin_sys_image',
      component: MightyAdminImage,
      meta: {title:'MightyFace管理员系统用户图像维护'}
    },
     {
      path: '/admin_sys_service',
      name: 'admin_sys_service',
      component: MightyAdminService,
      meta: {title:'MightyFace管理员系统用户服务历史记录维护'}
    },
     {
      path: '/admin_sys_ban',
      name: 'admin_sys_ban',
      component: MightyAdminBan,
      meta: {title:'MightyFace管理员系统用户权限维护'}
    }
  ]
})

export default router