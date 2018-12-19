import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import EditableTable from '../../components/EditableTable'
import { getTableParams } from '../../utils/componentUtil';

import styles from './AlarmCategories.less';

@connect(({ alarmCategories, loading }) => ({
  alarmCategories,
  loading: loading.models.alarmCategories,
}))

export default class AlarmCategories extends PureComponent {
  state = {
    formValues:{},
    columns: [
      {
        title: '类型名称',
        dataIndex: 'name',
        width: '50%',
        editable: true,
        rules: [{ required: true, message: '请输入类型名称' }],
      },
    ],
  };

  componentWillMount(){
    const { dispatch } = this.props;
    const params = this.getFetchParams();
    dispatch({
      type: 'alarmCategories/fetch',
      payload: params,
    });
  };

  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.alarmCategories.data.pagination : pagination;
    const { formValues } = this.state;
    const tableParams = getTableParams(p, filtersArg, sorter);

    Object.assign(tableParams, formValues);
    return tableParams;
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'alarmCategories/fetch',
      payload: params,
    });
  };

  handleCreate = (fields) => {
    this.props.dispatch({
      type: 'alarmCategories/create',
      payload: { ...fields },
      callback: (response) => {
        if (response.success === true){
          message.success('添加成功');
          this.refreshTable();
        }else{
          message.success('操作失败');
        }
      },
    });
  };

  handleUpdate = (key, fields) => {
    this.props.dispatch({
      type: 'alarmCategories/update',
      payload: {
        id: parseInt(key, 10),
        ...fields,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('操作成功');
          this.refreshTable();
        }else{
          message.success('操作失败');
        }
      },
    });
  };

  handleDelete = (id) => {
    this.props.dispatch({
      type: 'alarmCategories/delete',
      payload: {
        id,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('操作成功');
          this.refreshTable();
        }else{
          message.success('操作失败');
        }
      },
    });
  };

  refreshTable =  () => {
    const params = this.getFetchParams();
    this.props.dispatch({
      type: 'alarmCategories/fetch',
      payload: params,
    });
  };

  render() {
    const { alarmCategories: {data: { list, pagination }} } = this.props;
    const { loading } = this.props;
    const propsPagination = {
      ...pagination,
      pageSize: pagination.page_size,
    };
    const dataList = [...list].map((data) => {
      return {
        ...data,
        key: data.id.toString(),
      }
    });
    return (
      <PageHeaderLayout title="警告类型">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <EditableTable
              columns={this.state.columns}
              data={dataList}
              pagination={propsPagination}
              loading={loading}
              onAdd={this.handleAdd}
              onCreate={this.handleCreate}
              onUpdate={this.handleUpdate}
              onDelete={this.handleDelete}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
