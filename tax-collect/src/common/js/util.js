let util = {
  storage (...args) {
    let len = args.length;
    if (len === 1) {
      return localStorage.getItem && JSON.parse(localStorage.getItem(args[0]));
    }
    if (len >= 2) {
      localStorage.setItem(args[0], JSON.stringify(args[1]));
    }
  },
  removeStorge (name) {
    localStorage.removeItem(name)
  },
  // 时间格式化
  formateDate (strTime, type) {
    let date = [];
    let selectType;
    let dataType = {
      type1: 'YY-MM-RR',
      type2: '年-月-日'
    }
    let nowdate = strTime || new Date().getTime();
    date = this.ieToLocalDateArr(nowdate);
    for (let key in dataType) {
      if (dataType[key] === type && key === 'type1') {
        selectType = 0;
      } else if (dataType[key] === type && key === 'type2') {
        selectType = 1;
      }
    }
    date = date.map((item, idx) => {
      if (item * 1 < 10) {
        item = '0' + item;
      }
      switch (idx) {
        case 0:
          if (selectType === 0) {
            item = item + '-'
          } else {
            item = item + '年';
          }
          break;
        case 1:
          if (selectType === 0) {
            item = item + '-';
          } else {
            item = item + '月'
          }
          break;
        case 2:
          if (selectType === 0) {
            item = item + '';
          } else {
            item = item + '日'
          }
          break;
        default: ; break;
      }
      return item;
    })
    return date.join('')
  },
  // 兼容ie的 toLocaleDateString方法
  ieToLocalDateArr (str) {
    let ntoDate = new Date(str * 1).toLocaleDateString();
    let retArr = [];
    if (ntoDate.includes('年')) {
      ntoDate = ntoDate.replace('年', '/').replace('月', '/').replace('日', '/');
      ntoDate = ntoDate.substring(0, ntoDate.length - 1);
    }
    retArr = ntoDate.split('/');
    return retArr
  },
  // 链式push
  mcPush() {
    function Chain () {
      this.retArr = [];
      this.push = function (parms) {
        this.retArr.push(parms);
        return this
      }
      return this
    }
    let chainObj = new Chain();
    return chainObj
  }
}
export default util
