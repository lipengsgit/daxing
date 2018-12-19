import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
let statusArr = [true, false];
for (let i = 1; i <= 20; i += 1) {
  tableListDataSource.push({
    key: i,
    id: i,
    username: `用户${i}`,
    full_name: `用户${i}`,
    sex: '男',
    company_id: `公司${i}`,
    department_id: `部门${i}`,
    lock_status: statusArr[Math.floor(Math.random() * 10) % 2],
    mobile_phone: '13111111111',
    telephone: '02988888888',
  });
}

export function queryUserList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = [...tableListDataSource];

  if (params.lock_status) {
    dataSource = [...dataSource].filter(data => data.lock_status === eval(params.lock_status));
  }
  if (params.username) {
    dataSource = [...dataSource].filter(data => data.username.indexOf(params.username) > -1);
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

export function postUser(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { userForm } = body;
  const i = Math.ceil(Math.random() * 10000);
  tableListDataSource.unshift({
    key: i,
    id: i,
    username: userForm.username1,
    full_name: userForm.username,
    sex: userForm.sex,
    department_id: userForm.department_id,
    lock_status: 0,
    mobile_phone: userForm.mobile_phone1,
    telephone: userForm.telephone,
  });

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function deleteUser(req, res) {

  const uid = req.params.id;
  const index = tableListDataSource.findIndex(item => parseInt(uid, 10) === item.id);
  tableListDataSource.splice(index, 1);

  const result = {
    success: 'true',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function updateUser(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { userForm } = body;

  console.info(userForm);

  const index = tableListDataSource.findIndex(item => parseInt(userForm.id, 10) === item.id);

  tableListDataSource[index].username = userForm.username1;

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function resetUserPassword(req, res) {

  const uid = req.params.id;
  console.info(uid);

  const result = {
    success: true,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export function switchUserLockStatus(req, res) {

  const uid = req.params.id;
  console.info(uid);

  const result = {
    success: true,
    data:{
      lock_status: false,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export default {
  queryUserList,
  postUser,
  deleteUser,
  updateUser,
  resetUserPassword,
  switchUserLockStatus
};
