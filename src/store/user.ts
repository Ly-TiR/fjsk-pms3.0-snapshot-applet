import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface IUserInfo {
  id: number
  username: string
  avatar: string
  token: string
  realName?: string
  orgName?: string
  roleCode?: string
  roleName?: string
}

const defaultUserInfo: IUserInfo = {
  id: 0,
  username: '',
  avatar: '',
  token: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>({ ...defaultUserInfo })
    const isLoggedIn = computed(() => !!userInfo.value.token)

    const setUserInfo = (val: Partial<IUserInfo>) => {
      userInfo.value = { ...userInfo.value, ...val }
    }

    const setToken = (token: string) => {
      userInfo.value.token = token
      uni.setStorageSync('token', token)
    }

    const removeUserInfo = () => {
      userInfo.value = { ...defaultUserInfo }
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    }

    const login = async (credentials: { username: string; password: string }) => {
      // 本地 mock 登录：模拟成功
      const mockToken = 'mock-token-' + Date.now()
      setUserInfo({
        username: credentials.username,
        token: mockToken,
        realName: credentials.username === 'grid001' ? '网格员陈洁' : credentials.username,
        orgName: '江汉路街道',
        roleName: '随手拍处理',
      })
      return { code: 200, msg: '登录成功', data: { token: mockToken } }
    }

    const logout = async () => {
      removeUserInfo()
    }

    const getUserInfo = async () => {
      return { code: 200, data: userInfo.value }
    }

    return {
      userInfo,
      isLoggedIn,
      setUserInfo,
      setToken,
      removeUserInfo,
      login,
      logout,
      getUserInfo,
    }
  },
  {
    persist: {
      storage: {
        getItem: uni.getStorageSync,
        setItem: uni.setStorageSync,
      },
    },
  },
)
