/**
 * Cretated by qintengbo on 2018/07/23.
 * 公用方法
 */

export default {
  // 深拷贝方法
  deepCopy: function(obj) {
    // 定义一个对象,用来确定当前的参数是数组还是对象
    let objArr = obj.constructor === Array ? [] : {};
    // 如果obj存在,且类型为对象
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          // 如果obj的子元素是对象,递归操作
          if (obj[key] && typeof obj[key] === 'object') {
            objArr[key] = this.deepCopy(obj[key]);
          } else {
            // 如果不是,直接赋值
            objArr[key] = obj[key];
          }
        }
      }
    }
    return objArr;
  },
  // 输入框设置金额输入格式-获取焦点
  yeFocus: function(event, index, data, prop, precapital) {
    let val = event.srcElement.value;
    if (val === '0.00' || val === '0.0' || val === '0') {
      val = '';
    } else {
      val = val.replace(/\.00/, '').replace(/(\.\d)0/, '$1');
    }
    precapital = val;
    event.srcElement.value = val;
    data[index][prop] = val;
  },
  // 输入框设置金额输入格式-按键
  yeKeyUp: function(event, index, data, prop, precapital) {
    let val = event.srcElement.value;
    val = val.replace(/^[.]/, '').replace(/[^\d.]/g, '');
    if (val.split('.').length - 1 > 1) {
      val = precapital;
    }
    precapital = val;
    event.srcElement.value = val;
    data[index][prop] = val;
  },
  // 输入框设置金额输入格式-失去焦点
  yeBlur: function(event, index, data, prop) {
    let val = event.srcElement.value;
    val = val.replace(/[.]$/, '');
    val = val.replace(/(.*)\.(\d*)(\d*)/g, '$1.$2');
    val = Number(val).toFixed(2);
    event.srcElement.value = val;
    data[index][prop] = val;
  }
}
