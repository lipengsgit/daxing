import { parse } from "url";

const tableListDataSource = [{
  id: 1,
  pid: null,
  name: '项目A',
  children: [
    {
      id: 2,
      pid: 1,
      name: '小区1',
      children: [
        {
          id: 5,
          pid: 2,
          name: '1栋',
          children: [
            {
              id: 8,
              pid: 5,
              name: '电梯间',
            },
            {
              id: 9,
              pid: 5,
              name: '配电间',
            },
            {
              id: 10,
              pid: 5,
              name: 'xx间',
            },
          ],
        },
        {
          id: 6,
          pid: 2,
          name: '2栋',
          children: [
            {
              id: 11,
              pid: 6,
              name: '3楼',
            },
          ],
        },
        {
          id: 7,
          pid: 2,
          name: '3栋',
          children: [
            {
              id: 12,
              pid: 7,
              name: '天台',
            },
          ],
        },
      ],
    },
  ],
}];

const tableListDataSource1 = [{
  id: 13,
  pid: null,
  name: '项目B',
  children: [
    {
      id: 14,
      pid: 13,
      name: '小区B-1',
      children: [
        {
          id: 15,
          pid: 14,
          name: 'B-1-1栋',
        },
        {
          id: 16,
          pid: 14,
          name: 'B-1-2栋',
        },
      ],
    },
    {
      id: 17,
      pid: 13,
      name: '小区B-2',
      children: [
        {
          id: 18,
          pid: 17,
          name: 'B-2-1栋',
        },
        {
          id: 19,
          pid: 17,
          name: 'B-2-2栋',
        },
      ],
    },
  ],
}];



export function getPositionByProject(req, res, u){
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  const data = params.project_id === '1' ? tableListDataSource : tableListDataSource1;// eslint-disable-line

  const result = {
    success: true,
    data,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

const findResource = (array, id) => {
  for (const item of array) {
    if(item.id === id){
      return item;
    }
    if(item.children){
      const ret = findResource(item.children, id);
      if(ret !== null){
        return ret
      }
    }
  }
  return null;
};

export function getPositionName(req, res){
  const id = parseInt(req.params.id, 10);
  const item = findResource(tableListDataSource, id);

  const result = {
    success: true,
    data: item,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getPositionByProject,
  getPositionName,
};
