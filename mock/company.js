import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 15; i += 1) {
  tableListDataSource.push({
    id: i,
    name: `名称 ${i}`,
    status: 0,
    summary: null,
    company_type: 1,
    phone: null,
    contact_person_name: null,
    contact_person_phone: null,
    company_full_name: null,
    adcode: "440304",
    adcode_name: "深圳市-福田区",
    address: null,
  });
}

export function getCompanies(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }
  if (params.company_type) {
    dataSource = dataSource.filter(data => data.company_type === parseInt(params.company_type, 10));
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


export function getCompanyInfo(req, res) {
  const id = parseInt(req.params.id, 10);
  const companyInfo = tableListDataSource.find(
    company => {
      return company.id === id;
    },
  );

  const result = {
    success: true,
    data: companyInfo,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function createCompany(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const result = {
    success: true,
  };

  const i = tableListDataSource.length + 1;
  const alarmCategory = {
    id: i,
    name: body.name,
    description: body.description,
  };
  tableListDataSource.unshift(alarmCategory);
  result.data = alarmCategory;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function updateCompany(req, res, u, b) {
  const body = (b && b.body) || req.body;

  const id = parseInt(req.params.id, 10);
  const index = tableListDataSource.findIndex(
    alarmCategory => {
      return alarmCategory.id === id;
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

export function deleteCompany(req, res) {
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
  getCompanies,
  getCompanyInfo,
  createCompany,
  updateCompany,
  deleteCompany,
};
