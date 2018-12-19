import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Divider,
  DatePicker,
  Radio,
  Popconfirm,
  InputNumber,
} from 'antd';
import moment from 'moment';

import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Subsystem.less';


const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleCreate, handleUpdate, handleModalVisible, Info, readOnly ,loadings,proxyTypeList} = props;
  const title = Info.id === undefined || Info.id === null ? '新建' : '编辑';
  const proxyTypes=proxyTypeList.map(item => <Radio key={item.id} value={item.param_value}>{item.param_name}</Radio>);
  const okHandle = () => {
    if(readOnly){
      handleModalVisible();
    }else{
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if( fieldsValue.overtime !==undefined &&fieldsValue.overtime !==null){
          Object.defineProperty(fieldsValue,"overtime",{value :fieldsValue.overtime.format('YYYY-MM-DD')})
        }
        if (Info.id !== null && Info.id !== undefined) {
          handleUpdate(fieldsValue);
        }else{
          handleCreate(fieldsValue);
        }
      });
    }
  };



  function onInputNumberChange(value) {
    console.log('changed', value);
  }


  return (
    <Modal
      destroyOnClose
      title={title}
      visible={modalVisible}
      footer={[
        <Button key="back" onClick={()=>handleModalVisible()}>取消</Button>,
        <Button key="submit" type="primary" loading={loadings} onClick={okHandle}>
          确定
        </Button>,
      ]}
      // 右上角X取消
      onCancel={() => handleModalVisible()}
    >
      <FormItem>
        {form.getFieldDecorator('id', {
          initialValue: Info.id,
        })(<Input type="hidden"  />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          initialValue: Info.name,
          rules: [{ required: true, message: '请输入名称' }],
        })(<Input    placeholder={Info.name} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label="代理类型">
        {form.getFieldDecorator('delegate_category', {
          initialValue: `${Info.delegate_category}`,
          rules: [{ required: true, message: '请选择代理类型' }],
        })(
          <Radio.Group>
            {proxyTypes}
          </Radio.Group>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="代理IP">
        {form.getFieldDecorator('delegate_ip', {
          initialValue: Info.delegate_ip,
        })(<Input     placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="代理端口">
        {form.getFieldDecorator('delegate_port', {
          initialValue: Info.delegate_port,
        })(<Input  placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('delegate_username', {
          initialValue: Info.delegate_username,
        })(<Input  placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
        {form.getFieldDecorator('delegate_password', {
          initialValue: Info.delegate_password,
        })(<Input  placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="服务器名称">
        {form.getFieldDecorator('obj_name', {
          initialValue: Info.obj_name,
        })(<Input    placeholder="请输入" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="超时时间">
        {form.getFieldDecorator('overtime', {
          initialValue: Info.overtime ? moment(Info.overtime) : null,

        })(<DatePicker  />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="起始地址  ">
        {form.getFieldDecorator('start_address', {
          initialValue: Info.start_address,
        })(<Input  placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="从机地址">
        {form.getFieldDecorator('slave_address', {
          initialValue:Info.slave_address,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="字节顺序">
        {form.getFieldDecorator('little_endian', {
          initialValue :Info.little_endian,
        })(<InputNumber placeholder="请输入"    parser={value => value.replace(/\D/g, '')} />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remark', {
          initialValue: Info.remark,
        })(<Input   placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );


});

@connect(({ subsystem, loading }) => ({
  subsystem,
  loading: loading.models.subsystem,
}))
@Form.create()
export default class Subsystem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      formValues: {},
      formReadOnly: false,
      isedit:false,
    };

    const propState = this.props.location.state;
    if (propState !== undefined){
      this.state.formValues = propState.formValues;
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const params = this.getFetchParams();
    dispatch({
      type: 'subsystem/fetch',
      payload: params,
    });
    dispatch({
      type:'subsystem/fetchProxyType',
      payload:{param_type:'delegate_category'},
    });
  }

  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.subsystem.data.pagination : pagination;
    const { formValues } = this.state;

    let filters = {};
    if(filtersArg){
      filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
      }, {});
    }

    const params = {
      ...formValues,
      ...filters,
    };
    if(p && p.current){
      params.page = p.current;
    }
    if(p && p.page_size){
      if(p.page_size===p.pageSize){
        params.per_page = p.page_size;
      }else{
        params.per_page = p.pageSize;
      }

    }
    if (sorter && sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    return params;
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'subsystem/fetch',
      payload: params,
    });
  };


  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = () => {
    this.props.dispatch({
      type: 'subsystem/show_add',
      callback: () => {
        this.setState({
          formReadOnly: false,
          isedit :false,
        });
        this.handleModalVisible(true);
      //  const ref = Modal.info();
       // ref.destroy();
      },
    });
  }

  handleCreate = fields => {
    this.props.dispatch({
      type: 'subsystem/add',
      payload: {
        data:fields,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('添加成功');
          this.setState({
            modalVisible: false,
          });

          this.refreshTable();
        }else{
          message.success('操作失败');
        }
      },
    });
  };



  handleEdit = (no, e) => {
    e.preventDefault();
    this.props.dispatch({
      type: 'subsystem/getInfo',
      payload: {
        id: no,
      },
      callback: () => {
        this.handleModalVisible(true);
        this.setState({
          formReadOnly: false,
          isedit :true,
        });
      },
    });
  };

  handleUpdate = fields => {
    this.props.dispatch({
      type: 'subsystem/update',
      payload: {
        data:fields,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('操作成功');
          this.setState({
            modalVisible: false,
          });

          this.refreshTable();
        }else{
          message.error('操作失败');
        }
      },
    });
  };

  handleDelete = (no) => {
    this.props.dispatch({
      type: 'subsystem/remove',
      payload: {
        id: no,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('删除成功');
          this.refreshTable();
        }else{
          message.error('删除失败');
        }
      },
    });

  };

  refreshTable =  () => {
    const params = this.getFetchParams();
    this.props.dispatch({
      type: 'subsystem/fetch',
      payload: params,
    });
  }



  render() {
    const { subsystem: { data, systemInfo,proxyType }, loading } = this.props;
    const {  modalVisible, formReadOnly} = this.state;
    const edit = this.handleEdit;
    const remove = this.handleDelete;
    const columns = [

      {
        title: '名称',
        dataIndex: 'name',
        key :'name',
      },
      {
        title: '代理类型',
        dataIndex: 'delegate_category_name',
        key :'delegate_category_name',
      },
      {
        title: '代理IP',
        dataIndex: 'delegate_ip',
        key:'delegate_ip',

      },
      {
        title: '代理端口',
        dataIndex: 'delegate_port',
        key:'delegate_port',
      },
      {
        title: '用户名',
        dataIndex: 'delegate_username',
        key:'delegate_username',
      },
      {
        title: '密码',
        dataIndex: 'delegate_password',
        key:'delegate_password',

      },
      {
        title: '对象服务器名称',
        dataIndex: 'obj_name',
        key:'obj_name',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key:'remark',
      },


      {
        title: '操作',
        render: (text, record) => {
              return (
                <Fragment>
                  <a href="#" onClick={(e) => edit(record.id, e)} >编辑</a>
                  <Divider type="vertical" />
                  <Popconfirm title="确定要删除吗？" onConfirm={() => remove(record.id)} >
                    <a href="#" >删除</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                </Fragment>
          )
        },
      },
    ];

    const parentMethods = {
      handleUpdate: this.handleUpdate,
      handleCreate: this.handleCreate,
      handleModalVisible: this.handleModalVisible,
      Info: systemInfo,
      readOnly: formReadOnly,
      isedit :this.state.isedit,
      loadings:loading,
      proxyTypeList:proxyType,
    };

    return (
      <PageHeaderLayout title="子系统配置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                新建
              </Button>
            </div>
            <StandardTable
              needShowSelect={false}
              needRowSelection={false}
              selectedRows={false}
              loading={loading}
              data={data}
              columns={columns}
           //   onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey='id'
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
