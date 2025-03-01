<!-- vant轮播图组件 -->

<template>
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#1baeae">
    <van-swipe-item v-for="(item, index) in list" :key="index">
      <img :src="item.carouselUrl" alt="">
    </van-swipe-item>
  </van-swipe>
</template>


<!-- 选项式 -->
<script>
export default {
  //// 定义组件接收的 props
  props: {
    list: Array
  },
  /// 定义组件的方法
  // methods: {
  //   goTo(url) {
  //     // 打开一个新窗口，访问传入的 url
  //     window.open(url)
  //   }
  // }
}
</script>

<!-- 组合式API -->
<!-- <script setup>
// 通过 defineProps，获取父组件传入的参数
const props = defineProps({
  list: {
    type: Array,
    default: []
  }
})
// 打开链接的方法
const goTo = (url) => {
  window.open(url)
}
</script> -->

<style lang='less' scoped>
  .my-swipe {
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
