import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Layout,
  Icon,
} from 'antd';
import StandardTable from 'components/StandardTable';
import ProjectTree from 'components/ProjectTree';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './MonitorProject.less';

@connect(({ deviceManager, loading }) => ({
  deviceManager,
  loading: loading.models.deviceManager,
}))
export default class MonitorProject extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      projectId: -1,
      positionId: -1,
      expandedRowKeys: [],
      deviceData:{},
    };

    const propState = this.props.location.state;
    if (propState !== undefined){
      this.state.projectId = propState.projectId;
      this.state.positionId = propState.positionId;
      const { dispatch } = this.props;
      dispatch({
        type: 'deviceManager/setPagination',
        payload: propState.pagination,
      });
    }else{
      this.state.projectId = this.props.match.params.id;
    }
  }

  wrapperData = (data) => {
    return data.map((item) => {
      return {
        ...item,
        ...{"expanded": false},
      };
    });
  };


  // 第一次进入页面默认选中项目，进行设备列表查询
  fetchPositionsCallback = (positionId) => {
    this.setState({
      positionId,
    },this.searchDeviceList);

  };

  // 树节点选中回调，刷新设备列表
  treeSelectCallback = (posId) => {
    this.setState({
      positionId: posId,
    },this.searchDeviceList);

  };

  searchDeviceList = (pagination) => {
    const { dispatch } = this.props;
    const params = {
      project_id: this.state.projectId,
      position_id: this.state.positionId,
      page: pagination? pagination.current : 1,
      per_page: pagination? pagination.pageSize : 10,
    };
    dispatch({
      type: 'deviceManager/fetch',
      payload: params,
      callback: (result) => {
        const newData = {list: this.wrapperData(result.list),pagination: result.pagination};
        this.setState({
          deviceData: newData,
        });
      },
    });

  };



  // 分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    this.searchDeviceList(pagination)
  };

  handleExpandRow = (record, e) => {
    e.preventDefault();
    const r = record;
    const expandedKey = [...this.state.expandedRowKeys];
    if(expandedKey.indexOf(r.id) === -1) {
      expandedKey.push(r.id);
      r.expanded = true;
    }else{
      for(let i = 0; i < expandedKey.length; i+=1) {
        if(expandedKey[i] === r.id) {
          expandedKey.splice(i, 1);
          r.expanded = false;
        }
      }
    }
    this.setState({
      expandedRowKeys: expandedKey,
    });
  };
  expandedRowRender = (record) =>{
    console.info('expandedRowRender');
    return (
      <div className='shrInfo'>
        <p>
          <span>点名称:{record.name}</span>
          <span>点值:{record.device_no}</span>
        </p>
        <p>
          <span>点名称:{record.name}</span>
          <span>点值:{record.device_no}</span>
        </p>
      </div>
    );
  };

  renderTable() {
    const { loading } = this.props;

    const columns = [
      {
        title: '设备名称',
        dataIndex: 'name',
      },
      {
        title: '设备类型',
        dataIndex: 'device_category_name',
      },
      {
        title: '设备型号',
        dataIndex: 'device_model',
      },
      {
        title: '设备状态',
        dataIndex: 'status',
        render: (text) => {
          switch (text) {
            case 0:
              return '使用中';
            case 1:
              return '未使用';
            case 2:
              return '已报废';
            default:
              return '';
          }

        },
      },
      {
        title: '设备编号',
        dataIndex: 'device_no',
      },
      {
        title: '设备厂商',
        dataIndex: 'manufacturer',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            record.expanded ? (
              <a href="#" onClick={(e) => this.handleExpandRow(record, e)}>
                <Icon type="up" style={{ color: "red" }} />
              </a>
            ) : (
              <a href="#" onClick={(e) => this.handleExpandRow(record, e)}>
                <Icon type="down" style={{ color: "red" }} />
              </a>
            )

          )
        },
      },
    ];
    return (
      <StandardTable
        selectedRows={[]}
        needRowSelection={false}
        needShowSelect={false}
        loading={loading}
        data={this.state.deviceData}
        columns={columns}
        onChange={this.handleStandardTableChange}
        expandedKeys={this.state.expandedRowKeys}
        expandedRender={(record)=>this.expandedRowRender(record)}
        rowKey="id"
      />
    );
  }

  render() {
    const { Content, Sider } = Layout;
    const projectPrams = {
      projectId: this.state.projectId,
      positionId:this.state.positionId,
      dispatch: this.props.dispatch,
      fetchPositionsCallback: this.fetchPositionsCallback,
      treeSelectCallback: this.treeSelectCallback,
      defaultChecked: true,
    };
    return (
      <PageHeaderLayout >
        <Card style={{marginBottom: 24}} bordered={false}>
          <Layout style={{ background: '#fff' }}>
            <Content style={{ padding: '0 24px' }}>
              <div className={styles.tableList}>
                组态图
              </div>
            </Content>
          </Layout>
        </Card>
        <Card style={{marginBottom: 24}} bordered={false}>
          <Layout style={{ background: '#fff' }}>
            <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}>
              <ProjectTree {...projectPrams} />
            </Sider>
            <Content style={{ padding: '0 24px' }}>
              <div className={styles.tableList}>
                {this.renderTable()}
              </div>
            </Content>
          </Layout>
        </Card>
      </PageHeaderLayout>
    );
  }
}
