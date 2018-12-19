import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 101; i += 1) {
  tableListDataSource.push({
    id: i,
    name: `项目 ${i}`,
    adcode: "440304",
    adcode_name: "深圳市-福田区",
    summary: null,
    phone: null,
    address: null,
    company_id: 1,
    company_name: "天安运营",
    folder_no: "",
    images: [
      {
        id: 1,
        folder_no: "123",
        file_size: "100",
        content_type: "",
        file_name: "",
        file_original_name: "",
        url: "",
      },
      {
        id: 1,
        folder_no: "123",
        file_size: "100",
        content_type: "",
        file_name: "",
        file_original_name: "",
        url: "",
      },
    ],
  });
}

export function getProjects(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
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


export function getProjectInfo(req, res) {
  const id = parseInt(req.params.id, 10);
  const itemInfo = tableListDataSource.find(
    item => {
      return item.id === id;
    },
  );

  const result = {
    success: true,
    data: itemInfo,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function createProject(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const result = {
    success: true,
  };

  const i = tableListDataSource.length + 1;
  const item = {
    id: i,
    name: body.name,
    adcode: body.adcode,
    adcode_name: body.adcode_name,
    summary: body.summary,
    phone: body.phone,
    address: body.address,
    company_id: body.company_id,
    company_name: body.company_name,
    folder_no: body.folder_no,
  };
  tableListDataSource.unshift(item);
  result.data = item;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function updateProject(req, res, u, b) {
  const body = (b && b.body) || req.body;

  const id = parseInt(req.params.id, 10);
  const index = tableListDataSource.findIndex(
    item => {
      return item.id === id;
    },
  );
  tableListDataSource[index] = {...tableListDataSource[index], ...body};

  const result = {
    success: true,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function deleteProject(req, res) {
  const id = parseInt(req.params.id, 10);
  const index = tableListDataSource.findIndex(
    item => {
      return item.id === id;
    },
  );
  tableListDataSource.splice(index, 1);
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
  getProjects,
  getProjectInfo,
  createProject,
  updateProject,
  deleteProject,
};
