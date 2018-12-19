import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i <= 24; i += 1) {
  tableListDataSource.push({
    id: i,
    title: `消息标题${i}`,
    created_user: `发送人${i}`,
    created_time: '2018-08-01',
    summary: '这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容',
  });
}

export function queryMessagesList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = [...tableListDataSource];

  if (params.title) {
    dataSource = [...dataSource].filter(data => data.title.indexOf(params.title) > -1);
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

export function deleteMessage(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let ids = params.ids;

  ids.split(',').forEach((item) => {
    let index = tableListDataSource.findIndex(data => parseInt(data.id, 10) ===  parseInt(item, 10));
    tableListDataSource.splice(index, 1);
  });

  const result = {
    success: 'true',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export default {
  queryMessagesList,
  deleteMessage,
};
