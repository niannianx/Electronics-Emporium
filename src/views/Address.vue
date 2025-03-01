
<template>
  <div class="address-box">
    <s-header :name="'地址管理'" :back="state.from == 'create-order' ? '' : '/user'"></s-header>
    <div class="address-item">
      <!-- 根据 state.from 决定是否显示选择按钮 -->
       <!-- Vant UI 提供的地址列表组件 -->
      <van-address-list
        v-if="state.from != 'mine'"    
        v-model="state.chosenAddressId"
        :list="state.list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="select"
      />
      <van-address-list
        v-else
        v-model="state.chosenAddressId"
        :list="state.list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import sHeader from '@/components/SimpleHeader.vue'
import { getAddressList } from '@/service/address'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const state = reactive({
  chosenAddressId: '1',   //初始化的地址ID
  list: [],     //地址列表
  from: route?.query?.from ?? ''    //// 获取路由中的 from 参数，用于控制返回路径等
})
// 组件加载时执行初始化函数
onMounted(() => {
  init()
})
// 初始化函数：获取地址列表
const init = async () => {
  const { data } = await getAddressList()
  if (!data) {
    state.list = []   //如果没有数据，返回空数组
    return
  }
  // 处理 API 返回的数据，将其映射成符合 UI 组件需要的格式
  state.list = data.map(item => {
    return {
      id: item.addressId,
      name: item.userName,
      tel: item.userPhone,
      address: `${item.provinceName} ${item.cityName} ${item.regionName} ${item.detailAddress}`,
      isDefault: !!item.defaultFlag
    }
  })
}

// 前往添加地址页面
const onAdd = () => {
  router.push({ path: 'address-edit', query: { type: 'add', from: state.from  } })
}
// 前往地址编辑页面，传递地址ID
const onEdit = (item) => {
  router.push({ path: 'address-edit', query: { type: 'edit', addressId: item.id, from: state.from  } })
}
// 选择某个地址后，传递地址ID，跳回订单生成页面
const select = (item, index) => {
  router.push({ path: 'create-order', query: { addressId: item.id, from: state.from  } })
}
</script>

<style lang="less">
  @import '../common/style/mixin';
  .address-box {
    .van-radio__icon {
      display: none;
    }
    .address-item {
      .van-button {
        background: @primary;
        border-color: @primary;
      }
    }
  }
</style>
