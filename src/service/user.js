
//用户相关服务请求
//封装了与用户相关的 API 请求函数
//这些函数借助 axios 发起对应的 HTTP 请求，将与用户相关的业务逻辑从组件中分离出来
import axios from '../utils/axios'

export function getUserInfo() {
  return axios.get('/user/info');
}

export function EditUserInfo(params) {
  return axios.put('/user/info', params);
}

export function login(params) {
  return axios.post('/user/login', params);
}

export function logout() {
  return axios.post('/user/logout')
}

export function register(params) {
  return axios.post('/user/register', params);
}

