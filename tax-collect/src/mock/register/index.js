import Mock from 'mockjs';

function init() {
  Mock.mock(/\/get\/register/, () => {
    return {
      success: 'SUCCESS',
      data: [
        {
          name: 'aaaaa',
          phone: 13678975945,
          legalPhone: 13412341234,
          ird: 'ABCDEFGHJKABCDE'
        },
        {
          name: 'bbbbb',
          phone: 13783273723,
          legalPhone: 13579780990,
          ird: 'FHDSKLFJDSLFJDS'
        },
        {
          name: 'ccccc',
          phone: 13575655655,
          legalPhone: 13748937489,
          ird: 'DSADSADADSADADF'
        },
        {
          name: 'ddddd',
          phone: 13447281765,
          legalPhone: 13898988098,
          ird: 'KGFDGKFDKGFOGFK'
        }
      ]
    }
  });
}
export default {
  init
}
