/*
 * @Author: your name
 * @Date: 2021-07-26 20:07:12
 * @LastEditTime: 2021-07-26 20:07:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /cloud-media-web/src/axios/api/login.js
 */
/*
 * @Author: your name
 * @Date: 2021-07-26 14:29:16
 * @LastEditTime: 2021-07-26 18:41:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /cloud-media-web/src/axios/api/login/index.js
 */
import { get, post } from '@/axios/http'

export function login(data) {
  return post('', data)
}
export function userInfo(data) {
  return get('https://api-cloud.tmsx.net/api/user/user-info', data)
}
