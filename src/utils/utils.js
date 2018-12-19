import moment from 'moment';
import numeral from 'numeral';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

/**
 * 日期转字符串
 * @param date
 * @param formatStr
 * @returns {*}
 * @constructor
 */
export function DateFormat(date, formatStr) {
  /*
  函数：填充0字符
  参数：value-需要填充的字符串, length-总长度
  返回：填充后的字符串
  */

  const zeroize = function(value, length) {
    let doLength = length;
    if (!doLength) {
      doLength = 2;
    }
    const doValue = value.toString();
    let i = 0;
    let zeros = '';
    while (i < (doLength - (doValue.length))) {
      zeros += '0';
      i+=1;
    }
    return zeros + doValue;
  };

  return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, ($0) => {
    switch ($0) {
      case 'd':
        return date.getDate();
      case 'dd':
        return zeroize(date.getDate());
      case 'ddd':
        return [
          'Sun',
          'Mon',
          'Tue',
          'Wed',
          'Thr',
          'Fri',
          'Sat',
        ][date.getDay()];
      case 'dddd':
        return [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ][date.getDay()];
      case 'M':
        return date.getMonth() + 1;
      case 'MM':
        return zeroize(date.getMonth() + 1);
      case 'MMM':
        return [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ][date.getMonth()];
      case 'MMMM':
        return [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ][date.getMonth()];
      case 'yy':
        return date.getFullYear().toString().substr(2);
      case 'yyyy':
        return date.getFullYear();
      case 'h':
        return (date.getHours() % 12) || 12;
      case 'hh':
        return zeroize((date.getHours() % 12) || 12);
      case 'H':
        return date.getHours();
      case 'HH':
        return zeroize(date.getHours());
      case 'm':
        return date.getMinutes();
      case 'mm':
        return zeroize(date.getMinutes());
      case 's':
        return date.getSeconds();
      case 'ss':
        return zeroize(date.getSeconds());
      case 'l':
        return date.getMilliseconds();
      case 'll':
        return zeroize(date.getMilliseconds());
      case 'tt':
        if (date.getHours() < 12) { return 'am'; } else { return 'pm'; }
      case 'TT':
        if (date.getHours() < 12) { return 'AM'; } else { return 'PM'; }
      default:
        break;
    }
  });
}

/**
 * 日期加减
 * @param dtTmp 日期对象
 * @param strInterval 单位
 * @param Number 数量
 * @returns {Date}
 */
export function dateAdd(dtTmp, strInterval, Number) {
  switch (strInterval) {
    case 's':
      return new Date(Date.parse(dtTmp) + (1000 * Number));
    case 'n':
      return new Date(Date.parse(dtTmp) + (60000 * Number));
    case 'h':
      return new Date(Date.parse(dtTmp) + (3600000 * Number));
    case 'd':
      return new Date(Date.parse(dtTmp) + (86400000 * Number));
    case 'w':
      return new Date(Date.parse(dtTmp) + (86400000 * 7 * Number));
    case 'q':
      return new Date(dtTmp.getFullYear(), dtTmp.getMonth() + (Number * 3), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    case 'm':
      return new Date(dtTmp.getFullYear(), dtTmp.getMonth() + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    case 'y':
      return new Date(dtTmp.getFullYear() + Number, dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    default:
      return dtTmp;
  }
}

/**
 * 求两个时间的天数差 日期格式为 YYYY-MM-dd
 * @param DateOne
 * @param DateTwo
 * @returns {number}
 */
export function daysBetween(DateOne, DateTwo) {
  const OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
  const OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
  const OneYear = DateOne.substring(0, DateOne.indexOf('-'));
  const TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
  const TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
  const TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));
  return (Date.parse(`${OneMonth}/${OneDay}/${OneYear}`) - Date.parse(`${TwoMonth}/${TwoDay}/${TwoYear}`)) / 86400000;
}

/**
 * 字符串转成日期类型
 * 格式 MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd
 * @param DateStr
 * @returns {Date}
 * @constructor
 */
export function StringToDate(DateStr) {
  const converted = Date.parse(DateStr);
  let myDate = new Date(converted);
  if (isNaN(myDate)) {
    const arys = DateStr.split('-');
    myDate = new Date(arys[0], arys[1]-1, arys[2]);
  }
  return myDate;
}

/**
 * 金额格式化
 * @param value 金额
 * @param sign 符号
 * @param format 格式化
 * @returns {*|number}
 */
export function formatMoney(value, sign, format){
  const formatStr = format || '0,0.00';

  let retValue = value || 0;
  retValue = numeral(retValue).format(formatStr);
  if(sign) retValue = `${sign}${retValue}`;
  return retValue;
}
