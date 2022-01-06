// pages/home/home.js
import {
  getMultiData,
  getProduct
} from '../../service/home'

// 导入常量

import {
  POP,
  SELL,
  NEW
} from '../../common/const.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图
    banners: [],
    // 推荐
    recommends: [],
    // tab-control标题数据
    titles: ["流行", "新款", "精选"],
    // 商品数据
    goods: {
      [POP]: { page: 1, list: [] },
      [NEW]: { page: 1, list: [] },
      [SELL]: { page: 1, list: [] },
    },
    // 当前选中的商品类型
    currentType: 'pop',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.请求网络数据
    this._getData()
    console.log(this.data.goods);
  },
  // 封装所有网络请求的逻辑
  _getData() {
    this._getMultiData();
    this._getProductData(POP);
    this._getProductData(NEW);
    this._getProductData(SELL);
  },
  _getMultiData() {
    getMultiData().then(res => {
      // 1.取出轮播所有的数据
      const banners = res.data.banner.list.map(item => {
        return item.image
      })
      // 2.设置数据
      this.setData({
        banners: banners,
        recommends: res.data.recommend.list
      })
    })
  },
  _getProductData(type) {
    // 1.获取数据对应的页码
    const page = this.data.goods[type].page;

    // 2.请求数据
    getProduct(type, page).then(res => {
      // 1.取出数据
      const list = res.data.list;

      // 2.将数据临时获取
      const goods = this.data.goods;
      // 追加数据
      goods[type].list.push(...list)
      goods[type].page += 1;

      // 3.最新的goods设置到goods中
      this.setData({
        goods: goods
      })
    })
  },

  // 事件监听函数
  // tab-control点击切换
  tabClick(event) {
    // 设置currentType
    let currentType = '';
    switch(event.detail.index) {
      case 0:
        currentType = POP
        break
      case 1:
        currentType = NEW
        break
      case 2:
        currentType = SELL
        break
    }
    // 设置数据
    this.setData({
      currentType: currentType
    })
  }
})