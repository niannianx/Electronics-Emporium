

<template>
  <div class="address-edit-box">
    <s-header :name="`${state.type == 'add' ? '新增地址' : '编辑地址'}`"></s-header>
    <van-address-edit
      class="edit"
      :area-list="state.areaList"
      :address-info="state.addressInfo"
      :show-delete="state.type == 'edit'"
      show-set-default
      show-search-result
      :search-result="state.searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted,toRefs } from 'vue'
import { showToast } from 'vant'
import sHeader from '@/components/SimpleHeader.vue'
import { addAddress, EditAddress, DeleteAddress, getAddressDetail } from '@/service/address'
import { tdist } from '@/common/js/utils'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const state = reactive({
  areaList: {     //地址列表
    province_list: {},   
    city_list: {},
    county_list: {}
  },
  searchResult: [],
  type: 'add',
  addressId: '',
  addressInfo: {},
  from: route.query.from  //from？？
})

onMounted(async () => {
  // 省市区列表构造
  let _province_list = {}
  let _city_list = {}
  let _county_list = {}
  // //获取省市区数据
  //tdist 是一个工具函数，用来获取省市区的层级数据
  //// 获取所有省级数据
  tdist.getLev1().forEach(p => {
    _province_list[p.id] = p.text   //省级ID作为键，省名作为值
    //获取所有市级数据
    tdist.getLev2(p.id).forEach(c => {
      _city_list[c.id] = c.text   //// 城市ID作为键，城市名作为值
      // 获取城市下面的区县数据
      tdist.getLev3(c.id).forEach(q => _county_list[q.id] = q.text)    // 区县ID作为键，区县名作为值
    })
  })

  // 将结果保存到 state 中
  //
  state.areaList.province_list = _province_list
  state.areaList.city_list = _city_list
  state.areaList.county_list = _county_list

  //const areaList = { province_list: _province_list, city_list: _city_list, county_list: _county_list }
  //state.areaList = getAreaData()//无法进入编辑地址，或许是因为得到的数据为空
  const { addressId, type, from } = route.query
  state.addressId = addressId
  state.type = type
  state.from = from || ''
  if (type == 'edit') {
    //如果是编辑，获取当前地址的详细信息
    const { data: addressDetail } = await getAddressDetail(addressId)
    console.log('获取到的地址详情:', addressDetail);
    let _areaCode = ''
    // 匹配地址的省市区
    const province = tdist.getLev1()
    Object.entries(state.areaList.county_list).forEach(([id, text]) => {
      // 先找出当前对应的区
      if (text == addressDetail.regionName) {
        // 找到区对应的几个省份
        const provinceIndex = province.findIndex(item => item.id.substr(0, 2) == id.substr(0, 2))
        // 找到区对应的几个市区
        // eslint-disable-next-line no-unused-vars
        const cityItem = Object.entries(state.areaList.city_list).filter(([cityId, cityName]) => cityId.substr(0, 4) == id.substr(0, 4))[0]
        // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
        if (province[provinceIndex].text == addressDetail.provinceName && cityItem[1] == addressDetail.cityName) {
          _areaCode = id
        }
      }
    })
    //// 设置编辑时地址信息
    state.addressInfo = {
      id: addressDetail.addressId,
      name: addressDetail.userName,
      tel: addressDetail.userPhone,
      province: addressDetail.provinceName,
      city: addressDetail.cityName,
      county: addressDetail.regionName,
      addressDetail: addressDetail.detailAddress,
      areaCode: _areaCode,
      isDefault: !!addressDetail.defaultFlag
    }
  }
})
// 保存地址
const onSave = async (content) => {
  const params = {
    userName: content.name,
    userPhone: content.tel,
    provinceName: content.province,
    cityName: content.city,
    regionName: content.county,
    detailAddress: content.addressDetail,
    defaultFlag: content.isDefault ? 1 : 0,
  }
  if (state.type == 'edit') {
    params['addressId'] = state.addressId
  }
  await state.type == 'add' ? addAddress(params) : EditAddress(params)
  showToast('保存成功')
  setTimeout(() => {
    router.back()
  }, 1000)
}
//删除地址
const onDelete = async () => {
  await DeleteAddress(state.addressId)
  showToast('删除成功')
  setTimeout(() => {
    router.back()
  }, 1000)
}
</script>

<style lang="less">
  @import '../common/style/mixin';
  .edit {
    .van-field__body {
      textarea {
        height: 26px!important;
      }
    }
  }
  .address-edit-box {
    .van-address-edit {
      .van-button--danger {
        background: @primary;
        border-color: @primary;
      }
      .van-switch--on {
        background: @primary;
      }
    }
  }

</style>
