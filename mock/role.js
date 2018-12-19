import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [{
  id: 1,
  name: '管理员',
  description: null,
  company_id: null,
  role_type: 1,
  resources: [
    {id: 5, name: ''},
    {id: 8, name: ''},
    {id: 24, name: ''},
    {id: 25, name: ''},
    {id: 27, name: ''},
  ],
}];
for (let i = 2; i < 46; i += 1) {
  tableListDataSource.push({
    id: i,
    name: `名称 ${i}`,
    description: `描述 ${i}`,
    company_id: i % 3,
    role_type: i % 3,
  });
}

export function getRole(req, res, u) {
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

  if (params.search_name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.search_name) > -1);
  }

  if (params.search_description) {
    dataSource = dataSource.filter(data => data.description.indexOf(params.search_description) > -1);
  }

  if (params.role_type) {
    dataSource = dataSource.filter(data => parseInt(data.role_type, 10) === parseInt(params.role_type, 10));
  }

  let pageSize = 10;
  if (params.per_page) {
    pageSize = params.per_page * 1;
  }
  let page = 1;
  if (params.page) {
    page = parseInt(params.page, 10);
  }

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


export function getRoleInfo(req, res) {
  const id = parseInt(req.params.id, 10);
  const roleInfo = tableListDataSource.find(
    role => {
      return role.id === id;
    },
  )

  const result = {
    success: true,
    data: roleInfo,
  }

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function postRole(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { name, description, role_type } = body;// eslint-disable-line
  const result = {
    success: true,
  }

  const i = tableListDataSource.length + 1;
  const role = {
    'id': i,
    'name': name,
    'description': description,
    'company_id': null,
    'role_type': role_type,
  };
  tableListDataSource.unshift(role);
  result.data = role;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function updateRole(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { name, description, resources } = body;

  const id = parseInt(req.params.id, 10);
  const index = tableListDataSource.findIndex(
    role => {
      return role.id === id;
    },
  )

  if(name !== undefined && name !== null){
    tableListDataSource[index].name = name;
  }
  if(description !== undefined && description !== null){
    tableListDataSource[index].description = description;
  }
  if(resources !== undefined && resources !== null){
    const resourceObj = resources.map(resource => {
      return {id: parseInt(resource, 10), name: ""}
    })
    tableListDataSource[index].resources = resourceObj;
  }

  const result = {
    success: true,
  }

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function deleteRole(req, res) {
  const id = parseInt(req.params.id, 10);
  const index = tableListDataSource.findIndex(
    role => {
      return role.id === id;
    },
  )
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

export function getAllResources(req, res) {
  const result = {
    success: true,
    data: [{
      id: 1,
      pid: null,
      name: '根节点',
      children: [
        {
          id: 2,
          pid: 1,
          name: '亚洲',
          pname: '根节点',
          children: [
            {
              id: 5,
              pid: 2,
              name: '中国',
              pname: '亚洲',
              children: [
                {
                  id: 8,
                  pid: 5,
                  name: '北京',
                  options: [
                    {
                      id: 24,
                      pid: 8,
                      name: '新增',
                    },
                    {
                      id: 25,
                      pid: 8,
                      name: '修改',
                    },
                    {
                      id: 26,
                      pid: 8,
                      name: '删除',
                    },
                  ],
                },
                {
                  id: 9,
                  pid: 5,
                  name: '上海',
                  options: [
                    {
                      id: 27,
                      pid: 9,
                      name: '新增',
                    },
                    {
                      id: 28,
                      pid: 9,
                      name: '修改',
                    },
                    {
                      id: 29,
                      pid: 9,
                      name: '删除',
                    },
                  ],
                },
                {
                  id: 10,
                  pid: 5,
                  name: '南窑头',
                },
              ],
            },
            {
              id: 6,
              pid: 2,
              name: '韩国',
              children: [
                {
                  id: 11,
                  pid: 6,
                  name: '首尔',
                },
              ],
            },
            {
              id: 7,
              pid: 2,
              name: '日本',
              children: [
                {
                  id: 12,
                  pid: 7,
                  name: '东京',
                },
              ],
            },
          ],
        },
        {
          id: 3,
          pid: 1,
          name: '欧洲',
          children: [
            {
              id: 13,
              pid: 3,
              name: '法国',
              children: [
                {
                  id: 16,
                  pid: 13,
                  name: '巴黎',
                },
              ],
            },
            {
              id: 14,
              pid: 3,
              name: '英国',
              children: [
                {
                  id: 17,
                  pid: 14,
                  name: '伦敦',
                },
              ],
            },
            {
              id: 15,
              pid: 3,
              name: '德国',
              children: [
                {
                  id: 18,
                  pid: 15,
                  name: '柏林',
                },
              ],
            },
          ],
        },
        {
          id: 4,
          pid: 1,
          name: '美洲',
          children: [
            {
              id: 19,
              pid: 4,
              name: '美国',
              children: [
                {
                  id: 21,
                  pid: 19,
                  name: '华盛顿',
                },
                {
                  id: 22,
                  pid: 19,
                  name: '纽约',
                },
              ],
            },
            {
              id: 20,
              pid: 4,
              name: '刚果',
              children: [
                {
                  id: 23,
                  pid: 20,
                  name: '金沙萨',
                },
              ],
            },
          ],
        },
      ],
    }],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getRole,
  getAllResources,
  getRoleInfo,
  postRole,
  updateRole,
  deleteRole,
};
