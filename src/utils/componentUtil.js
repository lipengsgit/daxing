function getValue(obj) {
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
}

export function getTableParams(pagination, filtersArg, sorter) {
  let filters = {};
  if(filtersArg){
    filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
  }

  const params = {
    ...filters,
  };
  if(pagination && pagination.current){
    params.page = pagination.current;
  }
  // 如果是跳转后返回，pagination取自model，如果是列表翻页、排序、更改每页条数pagination取自antd的table
  // 1、model中的 pagination 属性为page_size，为服务器返回后保存在model
  // 2、antd的table的 pagination 属性为pageSize
  if(pagination && pagination.pageSize){
    params.per_page = pagination.pageSize;
  }else if(pagination && pagination.page_size){
    params.per_page = pagination.page_size;
  }
  if (sorter && sorter.field) {
    params.sorter = `${sorter.field}_${sorter.order}`;
  }
  return params;
}
