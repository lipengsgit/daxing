import { parse } from 'url';

// mock tableListDataSource
//let tableListDataSource = [];


const tableConfigSource=[]
  for (let i = 1; i < 21; i += 1) {
  tableConfigSource.push({
    id: i,
    inspection_items:[{
      id:`${i}`,
      name: `${i}`,
      description: `${i}` ,

    },
   ],
    maintenance_items:[{
      id:i,
      name: `保养 ${i}`,
      description: `维护保养${i}` ,
    }],

  });
}



const tableListDataSource = [];
for (let i = 1; i < 20; i += 1) {
  tableListDataSource.push({
    id: i,
    room_id:i,
    key: i,
    name: `张三你 ${i}`,
    owner_name:`搜索 ${i}`,
    money :`235${i}.${i}`,
    status: `${i}`,
    address:`万科金域东郡/45号楼/45-1-10 ${i}`,
    domain_name:`万科 ${1}`,
    build:`${i}号楼` ,
    house_no:`${i}-1-10`,
    zone_name:'花园小区',
    building_name:'a栋',
    unit_name:'1单元',
    room_name:'1201',
    area:'80.5',
    amount:'2080.50',
    overdue:'true',
    payment_amount:`2680.${i}`,
    phone:'13888888888',



  });
}

const historyTableListDataSource = [];
const payType = ['现金', '刷卡', '扫码', '总计'];
for (let i = 0; i < 4; i += 1) {
  historyTableListDataSource.push({
    id: i,
    paytype:payType[i],
    total_receive:`68685.${i}`,
    total_record:`58554.${i}`,
    bi_column:'98%',




  });
}


const historyTableListDataSource1 = [];
const payType1 = ['公众号收费', '线下刷卡', '线下扫码', '现金收费'];
for (let i = 0; i < 4; i += 1) {
  historyTableListDataSource1.push({
    id: i,
    paytype:payType1[i],
    total_receive:`68685.${i}`,
    total_record:`58554.${i}`,
    bi_column:'98%',


  });
}





