import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
let statusArr = [1, 2];
for (let i = 1; i <= 20; i += 1) {
  tableListDataSource.push({
    key: i,
    task_id: `Task${i}`,
    creater_user: `发起用户${i}`,
    receiver_user: `接收用户${i}`,
    amount: '30.00',
    time: `2018-09-10 08:50:20`,
    price: `100.00`,
    status: statusArr[Math.floor(Math.random() * 10) % 2],
  });
}

export function getCashRecordList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = [...tableListDataSource];

  if (params.name) {
    dataSource = [...dataSource].filter(data => data.creater_user.indexOf(params.name) > -1);
  }
  if (params.date) {
    dataSource = [...dataSource].filter(data => data.time.indexOf(params.date) > -1);
  }

  let pageSize = 10;
  if (params.per_page) {
    pageSize = params.per_page * 1;
  }
  let start = 0;
  let current = 1;
  if (params.page) {
    current = parseInt(params.page, 10);
    start = (parseInt(params.page, 10)-1) * pageSize;
  }
  let newArr = dataSource.slice(start, start+pageSize);

  const result = {
    rows: newArr,
    current: current,
    total: dataSource.length,
    page_size: pageSize,
  };

  const json = {
    success: true,
    data: result,
  };

  if (res && res.json) {
    res.json(json);
  } else {
    return result;
  }
}



export default {
  getCashRecordList,
};
