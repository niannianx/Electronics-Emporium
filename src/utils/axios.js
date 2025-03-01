//封装配置文件
//axios：是核心的 HTTP 请求库，用于发送各种类型的 HTTP 请求。
 import axios from 'axios'
 import { showToast, showFailToast } from 'vant'
 import { setLocal } from '@/common/js/utils'
 import router from '../router'

 console.log('import.meta.env', import.meta.env)
 //
 //axios.defaults.baseURL 根据当前的环境模式（import.meta.env.MODE）来设置请求的基础 URL。
 //这里开发环境和生产环境使用了相同的 URL，但实际应用中可以根据不同环境配置不同的接口地址，方便开发和部署。
//  axios.defaults.baseURL = import.meta.env.MODE == 'development' ? '//backend-api-01.newbee.ltd/api/v1' : '//backend-api-01.newbee.ltd/api/v1'
axios.defaults.baseURL = import.meta.env.MODE == 'development' ? '//47.99.134.126:28019/api/v1' : '//47.99.134.126:28019/api/v1'
//axios.defaults.withCredentials = true 允许跨域请求携带凭证（如 cookies），确保在跨域请求时能够正确处理用户的身份信息。 
axios.defaults.withCredentials = true
//表明这是一个 XMLHttpRequest 请求，在一些后端框架中可以用于判断请求类型。
 axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
 //从本地存储中获取 token 并设置到请求头中，用于身份验证。
 axios.defaults.headers['token'] = localStorage.getItem('token') || ''
 //设置 POST 请求的请求体格式为 JSON
 axios.defaults.headers.post['Content-Type'] = 'application/json'
 
 //响应拦截器
 axios.interceptors.response.use(res => {
   if (typeof res.data !== 'object') {
    showFailToast('服务端异常！')
     return Promise.reject(res)
   }
   if (res.data.resultCode != 200) {
     if (res.data.message) showFailToast(res.data.message)
     if (res.data.resultCode == 416) {  //416：用户的登录状态失效
       router.push({ path: '/login' })//跳转到登录页面
     }
     //更新token
     //检查响应数据中是否包含 data 字段，并且当前页面的哈希值是否为 #/login
     if (res.data.data && window.location.hash == '#/login') {
       setLocal('token', res.data.data)
       axios.defaults.headers['token'] = res.data.data
     }
     return Promise.reject(res.data)
   }
 
   return res.data
 })
 
 export default axios//导出
 