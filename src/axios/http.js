/*
 * @Author: your name
 * @Date: 2021-07-26 12:17:05
 * @LastEditTime: 2021-07-26 18:42:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /cloud-media-web/src/axios/http.js
 */
// import vue from 'vue'
import axios from './index.js'
import QS from 'qs' // 引入qs模块，用来序列化post类型的数据

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      // vue.$message({
      //   message: err.data.msg,
      //   type: 'error'
      // })
      reject(err.data)
    })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} headConf [修改请求头]
 */
export function post(url, params, headConf) {
  return new Promise((resolve, reject) => {
    if (headConf !== undefined) { // 文件上传获取url
      console.log('上传文件')
      axios.post(url, params, headConf)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          // vue.$message({
          //   message: err.data.msg,
          //   type: 'error'
          // })
          reject(err.data)
        })
    } else {
      axios.post(url, QS.stringify(params))
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          // vue.$message({
          //   message: err.data.msg,
          //   type: 'error'
          // })
          reject(err.data)
        })
    }
  })
}
