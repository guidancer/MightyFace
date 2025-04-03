import axios from 'axios';
import { setToken,getToken } from './auth_jwt';
const instance = axios.create({
  baseURL: 'http://127.0.0.1:3407', // 后端API地址
  timeout: 10000, // 请求超时时间
  // timeout: 1000000000, // 请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(config => {
  //在请求发送之前做些什么
  const token_value = getToken()
  if(token_value){
  config.headers.Authorization = `Bearer ${token_value}`
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(response => {
  let res = response.data
  console.log(response)
  if(res.code && res.code.toString().startsWith('4')){
    //如果是4开头的code，则重定向到登录页面
    window.location.href='/sign_in'
    return Promise.reject("用户权限被禁止或当前会话已过期")
  }
  return res;
}, error => {
  return Promise.reject(error);
});


export default instance;