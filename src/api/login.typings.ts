export interface IUserLogin {
  token: string
}

export interface IUserInfoVo {
  id: number
  username: string
  avatar: string
  token: string
  realName?: string
  orgName?: string
  roleName?: string
}
