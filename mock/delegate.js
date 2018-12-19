import { parse } from "url";

const tableListDataSource = [];
for (let i = 1; i < 3; i += 1) {
  tableListDataSource.push({
    id: i,
    name: `组态网 ${i}`,
    remark: null,
    delegate_category: 1,
    delegate_ip: null,
    delegate_port: null,
    delegate_username: null,
    delegate_password: null,
    obj_name: null,
    start_address: null,
    overtime: null,
  });
}

export function getDelegates(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let pageSize = 10;
  if (params.per_page) {
    pageSize = params.per_page * 1;
  }
  let page = 1;
  if (params.page) {
    page = parseInt(params.page, 10);
  }

  const dataSource = [...tableListDataSource];
  const result = {
    success: true,
    data: {
      current: page,
      page_size: pageSize,
      total: dataSource.length,
      rows: dataSource,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getDelegates,
};
