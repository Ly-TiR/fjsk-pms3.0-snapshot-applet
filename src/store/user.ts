import { defineStore } from 'pinia'
import { ref } from 'vue'

interface IUserState {
  id: number
  username: string
  avatar: string
  token: string
}

const defaultUserState: IUserState = {
  id: 0,
  username: '',
  avatar: '/static/images/default-avatar.png',
  token: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserState>({ ...defaultUserState })

    const setUserInfo = (val: Partial<IUserState>) => {
      userInfo.value = { ...userInfo.value, ...val }
    }

    const removeUserInfo = () => {
      userInfo.value = { ...defaultUserState }
      uni.removeStorageSync('token')
    }

    const setToken = (token: string) => {
      userInfo.value.token = token
      uni.setStorageSync('token', token)
    }

    const isLogined = computed(() => !!userInfo.value.token)

    return {
      userInfo,
      setUserInfo,
      removeUserInfo,
      setToken,
      isLogined,
    }
  },
)
