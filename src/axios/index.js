import axios from 'axios'
import vue from 'vue'
const CancelToken = axios.CancelToken // 取消请求

axios.defaults.baseURL = process.env.VUE_APP_BASE_API

axios.defaults.timeout = 60000 // 超时设置
// 测试
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGktY2xvdWQudG1zeC5uZXRcL2FwaVwvdXNlclwvbG9naW4iLCJpYXQiOjE2MjcyODE3MDAsImV4cCI6MTYyNzg4NjUwMCwibmJmIjoxNjI3MjgxNzAwLCJqdGkiOiJaOFJXeUdJTWxsRUpJSDBFIiwic3ViIjoxMiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyIsInR5cGUiOiJhcGkifQ.zzGbIGlDvVmOZzEDuLw3kFC87qlNIwh1qFPOBy-mTWs'

axios.interceptors.request.use(
  config => {
    // 设置默认请求头
    // const userInfo = JSON.parse(localStorage.getItem('user_info'))
    // if (userInfo) {
    //   config.headers.Authorization = 'Bearer ' + userInfo.access_token
    // }
    // 测试
    config.headers.Authorization = 'Bearer ' + token

    // config.headers['X-Requested-With'] = 'XMLHttpRequest'
    // 指定允许其他域名访问
    // config.header('Access-Control-Allow-Origin:*')
    // // 响应类型
    // config.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    // config.header('Access-Control-Request-Method', '')

    // // 响应头设置
    // config.header('Access-Control-Allow-Headers:x-requested-with,content-type')

    let cancelGroupName
    if (config.method === 'post') {
      if (config.data && config.data.cancelGroupName) {
        // post请求ajax取消函数配置
        cancelGroupName = config.data.cancelGroupName
      }
      // config.data = qs.stringify(config.data)
    } else {
      if (config.params && config.params.cancelGroupName) {
        // get请求ajax取消函数配置
        cancelGroupName = config.params.cancelGroupName
      }
    }
    if (cancelGroupName) {
      if (axios[cancelGroupName] && axios[cancelGroupName].cancel) {
        axios[cancelGroupName].cancel()
      }
      config.cancelToken = new CancelToken(c => {
        axios[cancelGroupName] = {}
        axios[cancelGroupName].cancel = c
      })
    }
    return config
  },
  error => {
    console.log('error', error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  config => {
    return Promise.resolve(config)
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          error.message = '登录信息已过期，请重新登录!'
          break
        case 422:
          // 传参不对
          error.message = getErrorMsg(error.response.data.message)
          break
        case 404:
          error.message = '哎呀~没有找到该地址'
          break
        case 500:
          error.message = '槽糕~服务器竟然出错了，请稍后重试'
          break
        case 501:
          error.message = '网络未实现'
          break
        case 502:
          error.message = '网络错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网络超时'
          break
        case 505:
          error.message = 'http版本不支持该请求'
          break
        default:
          error.message = `连接错误${error.response.status}`
      }
    } else {
      error.message = '连接到服务器失败'
    }
    if (error.message) {
      vue.$message({
        message: error.message,
        type: 'error'
      })
    }
    return Promise.reject(error)
  }
)

function getErrorMsg(msg) {
  const strArr = JSON.parse(msg)
  let str = ''

  if (strArr[0]) {
    str = strArr[0].error[0]
  }
  return str
}

export default axios