export function getEquipment1(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = [...historyTableListDataSource1];


  if (params.username) {
    dataSource = [...dataSource].filter(data => data.username.indexOf(params.username) > -1);
  }

  let pageSize = 10;
  if (params.per_page) {
    pageSize = params.per_page * 1;
  }
  let start = 0;
  if (params.page) {
    start = (parseInt(params.page, 10)-1) * pageSize;
  }
  let newArr = dataSource.slice(start, start+pageSize);

  const result = {
    rows: newArr,
    current: params.page,
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


export function getEquipment(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  console.log("查看参数+++++++++++++"+params.per_page+"============="+params.page);
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

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }


  let pageSize = 20;
  if (params.per_page) {
    pageSize = params.per_page * 1;
  }
  let page = 1;
  if (params.page) {
    page = parseInt(params.page, 5);
  }
  let start = 0;
  if (params.page) {
    start = (parseInt(params.page, 20)-1) * pageSize;
    start = (parseInt(params.page, 20)-1) * pageSize;
  }
  let newArr = dataSource.slice(start, start+pageSize);

  const result = {
    success: true,
    data: {
      current: page,
      page_size: pageSize,
      total: dataSource.length,
      rows: newArr,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function getChargeMode(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  console.log("查看参数+++++++++++++"+params.per_page+"============="+params.page);
  let dataSource = [...historyTableListDataSource1];
  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }


  let pageSize = 20;
  if (params.per_page) {
    pageSize = params.per_page * 1;
  }
  let page = 1;
  if (params.page) {
    page = parseInt(params.page, 5);
  }
  let start = 0;
  if (params.page) {
    start = (parseInt(params.page, 20)-1) * pageSize;
    start = (parseInt(params.page, 20)-1) * pageSize;
  }
  let newArr = dataSource.slice(start, start+pageSize);

  const result = {
    success: true,
    data: {
      current: page,
      page_size: pageSize,
      total: dataSource.length,
      rows: newArr,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function getHistoryPay(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  console.log("查看参数+++++++++++++"+params.per_page+"============="+params.page);
   let dataSource = [...historyTableListDataSource];
  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }


  let pageSize = 20;
  if (params.per_page) {
    pageSize = params.per_page * 1;
  }
  let page = 1;
  if (params.page) {
    page = parseInt(params.page, 5);
  }
  let start = 0;
  if (params.page) {
    start = (parseInt(params.page, 20)-1) * pageSize;
    start = (parseInt(params.page, 20)-1) * pageSize;
  }
  let newArr = dataSource.slice(start, start+pageSize);

  const result = {
    success: true,
    data: {
      current: page,
      page_size: pageSize,
      total: dataSource.length,
      rows: newArr,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}



export function getEquipmentInfo(req, res) {
  console.log('id==================');
   const id = parseInt(req.params.id, 10);


  const EquipmentInfo = tableListDataSource.find(
    subsystem => {
      return subsystem.id === id;
    },
  )
  const json = {
    success: true,
    data: EquipmentInfo,
  };

  if (res && res.json) {
    res.json(json);
  } else {
    return json;
  }
}


// 根据设备类型编号查询设备配置列表
export function getConfigureList(req, res) {
  console.log("hahhahahhahah")
   const id = parseInt(req.params.id, 10);
  const Info = tableConfigSource.find(
    data => {
      return data.id === id;
    },
  )

  const json = {
    success: true,
    data: Info,
  };

  if (res && res.json) {
    res.json(json);
  } else {
    return json;
  }
}



// 删除设备类型
export function deleteEquipement (req, res) {
  const id = parseInt(req.params.id, 10);
  console.log("当前删除 编号=============="+id )
  const index = tableListDataSource.findIndex(
    data => {
      return data.id === id;
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

// 编辑
export function updateEquipement(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { name, sequence,delegate_ip,overtime,delegate_category} = body;

  const id = parseInt(req.params.id, 10);
  console.log("修改 获取id========="+id)
  const index = tableListDataSource.findIndex(
    data => {
      return data.id === id;
    },
  )

  if(name !== undefined && name !== null){
    tableListDataSource[index].name = name;
  }
  if(sequence !== undefined && sequence !== null){
    tableListDataSource[index].sequence = sequence;
  }

  if(delegate_ip !== undefined && delegate_ip !== null){
    tableListDataSource[index].delegate_ip = delegate_ip;
  }
  if(overtime !== undefined && overtime !== null){
    tableListDataSource[index].overtime = overtime;
  }
  if(delegate_category !==undefined && delegate_category !=null){
    tableListDataSource[index].delegate_category=delegate_category;
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



// 新增设备类型 子系统字段
export function postEquipment(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { name, InvoiceHead,identification,tel,email,sequence ,delegate_ip,delegate_username,delegate_category,overtime,image_folder_no,icon_folder_no,delegate_port,delegate_password,obj_name,remark} = body;
  const result = {
    success: true,
  }

  const i = tableListDataSource.length + 1;
  const data = {
    'id': i,
    'name': name,
    'InvoiceHead':InvoiceHead,
    'identification':identification,
    'tel':tel,
    'email':email,

    'sequence': sequence,
    'delegate_ip' :delegate_ip,
    'delegate_category':delegate_category,
    'delegate_username' :delegate_username,
    'icon':[],
    'image':[],
    'overtime':overtime,
    'image_folder_no' :image_folder_no,
    'icon_folder_no' :icon_folder_no,
    'delegate_port':delegate_port,
    'delegate_password':delegate_password,
    'obj_name':obj_name,
    'remark':remark,

  };
  tableListDataSource.unshift(data);
  result.data = data;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

// 配置巡检项目
export  function  config_insection(req, res, u, b){
  const body = (b && b.body) || req.body;
  const { name, sequence,id ,description} = body;
  let ids=parseInt(id);
  console.info(name,description,ids)
  const result = {
    success: true,
  }
  const index = tableConfigSource.findIndex(
    data => {
      return data.id === ids;
    },
  )
  const i = tableConfigSource[index].inspection_items.length + 1;
  const data = {
    'id': i,
    'name': name,
    'description': description,
     };
  let newdata=tableConfigSource[index].inspection_items.push(data)
    result.data = newdata;
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

 //配置维护项目
export  function  config_maintenance(req, res, u, b){
  const body = (b && b.body) || req.body;
  const { name, sequence,id ,description} = body;
  let ids=parseInt(id);
  console.info(name,description,ids)
  const result = {
    success: true,
  }
  const index = tableConfigSource.findIndex(
    data => {
      return data.id === ids;
    },
  )
  const i = tableConfigSource[index].maintenance_items.length + 1;
  const data = {
    'id': i,
    'name': name,
    'description': description,
  };

  let newdata=tableConfigSource[index].maintenance_items.push(data)
  result.data = newdata;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}




//修改巡检项目
 export function updateInspection(req, res, u, b){
    const body = (b && b.body) || req.body;
   const { name, sequence,id ,description} = body;
   let ids=parseInt(id);
   console.info(name,description,ids)

   return false;
   const index = tableConfigSource.findIndex(
     data => {
       return data.id === ids;
     },
   )
   if(name !== undefined && name !== null){
     tableConfigSource[index].inspection_items[ids-1].name=name
   };
/*   if(description !==undefined && description !==null){
    tableListDataSource[index].inspection_items[ids-1].description=description
   };*/
   const result = {
     success: true,
   }
   if (res && res.json) {
     res.json(result);
   } else {
     return result;
   }
 }

//修改维护项目
export  function updateMaintenance(req,res,u,b){
  console.log("当前是修改维护项目")
  const result = {
    success: true,
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
//删除巡检项目
export function delete_inspection(req,res,u,b){
  console.log("当前是删除巡检项目")
  const id = parseInt(req.params.id, 10);
  console.log("当前删除 编号=============="+id )
/*  const index = tableConfigSource.findIndex(
    data => {
      return data.no === id;
    },
  )
  tableConfigSource.splice(index, 1);*/
  const result = {
    success: true,
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
//删除维护项目
export function delete_maintenance(req,res,u,b){
  console.log("当前是删除维护项目")
  const result = {
    success: true,
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export default {
  getHistoryPay,
  getEquipment,
  postEquipment,
  updateEquipement,
  deleteEquipement,
  getConfigureList,
  updateInspection,
  delete_inspection,
  delete_maintenance,

};
