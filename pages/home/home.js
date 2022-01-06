// pages/home/home.js
import {
  getMultiData,
  getProduct
} from '../../service/home'

// 导入常量

import {
  POP,
  SELL,
  NEW,
  BACK_TOP_POSITION
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
    // 顶部位置坐标
    topPosition: 0,
    tabControlTop: 0,
    // 是否显示返回顶部按钮
    showBackTop: false,
    // 是否显示切换控制栏
    showTabControl: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.请求网络数据
    this._getData()
  },
  // 加载更多商品数据
  loadMore() {
    this._getProductData(this.data.currentType);
  },
  scrollPosition(e) {
    // console.log('开始滚动');
    // 1.获取滚动的顶部
    const position = e.detail.scrollTop;

    // 2.设置是否显示
    this.setData({
      showBackTop: position > BACK_TOP_POSITION,
    })

    wx.createSelectorQuery().select('.tab-control').boundingClientRect((rect) => {
      // 判断高度
      const show = rect.top > 0
      this.setData({
        showTabControl: !show
      })
    }).exec()
  },
  // 返回顶部按钮点击处理事件
  onBackTop() {
    console.log("返回顶部");
    this.setData({
      // 隐藏按钮
      showBackTop: false,
      topPosition: 0,
      tabControlTop: 0
    })
  },
  // 当图片加载完成
  onImageLoad() {
    console.log("图片加载完成");
    wx.createSelectorQuery().select('.tab-control').boundingClientRect((rect) => {
      this.setData({
        tabControlTop: rect.top
      })
    }).exec()
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
  },

  // 
  onReachBottom() {
    // 上拉加载更多
    this._getProductData(this.data.currentType)
  }
})