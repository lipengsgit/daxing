import { parse } from 'url';

const tableListDataSource = [];
for (let i = 1; i < 16; i += 1) {
  tableListDataSource.push({
    id: i,
    name: `胡彦斌1${i}`,
    ID: "201808081111",
    address: "万达/一号楼/1001",
    phone: "15188889999",
    date: "2018/09/10 14:19:23",
    openUp_status:'3',
  });

}
const tableListData = [];
for (let i = 1; i < 16; i += 1) {
  tableListData.push({
    id: i,
    name: `胡彦斌2${i}`,
    ID: "201808081111",
    address: "万达/一号楼/1001",
    phone: "15188889999",
    date: "2018/09/10 14:19:23",
    executor:"微笑",
  });
}
export function getOpenUpList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];
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

// 开票数据
export function getInvoiceInfo(req, res) {
  const id = parseInt(req.params.id, 6);
  // console.log(id);
  const Info = tableListData.find(
    list => {
      return list.id === id;
    },
  );
//  console.log(Info);
  const result = {
    success: true,
    data: Info,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

//  Search查询
export function getSearchNameInfo(req, res) {
  console.log('返回search');
  const name = req.params.name;
  const SearchInfo = tableListDataSource.find(
    Search => {
      return Search.name === name;
    },
  );
  const result = {
    success: true,
    data: [SearchInfo],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

//  手机号查询
export function getSearchPhoneInfo(req, res) {
  console.log('返回date');
  const date = req.params.phone;
  console.log(date);
  const DateInfo = tableListDataSource.find(
    Search => {
      return Search.phone === phone;
    },
  );
  console.log(DateInfo);
  const result = {
    success: true,
    data: [DateInfo],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

// 查询发票信息
export function getMoreInvoice(req, res) {
  const id = parseInt(req.params.id, 6);
//  console.log(id);
  const Info = tableListDataSource.find(
    list => {
      return list.id === id;
    },
  );
  // console.log(Info);
  const result = {
    success: true,
    data: Info,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


//  发短信
export function sendInvoice(req, res) {
  const phone = req.params.no;
  console.log(phone);
  const Info = tableListDataSource.find(
    list => {
      return list.phone === phone;
    },
  );
  console.log(Info);
  const result = {
    success: true,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}




export default {
  getOpenUpList,
  getSearchNameInfo,
  getSearchPhoneInfo
};
