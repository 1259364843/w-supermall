import request from './network.js'

export function getMultiData() {
  return request({
    url: '/home/multidata'
  })
} 
/**
 * 
 * @param {*} type 类型
 * @param {*} page 页码
 */
export function getProduct(type, page) {
  return request({
    url: '/home/data',
    data: {
      type,
      page
    }
  })
}