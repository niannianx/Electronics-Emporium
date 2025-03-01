

<template>
  <div class="login">
    <s-header :name="type == 'login' ? '登录' : '注册'" :back="'/home'"></s-header>
    <svg t="1740817337107" class="logo" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4446" width="200" height="200"><path d="M840.446 681.462c13.73-1.445 23.848-14.453 21.68-28.183l-35.41-283.28v-1.446c-11.563-59.257-48.418-91.777-104.063-91.777H653.28c0-74.433-60.703-134.413-134.414-134.413s-134.413 59.98-134.413 133.69h-59.258c-28.183 0-93.945 0-112.734 82.383 0 0.723 0 1.445-0.723 2.89l-50.585 443.71v2.89c0 45.528 36.855 83.106 83.105 83.106h398.905c13.73 0 25.292-11.563 25.292-25.293s-11.562-25.293-25.292-25.293H244.257c-17.344 0-31.797-13.73-32.52-31.074l50.586-440.096c9.395-39.023 31.074-41.914 62.871-41.914h59.258v18.066c0 13.73 11.562 25.293 25.293 25.293s25.292-11.562 25.292-25.293v-18.066h168.379v18.066c0 13.73 11.562 25.293 25.293 25.293S654 359.16 654 345.428v-18.066h69.375c20.957 0 45.527 5.781 54.2 49.863l35.41 282.558c1.444 13.007 13.73 23.125 27.46 21.68zM435.037 276.054c0-46.25 37.578-83.828 83.828-83.828s83.828 37.578 83.828 83.828H435.037zM715.427 863.57a27.46 27.46 0 1 0 54.922 0 27.46 27.46 0 1 0-54.922 0zM810.818 846.227a27.46 27.46 0 1 0 54.92 0 27.46 27.46 0 1 0-54.92 0zM819.49 752.282a27.46 27.46 0 1 0 54.92 0 27.46 27.46 0 1 0-54.92 0z" p-id="4447" fill="#4fc8bd"></path></svg>
    <div v-if="state.type == 'login'" class="login-body login">
      <van-form @submit="onSubmit">
        <van-field
          v-model="state.username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="state.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          v-model="state.verify"
        >
          <template #button>
            <vue-img-verify ref="verifyRef" />
          </template>
        </van-field>
        <div style="margin: 16px;">
          <div class="link-register" @click="toggle('register')">立即注册</div>
          <van-button round block color="#1baeae" native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>
    <div v-else class="login-body register">
      <van-form @submit="onSubmit">
        <van-field
          v-model="state.username1"
          name="username1"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="state.password1"
          type="password"
          name="password1"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          v-model="state.verify"
        >
          <template #button>
            <vue-img-verify ref="verifyRef" />   <!-- 引用绑定 -->
          </template>
        </van-field>
        <div style="margin: 16px;">
          <div class="link-login" @click="toggle('login')">已有登录账号</div>
          <van-button round block color="#1baeae" native-type="submit">注册</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>  //使用组合性API  面经：相较于VUE2的生命周期钩子函数；

import { reactive, ref } from 'vue'
import sHeader from '@/components/SimpleHeader.vue' //头
import vueImgVerify from '@/components/VueImageVerify.vue' //验证码   
import { login, register } from '@/service/user'
import { setLocal } from '@/common/js/utils'
import md5 from 'js-md5'
import { showSuccessToast, showFailToast } from 'vant'  //vant组件库
const verifyRef = ref(null)  //ref创建一个引用。
//reactive 只能用于创建对象的响应式代理，不能用于基本数据类型（如 number、string、boolean 等）。
// 如果需要创建基本数据类型的响应式数据，可以使用 ref 函数。
const state = reactive({    //定义数据结构。使用reactive函数定义响应式数据对象   提问：和ref函数的区别
  username: '',
  password: '',
  username1: '',
  password1: '',
  type: 'login',
  imgCode: '',
  verify: ''
})

