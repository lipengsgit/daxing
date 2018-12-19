import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 101; i += 1) {
  tableListDataSource.push({
    id: i,
    alarm_category_id: i,
    alarm_category_name: "火灾报警",
    alarm_time: "2018-05-31 02:03:18",
    device_item_name: "温度",
    device_name: `温度传感器 ${i}`,
    device_no: `AA ${i}`,
    alarm_status: 1,
    alarm_status_name: 1,
    trigger_value: "100",
    cancel_value: "70",
    alarm_value: "80",
    project_name: "U中心项目",
    position_name: "a栋-1单元",
  });
}

export function getAlarms(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.alarm_category_id) {
    dataSource = dataSource.filter(data => data.alarm_category_id === parseInt(params.alarm_category_id, 10));
  }

  if (params.alarm_status) {
    dataSource = dataSource.filter(data => data.alarm_status === parseInt(params.alarm_status, 10));
  }

  if (params.device_name) {
    dataSource = dataSource.filter(data => data.device_name.indexOf(params.device_name) > -1);
  }

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  let pageSize = 10;
  if (params.per_page) {
    pageSize = params.per_page * 1;
  }
  let page = 1;
  let start = 0;
  if (params.page) {
    page = parseInt(params.page, 10);
    start = (page-1) * pageSize;
  }

  const retData = dataSource.slice(start, start + pageSize);
  const result = {
    success: true,
    data: {
      current: page,
      page_size: pageSize,
      total: dataSource.length,
      rows: retData,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getAlarms,
};
