/***
 * 用于提供测试数据

 */

export interface UserInfoType {
  appId: string
  roleId: string
  userId: string
  serverId: string
}

const 测试登陆信息1: UserInfoType = {
  appId: '11111',
  roleId: '22222',
  userId: '33333',
  serverId: '44444',
}
const 测试登陆信息2: UserInfoType = {
  appId: '55555',
  roleId: '666',
  userId: '7777',
  serverId: '8',
}

export const testUserInfo = [
  { value: 测试登陆信息1, label: '测试登陆信息1' },
  { value: 测试登陆信息2, label: '测试登陆信息2' },

]

// export const userInfo = r<UserInfoType>(_userInfo)
