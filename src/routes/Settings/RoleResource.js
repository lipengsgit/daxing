import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Card,
  Button,
  message,
  Table,
  Checkbox,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Roles.less';

const CheckboxGroup = Checkbox.Group;

@connect(({ roles, loading }) => ({
  roles,
  loading: loading.models.rule,
}))

export default class RoleResource extends React.Component {

  constructor(props){
    super(props);
    const { dispatch } = this.props;
    dispatch({
      type: 'roles/fetchResources',
      payload: {
      },
    });
    dispatch({
      type: 'roles/getInfo',
      payload: {
        id: this.props.match.params.id,
      },
      callback: (response) => {
        this.setState({
          checkedIds: response.data.resources ? response.data.resources.map((resource) => {return resource.id}) : [],
        })
      },
    });
  }

  state = {
    defaultExpandAll: true,
    checkedIds: [],
    childAssociate: true,
    parentAssociate: true,
    optionAssociate: true,
  };

  handleSave = () => {
    const { roleInfo } = this.props.roles;
    this.props.dispatch({
      type: 'roles/updateResource',
      payload: {
        id: roleInfo.id,
        name: roleInfo.name,
        role_type: roleInfo.role_type,
        resource: this.state.checkedIds,
      },
      callback: () => {
        message.success('操作成功');
        this.handleBack();
      },
    });
  }

  handleBack = () => {
    const { state } = this.props.location;
    this.props.dispatch(routerRedux.push({
      pathname: '/settings/roles',
      state,
    }));
  }

  handleCheckBoxChange = (checkedValues) => {
    const checked = checkedValues === null ? [] : checkedValues;
    this.setState({
      checkedIds: checked,
    })
  }

  render() {
    const { roles: { roleInfo, resources } } = this.props;
    const title = roleInfo.name ;
    const { checkedIds } = this.state;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: '50%',
      },
      {
        title: '操作',
        render: (text, record) => {
          let { options } = record;
          if (options){
            options = options.map(item => {
              return {
                label: item.name,
                value: item.id,
              };
            });
          }
          return options && (
            <Fragment>
              <CheckboxGroup options={options} onChange={this.handleCheckBoxChange} value={checkedIds} />
            </Fragment>
          )
        },
      },
    ];

    const changeSelected = (id, selected) => {
      const checked = this.state.checkedIds;
      const index = checked.indexOf(id);
      if(selected && index === -1){
        checked.push(id);
        this.setState({
          checkedIds: checked,
        })
      }else if(!selected && index > -1){
        checked.splice(index, 1);
        this.setState({
          checkedIds: checked,
        })
      }
    }

    const findResource = (array, id) => {
      for (const item of array) {
        if(item.id === id){
          return item;
        }
        if(item.children){
          const ret = findResource(item.children, id)
          if(ret !== null){
            return ret
          }
        }
      }
      return null;
    }

    const parentAssociate = (id, selected, node) => {
      // 反选不对上级作关联操作
      if(!selected) return;
      let currentNode = node;
      if(!currentNode){
        currentNode = findResource(resources, id);
      }
      if(currentNode && currentNode.pid !== null && currentNode.pid !== undefined){
        const parentNode = findResource(resources, currentNode.pid);
        if(parentNode){
          changeSelected(parentNode.id, selected);
          parentAssociate(parentNode.id, selected, parentNode);
        }
      }
    }

    const childAssociate = (id, selected, node) => {
      let currentNode = node;
      if(!currentNode){
        currentNode = findResource(resources, id);
      }
      if(currentNode.children){
        for (const childNode of currentNode.children) {
          changeSelected(childNode.id, selected);
          if(this.state.optionAssociate) optionAssociate(childNode.id, selected, childNode);

          childAssociate(childNode.id, selected, childNode);
        }
      }
    }

    const optionAssociate = (id, selected, node) => {
      let currentNode = node;
      if(!currentNode){
        currentNode = findResource(this.props.roles.resources, id);
      }
      if(currentNode.options){
        for (const option of currentNode.options) {
          changeSelected(option.id, selected);
        }
      }
    }

    const rowSelection = {
      selectedRowKeys: checkedIds,
      onSelect: (record, selected) => {
        changeSelected(record.id, selected);
        // 关联操作
        if(this.state.optionAssociate) optionAssociate(record.id, selected, record);

        // 关联上级选择
        if(this.state.parentAssociate) parentAssociate(record.id, selected, record);
        // 关联下级选择
        if(this.state.childAssociate) childAssociate(record.id, selected, record);

      },
    }

    return (
      <PageHeaderLayout title={title} >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Table
                columns={columns}
                defaultExpandAllRows={this.state.defaultExpandAll}
                rowSelection={rowSelection}
                dataSource={resources}
                rowKey='id'
                pagination={false}
                scroll={{y: 400}}
              />
            </div>

            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleSave()}>
                保存
              </Button>

              <Button type="primary" onClick={() => this.handleBack()}>
                返回
              </Button>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
