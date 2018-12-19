// import { parse } from 'url';

// mock tableListDataSource
import {parse} from "url";

const companyList = [];
for (let i = 1; i <= 5; i += 1) {
  companyList.push({
    id: i,
    company_name: `物业公司${i}`,
  });
}

const projectList = [];
for (let i = 0; i < companyList.length; i += 1) {
  let projectArr = [];
  for (let j = 1; j <= 20; j += 1) {
    projectArr.push({
      id: j,
      name: `项目${j}`,
      adcode: '440304',
      adcode_name: '深圳市-福田区',
      summary: `${companyList[i].company_name}项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介项目简介${j}`,
      phone: '13111111111',
      address: '广东省深圳市福田区',
      company_id: companyList[i].id,
      company_name: '天安运营',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.jpg',
    });
  }

  projectList.push({
    company_id: companyList[i].id,
    project: projectArr,
  });

}

export function queryCompanyList(req, res) {
  res.json(companyList);
}


export function queryProjectByCompanyId(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [];
  for (let i = 0; i < projectList.length; i += 1) {
    if(parseInt(params.company_id, 10) === projectList[i].company_id){
      dataSource = projectList[i].project;
      break;
    }
  }

  if (params.name) {
    dataSource = [...dataSource].filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 4;
  if (params.per_page) {
    pageSize = params.per_page * 1;
  }
  let start = 0;
  let current = 1
  if (params.page) {
    current = parseInt(params.page, 10);
    start = (parseInt(params.page, 10)-1) * pageSize;
  }
  let newArr = dataSource.slice(start, start+pageSize);

  const result = {
    rows: newArr,
    current: current,
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
    return json;
  }
}



export default {
  queryCompanyList,
  queryProjectByCompanyId,
};
