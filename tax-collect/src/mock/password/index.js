import Mock from 'mockjs';

function init() {
  Mock.mock(/\/get\/pwd/, () => {
    return {
      ide: '已验证手机',
      // 随机生成中文名称
      username: Mock.Random.cname(),
      // 随机生成带星号手机号码
      pho: '157******7160'
    }
  });
  Mock.mock(/\/get\/phocode/, () => {
    return {
      // 六位数字
      code: '123456'
    }
  });
}
export default {
  init
}
