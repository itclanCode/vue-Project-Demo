// 时间格式化
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/**
 * 获取本季度、上季度的起止日期
 */
let now = new Date();
let nowMonth = now.getMonth(); // 当前月
let nowYear = now.getFullYear(); // 当前年
nowYear += (nowYear < 2000) ? 1900 : 0;
// 获得本季度的开始月份
function getQuarterStartMonth() {
  let quarterStartMonth = 0;
  if (nowMonth < 3) {
    quarterStartMonth = 0;
  } else if (nowMonth > 2 && nowMonth < 6) {
    quarterStartMonth = 3;
  } else if (nowMonth > 5 && nowMonth < 9) {
    quarterStartMonth = 6;
  } else if (nowMonth > 8) {
    quarterStartMonth = 9;
  }
  return quarterStartMonth;
}
// 获得某月的天数
function getMonthDays(myMonth) {
  let monthStartDate = new Date(nowYear, myMonth, 1);
  let monthEndDate = new Date(nowYear, myMonth + 1, 1);
  let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}
// 由当前日期获取本季度、上季度起止日期
export function getQuarterDate () {
  let dayMSec = 24 * 3600 * 1000;
  // 得到上季度第一天
  let lastQuarterFirstDay = formatDate(new Date(nowYear, getQuarterStartMonth() - 3, 1), 'yyyy-MM-dd');
  // 得到本季度第一天
  let quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
  // 得到本季度最后一天
  let quarterEndMonth = getQuarterStartMonth() + 2;
  let quarterEndDate = formatDate(new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth)), 'yyyy-MM-dd');
  // 得到上季度最后一天的毫秒数
  let lastQuarterLastDayMSec = quarterStartDate.getTime() - 1 * dayMSec;
  // 得到上季度最后一天
  let lastQuarterLastDay = formatDate(new Date(lastQuarterLastDayMSec), 'yyyy-MM-dd');
  return {thisQuarter: [quarterStartDate, quarterEndDate], lastQuarter: [lastQuarterFirstDay, lastQuarterLastDay]};
}

// 由传入的日期获取当月的起止日期
export function getMonthDate (time) {
  let year = time.getFullYear(); // 获取当年年份
  let month = time.getMonth(); // 获取当月月份
  // 获取当月开始日期
  let monthStartDate = new Date(year, month, 1).getTime();
  // 获取当月结束日期
  let monthEndDate = new Date(year, month, getMonthDays(month)).getTime();
  return [monthStartDate, monthEndDate];
}

// 2018年至当前年的数组
export function getYearArr () {
  let num = nowYear - 2018;
  let yearArr = [];
  for (let i = 0; i <= num; i++) {
    yearArr.push(2018 + i);
  }
  return yearArr;
}
