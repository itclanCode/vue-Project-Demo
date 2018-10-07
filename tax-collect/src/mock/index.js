import Mock from 'mockjs';
import getRegister from './register/index'
import getPassword from './password/index'

Mock.mock(/\/get\/i18n_type/, () => {
  return {
    error: 'SUCCESS',
    data: {
      type: 'zh'
    },
    msg: 'ok'
  }
});
getRegister.init();
getPassword.init();
