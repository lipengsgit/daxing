import { parse } from 'url';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 1; i < 101; i += 1) {
  let projectId = 1;
  let positionId = 1;
  if(i>50) {
    projectId = 2;
    positionId = 13;
  }
  tableListDataSource.push({
    id: i,
    name: `名称 ${i}`,
    project_id: projectId,
    project_name: `项目 ${projectId}`,
    position_id: positionId,
    position_name: `位置 ${positionId}`,
    device_category_id: i,
    device_category_name: `类型 ${i}`,
    delegate_id: i,
    delegate_name: `delegate ${i}`,
    status: i%3,
    device_model: '',
    device_no: `编号 ${i}`,
    manufacturer: `厂商 ${i}`,
    manufacturer_phone: null,
    manufacturer_address: null,
    install_date: null,
    install_company: null,
    use_years: null,
    use_date: null,
    quality_start_date: null,
    quality_end_date: null,
    quality_years: null,
    company_id: 1,
  });
}

export function getDevices(req, res, u) {
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

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  if (params.device_category_id) {
    dataSource = dataSource.filter(data => parseInt(data.device_category_id, 10) === parseInt(params.device_category_id, 10));
  }

  if (params.status) {
    dataSource = dataSource.filter(data => parseInt(data.status, 10) === parseInt(params.status, 10));
  }

  if (params.project_id) {
    dataSource = dataSource.filter(data => parseInt(data.project_id, 10) === parseInt(params.project_id, 10));
  }

  if (params.position_id) {
    dataSource = dataSource.filter(data => parseInt(data.position_id, 10) === parseInt(params.position_id, 10));
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


export function getDeviceInfo(req, res) {
  const id = parseInt(req.params.id, 10);
  const deviceInfo = tableListDataSource.find(
    device => {
      return device.id === id;
    },
  )

  const result = {
    success: true,
    data: deviceInfo,
  }

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function saveDevice(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const result = {
    success: true,
  }

  const i = tableListDataSource.length + 1;
  const device = {
    id: i,
    name: body.name,
    project_id: body.project_id,
    project_name: `项目 ${body.project_id}`,
    position_id: body.position_id,
    position_name: `位置 ${body.position_id}`,
    device_category_id: body.device_category_id,
    device_category_name: `类型 ${i}`,
    delegate_id: body.delegate_id,
    delegate_name: `delegate ${i}`,
    device_model: body.device_model,
    device_no: body.device_no,
    manufacturer: body.manufacturer,
    manufacturer_phone: body.manufacturer_phone,
    manufacturer_address: body.manufacturer_address,
    install_date: body.install_date,
    install_company: body.install_company,
    use_years: body.use_years,
    use_date: body.use_date,
    quality_start_date: body.quality_start_date,
    quality_end_date: body.quality_end_date,
    quality_years: body.quality_years,
    company_id: body.company_id,
    folder_no: body.folder_no,
  };
  tableListDataSource.unshift(device);
  result.data = device;

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function updateDevice(req, res, u, b) {
  const body = (b && b.body) || req.body;
  body.position_name = `位置 ${body.position_id.toString()}`;

  const id = parseInt(req.params.id, 10);
  const index = tableListDataSource.findIndex(
    device => {
      return device.id === id;
    },
  )
  tableListDataSource[index] = {...body};

  const result = {
    success: true,
  }

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function deleteDevice(req, res) {
  const id = parseInt(req.params.id, 10);
  const index = tableListDataSource.findIndex(
    item => {
      return item.id === id;
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

export function getDeviceTypes(req, res){
  const result = {
    success: true,
    data: [
      {id: 1, name: '摄像头'},
      {id: 2, name: '水泵'},
      {id: 3, name: '风机'},
      {id: 4, name: '那啥'},
    ],
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getDevices,
  getDeviceInfo,
  saveDevice,
  updateDevice,
  deleteDevice,
  getDeviceTypes,
};
