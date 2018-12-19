import { parse } from 'url';

// mock tableListDataSource
//let tableListDataSource = [];


const tableConfigSource=[
  {
    success: true,
    data: {
      inspection_items: [
        {
          id: 2,
          name: "破损11",
          description: "2222222"
        },
        {
          id: 3,
          name: "破损",
          description: "3333333"
        }
      ],
      maintenance_items: [
        {
          id: 2,
          name: "除灰",
          description: null
        }
      ]
    }


}]

const tableListDataSource = [];
for (let i = 1; i < 20; i += 1) {
  tableListDataSource.push({
    id: i,
    key: i,
    no: `TradeCode ${i}`,
    name: `类型名称 ${i}`,
    image:
      {
        id: i+99,
        folder_no: "123",
        file_size: "100",
        content_type: "",
        file_name: "",
        file_original_name: "",
        url: "https://cdn2.jianshu.io/assets/default_avatar/avatar_default-78d4d1f68984cd6d4379508dd94b4210.png"
      },

    icon:
      {
        id: i+99,
        folder_no: "123444",
        file_size: "100555",
        content_type: "",
        file_name: "",
        file_original_name: "",
        url: "https://cdn2.jianshu.io/assets/default_avatar/avatar_default-78d4d1f68984cd6d4379508dd94b4210.png"
      },
    inspection_items:[{
      id:i,
      name: `保养 ${i}`,
      description: `巡检保养${i}` ,

    }],
    maintenance_items:[{
      id:i,
      name: `保养 ${i}`,
      description: `维护保养${i}` ,

    }],
    img_type: `类型图片名称 ${i}` ,

  });
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



export function getEquipmentInfo(req, res) {
  console.log("getEquipmentInfo  no================"+req.params.id)
  const id = parseInt(req.params.id, 10);
  const EquipmentInfo = tableListDataSource.find(
    subsystem => {
      return subsystem.id === id;
    },
  )
  if (res && res.json) {
    res.json(EquipmentInfo);
  } else {
    return EquipmentInfo;
  }
}


//根据设备类型编号查询设备配置列表
export function getConfigureList(req, res) {
  console.log("hahhahahhahah")
   const id = parseInt(req.params.id, 10);
  const Info = tableListDataSource.find(
    data => {
      return data.id === id;
    },
  )
  if (res && res.json) {
    res.json(Info);
  } else {
    return Info;
  }
}



//删除设备类型
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


  const result = {
    success: true,
  }

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}




//新增设备类型 子系统字段
export function postEquipment(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { name, sequence ,delegate_ip,delegate_username,delegate_category,overtime,image_folder_no,delegate_port,delegate_password,obj_name,remark} = body;
  const result = {
    success: true,
  }

  const i = tableListDataSource.length + 1;
  const data = {
    'id': i,
    'name': name,
    'sequence': sequence,


  };
  tableListDataSource.unshift(data);
  result.data = data;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

//配置巡检项目
export  function  config_insection(req, res, u, b){

  const result = {
    success: true,
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

//修改巡检项目
 export function updateInspection(req, res, u, b){
  console.log("当前是修改巡检项目")
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
  getEquipment,
  postEquipment,
  updateEquipement,
  deleteEquipement,
  getConfigureList,
  updateInspection,
  delete_inspection,
  delete_maintenance,

};
