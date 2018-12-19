import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 101; i += 1) {
  tableListDataSource.push({
    id: i,
    name: `名称 ${i}`,
    description: `描述 ${i}`,
  });
}

export function getTechniques(req, res, u) {
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


export function getTechniqueInfo(req, res) {
  const id = parseInt(req.params.id, 10);
  const techniqueInfo = tableListDataSource.find(
    technique => {
      return technique.id === id;
    },
  );

  const result = {
    success: true,
    data: techniqueInfo,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function saveTechnique(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const result = {
    success: true,
  };

  const i = tableListDataSource.length + 1;
  const technique = {
    id: i,
    name: body.name,
    description: body.description,
  };
  tableListDataSource.unshift(technique);
  result.data = technique;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function updateTechnique(req, res, u, b) {
  const body = (b && b.body) || req.body;

  const id = parseInt(req.params.id, 10);
  const index = tableListDataSource.findIndex(
    technique => {
      return technique.id === id;
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

export function deleteTechnique(req, res) {
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
  getTechniques,
  getTechniqueInfo,
  saveTechnique,
  updateTechnique,
  deleteTechnique,
};