// 切换登录和注册两种模式
//面经：问题：箭头函数和普通函数有什么区别？
// 语法：箭头函数语法更简洁。
// this 指向：箭头函数没有自己的 this，它的 this 继承自父级作用域；普通函数的 this 指向取决于函数的调用方式。
// arguments 对象：箭头函数没有自己的 arguments 对象；普通函数有。
// 构造函数：箭头函数不能使用 new 关键字调用，不能作为构造函数；普通函数可以。
// ES6里的新特性
const toggle = (v) => {     
  state.type = v
  state.verify = ''
}

// 提交登录或注册表单
//异步函数
//async/await 是 ES2017 引入的用于处理异步操作的语法糖，它基于 Promise 实现
//在函数定义前加上 async 关键字，函数内部可以使用 await 关键字来等待一个 Promise 对象的解决（resolved）。
//async/await 是基于 Promise 实现的。async 函数返回一个 Promise 对象，await 只能在 async 函数内部使用，它会暂停函数的执行，直到所等待的 Promise 被解决，并返回 Promise 的结果。
const onSubmit = async (values) => {
    // 从 verifyRef 引用的组件实例中获取图片验证码，并赋值给 state.imgCode
  state.imgCode = verifyRef.value.state.imgCode || ''
  //改：state.imgCode = verifyRef.value?.state.imgCode || '';
  //逻辑或运算符（||）：用于处理假值情况，它会对表达式进行求值，若左侧表达式为假值，就返回右侧表达式的值。但它不能防止访问 null 或 undefined 属性时抛出的错误，当尝试访问 null 或 undefined 的属性时，代码会报错。
  //可选链操作符（?.）：主要用于安全地访问对象的属性或调用方法。它会先检查对象是否为 null 或 undefined，如果是，就直接返回 undefined，避免了错误的发生。它更侧重于对对象引用可能为空的情况进行保护，而不是单纯处理假值。
  // 比较用户输入的验证码和图片验证码（忽略大小写：面试题相关：可以使用 toLowerCase() 或 toUpperCase() 方法将字符串转换为统一的大小写，然后进行比较。例如：str1.toLowerCase() === str2.toLowerCase()。）
  if (state.verify.toLowerCase() != state.imgCode.toLowerCase()) {
    showFailToast('验证码有误')
    return
  }
   // 根据 state.type 的值判断是登录操作还是注册操作
  if (state.type == 'login') {
     // 执行登录操作，使用 await 等待登录请求完成
    const { data } = await login({
      "loginName": values.username,
      "passwordMd5": md5(values.password)
    })
    // 将登录成功返回的 token 存储到本地  setLocal:本地存储 ；localStorage(长期有效，除非手动删除)和sessionStorage（会话结束时删除，关闭浏览器窗口或标签）
    setLocal('token', data)
    // 需要刷新页面，否则 axios.js 文件里的 token 不会被重置
    window.location.href = '/'
  } else {
    await register({
      "loginName": values.username1,
      "password": values.password1
    })
    showSuccessToast('注册成功')
    state.type = 'login'
    state.verify = ''
  }
}
</script>

<style lang="less">
  .login {
    .logo {
      width: 120px;
      height: 120px;
      display: block;
      margin: 80px auto 20px;
    }
    .login-body {
      padding: 0 20px;
    }
    .login {
      .link-register {
        font-size: 14px;
        margin-bottom: 20px;
        color: #1989fa;
        display: inline-block;
      }
    }
    .register {
      .link-login {
        font-size: 14px;
        margin-bottom: 20px;
        color: #1989fa;
        display: inline-block;
      }
    }
    .verify-bar-area {
      margin-top: 24px;
      .verify-left-bar {
        border-color: #1baeae;
      }
      .verify-move-block {
        background-color: #1baeae;
        color: #fff;
      }
    }
    .verify {
      >div {
        width: 100%;
      }
      display: flex;
      justify-content: center;
      .cerify-code-panel {
        margin-top: 16px;
      }
      .verify-code {
        width: 40%!important;
        float: left!important;
      }
      .verify-code-area {
        float: left!important;
        width: 54%!important;
        margin-left: 14px!important;
        .varify-input-code {
          width: 90px;
          height: 38px!important;
          border: 1px solid #e9e9e9;
          padding-left: 10px;
          font-size: 16px;
        }
        .verify-change-area {
          line-height: 44px;
        }
      }
    }
  }
</style>
