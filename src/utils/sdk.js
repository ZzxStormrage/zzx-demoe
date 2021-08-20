/*
 * @Author: your name
 * @Date: 2021-07-23 17:34:13
 * @LastEditTime: 2021-07-26 15:29:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vite-project/src/util/baiduSDK.js
 */

import async from 'async'
const PART_SIZE = 5 * 1024 * 1024 // 指定分块大小
const baidubce = window.baidubce
class BaiduSDK {
  constructor() {
    this.bucket = null
    this.key = ''
    this.PART_SIZE = PART_SIZE
    this.initClient()
  }

  // 初始化client
  initClient() {
    var bosConfig = {
      credentials: {
        ak: '{accessKeyId}', // STS服务器下发的临时ak
        sk: '{secretAccessKey}' // STS服务器下发的临时sk
      },
      sessionToken: '{sessionToken}', // STS服务器下发的sessionToken
      endpoint: 'http://bj.bcebos.com'
    }
    this.client = new baidubce.sdk.BosClient(bosConfig)
  }

  //   分块
  getTasks(file, uploadId, bucketName, key) {
    let leftSize = file.size
    let offset = 0
    let partNumber = 1
    const tasks = []
    while (leftSize > 0) {
      const partSize = Math.min(leftSize, PART_SIZE)
      tasks.push({
        file: file,
        uploadId: uploadId,
        bucketName: bucketName,
        key: key,
        partNumber: partNumber,
        partSize: partSize,
        start: offset,
        stop: offset + partSize - 1
      })

      leftSize -= partSize
      offset += partSize
      partNumber += 1
    }
    return tasks
  }

  // 分块上传
  uploadPartFile(state, client) {
    return function(task, callback) {
      const blob = task.file.slice(task.start, task.stop + 1)
      client
        .uploadPartFromBlob(
          task.bucketName,
          task.key,
          task.uploadId,
          task.partNumber,
          task.partSize,
          blob
        )
        .then(function(res) {
          ++state.loaded
          callback(null, res)
        })
        .catch(function(err) {
          callback(err)
        })
    }
  }

  // 开始上传
  startUpload(blob, cb) {
    let uploadId
    this.client
      .initiateMultipartUpload(this.bucket, this.key, this.options)
      .then(function(response) {
        uploadId = response.body.uploadId // 开始上传，获取服务器生成的uploadId
        const deferred = baidubce.sdk.Q.defer()
        const tasks = this.getTasks(blob, uploadId, this.bucket, this.key)
        const state = {
          lengthComputable: true,
          loaded: 0,
          total: tasks.length
        }

        // 为了管理分块上传，使用了async（https://github.com/caolan/async）库来进行异步处理
        const THREADS = 2 // 同时上传的分块数量
        async.mapLimit(
          tasks,
          THREADS,
          this.uploadPartFile(state, this.client),
          function(err, results) {
            if (err) {
              deferred.reject(err)
            } else {
              deferred.resolve(results)
            }
          }
        )
        return deferred.promise
      })
      .then(function(allResponse) {
        const partList = []
        allResponse.forEach(function(response, index) {
          // 生成分块清单
          partList.push({
            partNumber: index + 1,
            eTag: response.http_headers.etag
          })
        })
        return this.client.completeMultipartUpload(this.bucket, this.key, uploadId, partList) // 完成上传
      })
      .then(function(res) {
        // 上传完成
        cb(res)
      })
      .catch(function(err) {
        // 上传失败，添加您的代码
        console.error(err)
      })
  }

  //  获取进度
  getProgress() {
    return this.client.on('progress', function(evt) {
      // 监听上传进度
      if (evt.lengthComputable) {
        var percentage = (evt.loaded / evt.total) * 100
        return percentage
      }
    })
  }
}

export default BaiduSDK
