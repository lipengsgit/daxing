import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 101; i += 1) {
  tableListDataSource.push({
    id: i,
    name: `名称 ${i}`,
  });
}

export function getAlarmCategories(req, res, u) {
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


export function getAlarmCategoryInfo(req, res) {
  const id = parseInt(req.params.id, 10);
  const alarmCategoryInfo = tableListDataSource.find(
    alarmCategory => {
      return alarmCategory.id === id;
    },
  );

  const result = {
    success: true,
    data: alarmCategoryInfo,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function saveAlarmCategory(req, res, u, b) {
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


export function updateAlarmCategory(req, res, u, b) {
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

export function deleteAlarmCategory(req, res) {
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
  getAlarmCategories,
  getAlarmCategoryInfo,
  saveAlarmCategory,
  updateAlarmCategory,
  deleteAlarmCategory,
};
