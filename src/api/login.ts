import type { IUserLogin, IUserInfoVo } from './login.typings'
import { httpGet, httpPost } from '@/utils/http'

/** 账号密码登录 */
export function login(data: { username: string; password: string }) {
  return httpPost<IUserLogin>('/user/login', data)
}

/** 获取用户信息 */
export function getUserInfo() {
  return httpGet<IUserInfoVo>('/user/info')
}

/** 退出登录 */
export function logout() {
  return httpGet('/user/logout')
}
