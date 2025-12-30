interface UserInfo {
  avatar: string
  email: string
  id: string
  name: string
  phone: string
  nickname: string
  username: string
  gender: number
  identity: UserLevel
}

interface UserOpts {
  iconName: string
  optName: string
  link: string
  rightText?: string
}
