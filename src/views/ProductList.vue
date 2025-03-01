<!-- 商品列表页面（搜索，商品展示，分页加载，下拉刷新，按不同条件排序） -->

<template>
  <div class="product-list-wrap">
    <div class="product-list-content">
      <header class="category-header wrap">
        <i class="nbicon nbfanhui" @click="goBack"></i>
        <div class="header-search">
          <i class="nbicon nbSearch"></i>
          <input
            type="text"
            class="search-title"
            v-model="state.keyword"/>
        </div>
        <span class="search-btn" @click="getSearch">搜索</span>
      </header>
      <van-tabs type="card" color="#1baeae" @click-tab="changeTab" >
        <van-tab title="推荐" name=""></van-tab>
        <van-tab title="新品" name="new"></van-tab>
        <van-tab title="价格" name="price"></van-tab>
      </van-tabs>
    </div>
    <div class="content">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh" class="product-list-refresh">
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          :finished-text="state.productList.length ? '没有更多了' : '搜索想要的商品'"
          @load="onLoad"
          @offset="10"
        >
          <!-- <p v-for="item in list" :key="item">{{ item }}</p> -->
          <template v-if="state.productList.length">
            <div class="product-item" v-for="(item, index) in state.productList" :key="index" @click="productDetail(item)">
              <img :src="$filters.prefix(item.goodsCoverImg)" />
              <div class="product-info">
                <p class="name">{{item.goodsName}}</p>
                <p class="subtitle">{{item.goodsIntro}}</p>
                <span class="price">￥ {{item.sellingPrice}}</span>
              </div>
            </div>
          </template>
          <img class="empty" v-else src="https://s.yezgea02.com/1604041313083/kesrtd.png" alt="搜索">
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { search } from '@/service/good'
//路由参数获取  该函数获取当前路由对象
const route = useRoute()
const router = useRouter()
const state = reactive({
  keyword: route.query.keyword || '',
  searchBtn: false,
  seclectActive: false,
  refreshing: false,
  list: [],
  loading: false,
  finished: false,
  productList: [],
  totalPage: 0,
  page: 1,
  orderBy: ''
})
const init = async () => {
  const { categoryId } = route.query
  //  如果既没有分类 ID 也没有搜索关键词，则认为没有数据可加载
  if (!categoryId && !state.keyword) {
    state.finished = true
    state.loading = false;
    return
  }
  // 调用 search 函数发送搜索请求，传递页码、分类 ID、搜索关键词和排序规则
  const { data, data: { list } } = await search({ pageNumber: state.page, goodsCategoryId: categoryId, keyword: state.keyword, orderBy: state.orderBy })
  // 将新获取的商品列表追加到已有的商品列表中
  state.productList = state.productList.concat(list)
  // 更新总页数
  state.totalPage = data.totalPage
  // 加载完成，将加载状态设为 false
  state.loading = false;
  // 如果当前页码大于等于总页数，说明没有更多数据了，将 finished 设为 true
  if (state.page >= data.totalPage) state.finished = true
}
// 返回上一页的函数
const goBack = () => {
  router.go(-1)
}

// 跳转到商品详情页的函数
const productDetail = (item) => {
  router.push({ path: `/product/${item.goodsId}` })
}
// 触发搜索的函数
const getSearch = () => {
  onRefresh()
}
// 加载更多数据的函数，通常用于上拉加载
const onLoad = () => {
  if (!state.refreshing && state.page < state.totalPage) {
    state.page = state.page + 1
  }
  if (state.refreshing) {
    state.productList = [];
    state.refreshing = false;
  }
  init()
}
// 下拉刷新的函数
const onRefresh = () => {
  state.refreshing = true
  state.finished = false
  state.loading = true
  state.page = 1
  onLoad()
}
// 切换标签页的函数，用于改变排序规则
const changeTab = ({ name }) => {
  console.log('name', name)
  // 更新排序规则
  state.orderBy = name
  onRefresh()
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .product-list-content {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
    background: #fff;
    .category-header {
      .fj();
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding: 0 15px;
      .boxSizing();
      font-size: 15px;
      color: #656771;
      z-index: 10000;
      &.active {
        background: @primary;
      }
      .icon-left {
        font-size: 25px;
        font-weight: bold;
      }
      .header-search {
        display: flex;
        width: 76%;
        line-height: 20px;
        margin: 10px 0;
        padding: 5px 0;
        color: #232326;
        background: #F7F7F7;
        .borderRadius(20px);
        .nbSearch {
          padding: 0 5px 0 20px;
          font-size: 17px;
        }
        .search-title {
          font-size: 12px;
          color: #666;
          background: #F7F7F7;
        }
    }
    .icon-More {
      font-size: 20px;
    }
    .search-btn {
      height: 28px;
      margin: 8px 0;
      line-height: 28px;
      padding: 0 5px;
      color: #fff;
      background: @primary;
      .borderRadius(5px);
      margin-top: 10px;
    }
  }
}
  .content {
    height: calc(~"(100vh - 70px)");
    overflow: hidden;
    overflow-y: scroll; 
    margin-top: 78px;
  }
  .product-list-refresh {
    .product-item {
      .fj();
      width: 100%;
      height: 120px;
      padding: 10px 0;
      border-bottom: 1px solid #dcdcdc;
      img {
        width: 140px;
        height: 120px;
        padding: 0 10px;
        .boxSizing();
      }
      .product-info {
          width: 56%;
          height: 120px;
          padding: 5px;
          text-align: left;
          .boxSizing();
          p {
            margin: 0
          }
          .name {
            width: 100%;
            max-height: 40px;
            line-height: 20px;
            font-size: 15px;
            color: #333;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .subtitle {
            width: 100%;
            max-height: 20px;
            padding: 10px 0;
            line-height: 25px;
            font-size: 13px;
            color: #999;
            overflow: hidden;
          }
          .price {
            color: @primary;
            font-size: 16px;
          }
      }
  }
  .empty {
    display: block;
    width: 150px;
    margin: 50px auto 20px;
  }
}
</style>
