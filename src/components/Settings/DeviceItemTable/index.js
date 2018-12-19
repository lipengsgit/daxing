import React, { PureComponent } from 'react';
import {
  Tabs,
  Table,
  Divider,
  Popconfirm,
  Input,
  Button,
  Form,
  Row,
  Col,
  Modal,
  Icon,
  Checkbox,
  Radio,
} from 'antd';

import styles from './index.less';

const formItem1Layout = {
  labelCol: {
    md: { span: 7 },
    sm: { span: 7 },
  },
  wrapperCol: {
    md: { span: 17 },
    sm: { span: 24 },
  },
};
const formItem2Layout = {
  labelCol: {
    md: { span: 10 },
    sm: { span: 8 },
  },
  wrapperCol: {
    md: { span: 14 },
    sm: { span: 24 },
  },
};

const FormItem = Form.Item;
const EditableContext = React.createContext();
const {Provider} = EditableContext;

const DeviceItemEditableRow = ({ form, index, ...props }) => (
  <Provider value={form}>
    <tr {...props} />
  </Provider>
);

const DeviceTechParamsEditableRow = ({ form, index, ...props }) => (
  <Provider value={form}>
    <tr {...props} />
  </Provider>
);

const DeiceItemEditableFormRow = Form.create()(DeviceItemEditableRow);
const DeiceTechParamsEditableFormRow = Form.create()(DeviceTechParamsEditableRow);

class EditableItemCell extends PureComponent {

  render() {
    const {
      editing,
      requirement,
      dataIndex,
      title,
      record,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return editing ? (
            dataIndex === 'name'? (
              <td {...restProps} colSpan={8}>
                <Form layout="inline">
                  <FormItem {...formItem2Layout} label="名称">
                    {getFieldDecorator('name', {
                      rules: [{
                        required: true,
                        message: '请输入名称!',
                      }],
                      initialValue: record.name,
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItem2Layout} label="OPC点键">
                    {getFieldDecorator('item_key',{
                      rules: [
                        {
                          required: true,
                          message: '请输入点键',
                        },
                      ],
                      initialValue: record.item_key,
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItem2Layout} label="单位">
                    {getFieldDecorator('value_unit',{
                      rules: [
                        {
                          required: true,
                          message: '请输入单位',
                        },
                      ],
                      initialValue: record.value_unit,
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItem2Layout} label="类型">
                    {getFieldDecorator('value_type',{
                      rules: [
                        {
                          required: true,
                          message: '请输入类型',
                        },
                      ],
                      initialValue: record.value_type,
                    })(<Input />)}
                  </FormItem>

                  <FormItem {...formItem2Layout} label="上报频率">
                    {getFieldDecorator('frequency',{
                      initialValue: record.frequency,
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItem2Layout} label="显示规则">
                    {getFieldDecorator('display_rules',{
                      initialValue: record.display_rules,
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItem2Layout} label="报警级别">
                    {getFieldDecorator('alarm_level',{
                      initialValue: record.alarm_level,
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItem2Layout} label="APP编码">
                    {getFieldDecorator('app_item_code',{
                      initialValue: record.app_item_code,
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItem2Layout} label="modbus编码">
                    {getFieldDecorator('modbus_code',{
                      initialValue: record.modbus_code,
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItem2Layout} label="表达式">
                    {getFieldDecorator('representation',{
                      initialValue: record.representation,
                    })(<Input />)}
                  </FormItem>
                  <FormItem {...formItem2Layout} label="倍数">
                    {getFieldDecorator('multiple',{
                      initialValue: record.multiple,
                    })(<Input />)}
                  </FormItem>
                </Form>

              </td>
            ):(
              null
            )
          ) : (
            <td>{restProps.children}</td>
          )

        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableCell extends PureComponent {

  render() {
    const {
      editing,
      requirement,
      dataIndex,
      title,
      record,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: requirement,
                      message: `请输入${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(<Input />)}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}




// =======================  报警配置Form ==============================//
// 数字报警配置
const CreateBoolAlarmForm = Form.create()(props => {
  const { modalVisible, form, recordData, handleAdd, handleModalVisible } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const params = {
        ...fieldsValue,
        ...{alarm_type:1},
      }
      handleAdd(params);
    });
  };
  return (
    <Modal
      title="数字报警设置"
      className={styles.alarmModal}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
    >
      <Form onSubmit={okHandle} layout="inline">
        <Row>
          <Col md={24} sm={24} style={{color:'#000', fontSize: 'bold'}}>
            点名称：{recordData.name}
          </Col>
        </Row>
        <Row>
          <FormItem label="离散报警设置">
            {getFieldDecorator('alarm_enable')(<Checkbox>报警使能</Checkbox>)}
          </FormItem>
        </Row>
        <Row>
          <FormItem label="报警值" required>
            {getFieldDecorator('data1',{
              rules: [
                {
                  required: true,
                  message: '请选择报警值',
                },
              ],
            })(
              <Radio.Group>
                <Radio value="true">True</Radio>
                <Radio value="false">False</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem label="优先级" required>
            {getFieldDecorator('data2',{
              rules: [
                {
                  required: true,
                  message: '请输入优先级',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Row>
        <Row className={styles.alarmModalButton}>
          <Col md={24} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={()=>handleModalVisible()}>
                取消
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    </Modal>

  );
});
// 模拟报警配置
const CreateNonBoolAlarmForm = Form.create()(props => {
  const { modalVisible, form, recordData, handleAdd, handleModalVisible } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      console.info(fieldsValue);
      const params = {
        ...fieldsValue,
        ...{alarm_type:2},
      }
      handleAdd(params);
    });
  };
  return (
    <Modal
      title="模拟报警设置"
      className={styles.alarmModal}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
    >

      <Form onSubmit={okHandle} layout="inline">
        <Row>
          <Col md={24} sm={24} style={{color:'#000', fontSize: 'bold'}}>
            点名称：{recordData.name}
          </Col>
        </Row>
        <Row>
          <FormItem label="模拟报警设置" required>
            {getFieldDecorator('alarm_enable')(<Checkbox>报警使能</Checkbox>)}
          </FormItem>
        </Row>
        <Row gutter={0}>
          <Col md={8} sm={24}>
            <FormItem {...formItem1Layout} label="低低" required>
              {getFieldDecorator('data1',{
                rules: [
                  {
                    required: true,
                    message: '请输入界限值',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItem2Layout} label="优先级" required>
              {getFieldDecorator('data2',{
                rules: [
                  {
                    required: true,
                    message: '请输入优先级',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            1-999（1最小）
          </Col>
        </Row>
        <Row gutter={0}>
          <Col md={8} sm={24}>
            <FormItem {...formItem1Layout} label="低">
              {getFieldDecorator('data3')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItem2Layout} label="优先级">
              {getFieldDecorator('data4')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            1-999（1最小）
          </Col>
        </Row>
        <Row gutter={0}>
          <Col md={8} sm={24}>
            <FormItem {...formItem1Layout} label="高">
              {getFieldDecorator('data5')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItem2Layout} label="优先级">
              {getFieldDecorator('data6')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            1-999（1最小）
          </Col>
        </Row>
        <Row gutter={0}>
          <Col md={8} sm={24}>
            <FormItem {...formItem1Layout} label="高高">
              {getFieldDecorator('data7')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem {...formItem2Layout} label="优先级">
              {getFieldDecorator('data8')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            1-999（1最小）
          </Col>
        </Row>
        <Row className={styles.alarmModalButton}>
          <Col md={24} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={()=>handleModalVisible()}>
                取消
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    </Modal>

  );
});


export default class DeviceItemTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      itemData: this.wrapperData(this.props.data.device_item),
      paramsData: this.wrapperData(this.props.data.device_tech_params),

      editingItemKey: '',
      editingParamsKey: '',

      isItemAdd: false,
      isParamsAdd: false,

      alarmBoolModal: false,
      alarmBoolModalData: '',
      alarmNonBoolModal: false,
      alarmNonBoolModalData: '',

      expandedRowKeys: [],

    };

  };

  // 给数据增加Key字段
  wrapperData = (data) => {
    if(data === undefined || data === null) return [];
    return data.map((item) => {
      return {
        ...item,
        ...{
          "key": item.id,
          "expanded": false,
        },
      };
    });
  };

  // ============================ 设备点表格 ====================================//
  isDeviceItemEditing = (record) => {
    return record.key === this.state.editingItemKey;
  };

  // 编辑行数据
  editDeviceItem = (key) => {
    this.setState({ editingItemKey: key });
    const newData = [...this.state.itemData];
    const index = newData.findIndex(item => {
      return item.isNew ? item.isNew : false;
    });
    if(index > -1){
      newData.splice(index, 1);
      this.setState({ isItemAdd: false });
    }
    this.setState({ itemData: newData});
  };

  // 保存行数据
  saveDeviceItem = (form, key, isUpdate = false) =>{
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.itemData];
      const index = newData.findIndex(item => parseInt(key,10) === parseInt(item.key,10));
      if (index > -1) {
        const item = newData[index];
        delete item.isNew;
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ itemData: newData, editingItemKey: '' });
      } else {
        newData.push(this.state.itemData);
        this.setState({ itemData: newData, editingItemKey: '' });
      }
      if(isUpdate){
        // const {dispatch} = this.props;
        // dispatch({
        //   type: 'device/updateDeviceItem',
        //   payload: newData,
        // });
      }else {
        // const {dispatch} = this.props;
        // dispatch({
        //   type: 'device/addDeviceItem',
        //   payload: newData,
        // });
      }

    });
  };
  // 取消编辑
  cancelDeviceItem = () => {
    this.setState({ editingItemKey: '' });
  };
  newDeviceItem = (e) => {
    e.preventDefault();
    if (this.state.isItemAdd) return;
    const newData = this.state.itemData.map(item => ({ ...item }));
    let key = 0;
    if(newData.length > 0) key = (parseInt(newData[newData.length-1].key, 10) + 1).toString();
    newData.push({
      key: `${key}`,
      id: '',
      name: '',
      device_id: '',
      item_key: '',
      value_unit: '',
      value_type: '',
      display_rules: '',
      frequency: '',
      alarm_category_id: '',
      alarm_level: '',
      modbus_code: '',
      isNew: true,
    });
    this.editDeviceItem(key);
    this.setState({ itemData: newData });
    this.setState({ isItemAdd: true });
  };
  removeNewDeviceItem = (key) => {
    const newData = this.state.itemData.filter(item => parseInt(item.key,10) !== parseInt(key,10) );
    this.setState({ itemData: newData });
    this.setState({ isItemAdd: false });
    this.cancelDeviceItem();
  };
  removeDeviceItem = (id) => {
    console.info('removeDeviceItem');
    console.info(id);
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'device/removeDeviceItem',
    //   payload: {id: id},
    // });
  };


  toggleAlarmConfig = (record) => {
    if(!record.value_type){
      return;
    }
    if(record.value_type === 'bool'){
      this.setState({ alarmBoolModalData: record });
      this.handleBoolModalVisible(true);
    }else{
      this.setState({ alarmNonBoolModalData: record });
      this.handleNonBoolModalVisible(true);
    }

  };
  handleBoolModalVisible = (flag) =>{
    console.info('handleBoolModalVisible');
    this.setState({
      alarmBoolModal: !!flag,
    });
  };
  handleNonBoolModalVisible = (flag) =>{
    console.info('handleNonBoolModalVisible');
    this.setState({
      alarmNonBoolModal: !!flag,
    });
  };
  // 报警数据添加
  handleAlarmFormAdd = (params) => {
    console.info('handleAlarmFormAdd');
    console.info(params);
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'device/add',
    //   payload: params,
    // });
  };

  handleExpandDeviceItemRow = (record, e) => {
    e.preventDefault();
    console.info('handleExpandDeviceItemRow');
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
  expandedDeviceItemRowRender = (record) =>{
    console.info('expandedDeviceItemRowRender');
    return (
      <div className='shrInfo'>
        <p className={styles.deviceItemDetail}>
          <span>点名称:{record.name}</span>
          <span>点键:{record.item_key}</span>
          <span>单位:{record.value_unit}</span>
          <span>类型:{record.value_type}</span>
          <span>上报频率:{record.frequency}</span>
          <span>显示规则:{record.display_rules}</span>
          <span>警告类型:{record.alarm_category_id}</span>
          <span>警告级别:{record.alarm_level}</span>
          <span>APP编码:{record.app_item_code}</span>
        </p>
        <p className={styles.deviceItemDetail}>
          <span>modbus编码:{record.modbus_code}</span>
          <span>modbus表示法:{record.representation}</span>
          <span>倍数:{record.multiple}</span>
        </p>
      </div>
    );
  };
  // ============================ 设备点表格 ====================================//




  // ============================ 设备技术参数表格 ====================================//
  isDeviceTechParamsEditing = (record) => {
    return record.key === this.state.editingParamsKey;
  };

  // 编辑行数据
  editDeviceTechParams = (key) => {
    this.setState({ editingParamsKey: key });
    const newData = [...this.state.paramsData];
    const index = newData.findIndex(item => {
      return item.isNew ? item.isNew : false;
    });
    if(index > -1){
      newData.splice(index, 1);
      this.setState({ isParamsAdd: false });
    }

    this.setState({ paramsData: newData});
  };

  // 保存行数据
  saveDeviceTechParams = (form, key, isUpdate = false) =>{
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.paramsData];
      const index = newData.findIndex(item => parseInt(key,10) === parseInt(item.key,10));
      if (index > -1) {
        const item = newData[index];
        delete item.isNew;
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        this.setState({ paramsData: newData, editingParamsKey: '' });
      } else {
        newData.push(this.state.paramsData);
        this.setState({ paramsData: newData, editingParamsKey: '' });
      }
      if(isUpdate){
        // const {dispatch} = this.props;
        // dispatch({
        //   type: 'device/updateDeviceTechParams',
        //   payload: newData,
        // });
      }else {
        // const {dispatch} = this.props;
        // dispatch({
        //   type: 'device/addDeviceTechParams',
        //   payload: newData,
        // });
      }
    });
  };
  // 取消编辑
  cancelDeviceTechParams = () => {
    this.setState({ editingParamsKey: '' });
  };
  newDeviceTechParams = (e) => {
    e.preventDefault();
    if(this.state.isParamsAdd) return;
    const newData = this.state.paramsData.map(item => ({ ...item }));
    let key = 0;
    if(newData.length > 0) key = (parseInt(newData[newData.length-1].key,10) + 1).toString();
    newData.push({
      key: `${key}`,
      id: '',
      name: '',
      tech_value: '',
      remark: '',
      isNew: true,
    });
    this.editDeviceTechParams(key);
    this.setState({ paramsData: newData });
    this.setState({ isParamsAdd: true });
  };
  removeNewDeviceTechParams = (key) => {
    const newData = this.state.paramsData.filter(item => parseInt(item.key,10) !== parseInt(key,10) );
    this.setState({ paramsData: newData });
    this.setState({ isParamsAdd: false });
    this.cancelDeviceTechParams();
  };
  removeDeviceTechParams = (id) => {
    console.info('removeDeviceTechParams');
    console.info(id);
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'device/removeDeviceTeachParams',
    //   payload: {id: id},
    // });
  };
  // ============================ 设备技术参数表格 ====================================//



  // =============== 设备点列表 =================================／／
  renderDeviceItemColumn(){
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: '10%',
        editable: true,
        requirement: true,
        render(val, record) {
          return (
            <span>
              {record.device_item_alarm_config ? (
                parseInt(record.device_item_alarm_config.alarm_enable,10) === 1 ? (
                  <span>
                    <Icon type="bell" style={{ color: "red" }} />
                    {val}
                  </span>
                ) : (
                  <span>
                    <Icon type="bell" style={{ color: "#1890ff" }} />
                    {val}
                  </span>
                )
              ) : (
                val
              )}
            </span>
          );
        },
      },
      {
        title: '单位',
        dataIndex: 'value_unit',
        width: '10%',
        editable: true,
        requirement: true,
      },
      {
        title: '类型',
        dataIndex: 'value_type',
        width: '10%',
        editable: true,
        requirement: true,
      },
      {
        title: '上报频率',
        dataIndex: 'frequency',
        width: '10%',
        editable: true,
      },
      {
        title: '显示规则',
        dataIndex: 'display_rules',
        width: '10%',
        editable: true,
      },
      {
        title: '警告类型',
        dataIndex: 'alarm_category',
        width: '10%',
        editable: true,
      },
      {
        title: '警告级别',
        dataIndex: 'alarm_level',
        width: '10%',
        editable: true,
      },
      {
        title: 'APP编码',
        dataIndex: 'app_item_code',
        width: '10%',
        editable: true,
      },
      {
        title: '操作',
        width: '20%',
        render: (text, record) => {
          const editable = this.isDeviceItemEditing(record);
          return (
            <div>
              {editable ? (
                record.isNew ? (
                  <span>
                    <EditableContext.Consumer>
                      {form => (
                        <a href="javascript:void(0);" onClick={() => this.saveDeviceItem(form, record.key)} >
                          保存
                        </a>
                      )}
                    </EditableContext.Consumer>
                    <Divider type="vertical" />
                    <Popconfirm title="是否要删除？" onConfirm={() => this.removeNewDeviceItem(record.key)}>
                      <a>删除</a>
                    </Popconfirm>
                  </span>
                ) : (
                  <span>
                    <EditableContext.Consumer>
                      {form => (
                        <a href="javascript:void(0);" onClick={() => this.saveDeviceItem(form, record.key, true)} >
                          保存
                        </a>
                      )}
                    </EditableContext.Consumer>
                    <Divider type="vertical" />
                    <a href="javascript:void(0);" onClick={() => this.cancelDeviceItem()} >
                      取消
                    </a>
                  </span>
                )
              ) : (
                <span>
                  <a onClick={() => this.editDeviceItem(record.key)}>编辑</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.removeDeviceItem(record.id)}>
                    <a className={styles.tableListDelete}>删除</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <a className={styles.tableListDelete} onClick={() => this.toggleAlarmConfig(record)}>报警配置</a>
                  <Divider type="vertical" />
                  {record.expanded ? (
                    <a href="#" onClick={(e) => this.handleExpandDeviceItemRow(record, e)}>
                      <Icon type="up" style={{ color: "blue" }} />
                    </a>
                  ) : (
                    <a href="#" onClick={(e) => this.handleExpandDeviceItemRow(record, e)}>
                      <Icon type="down" style={{ color: "blue" }} />
                    </a>
                  )}
                </span>

              )}
            </div>
          );
        },
      },
    ];

    return columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isDeviceItemEditing(record),
          requirement: col.requirement,
        }),
      };
    });

  };


  // =============== 设备点列表 =================================／／
  renderDeviceTechParamsColumn(){
    const columns = [
      {
        title: '参数名称',
        dataIndex: 'name',
        width: '20%',
        editable: true,
        requirement: true,
      },
      {
        title: '技术参数',
        dataIndex: 'tech_value',
        width: '20%',
        editable: true,
        requirement: true,
      },
      {
        title: '补充说明',
        width: '40%',
        dataIndex: 'remark',
        editable: true,
        requirement: false,

      },
      {
        title: '操作',
        width: '20%',
        render: (text, record) => {
          const editable = this.isDeviceTechParamsEditing(record);
          return (
            <div>
              {editable ? (
                record.isNew ? ( // 新增
                  <span>
                    <EditableContext.Consumer>
                      {form => (
                        <a href="javascript:void(0);" onClick={() => this.saveDeviceTechParams(form, record.key)} >
                          保存
                        </a>
                      )}
                    </EditableContext.Consumer>
                    <Divider type="vertical" />
                    <Popconfirm title="是否要删除？" onConfirm={() => this.removeNewDeviceTechParams(record.key)}>
                      <a>删除</a>
                    </Popconfirm>
                  </span>
                ) : ( // 编辑
                  <span>
                    <EditableContext.Consumer>
                      {form => (
                        <a href="javascript:void(0);" onClick={() => this.saveDeviceTechParams(form, record.key, true)} >
                          保存
                        </a>
                      )}
                    </EditableContext.Consumer>
                    <Divider type="vertical" />
                    <a href="javascript:void(0);" onClick={() => this.cancelDeviceTechParams()} >
                      取消
                    </a>
                  </span>
                )
              ) : (
                <span>
                  <a onClick={() => this.editDeviceTechParams(record.key)}>编辑</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.removeDeviceTechParams(record.id)}>
                    <a className={styles.tableListDelete}>删除</a>
                  </Popconfirm>
                </span>

              )}
            </div>
          );
        },
      },
    ];

    return columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isDeviceTechParamsEditing(record),
          requirement: col.requirement,
        }),
      };
    });

  };

  // =============== 列表 =================================／／



  render() {
    const {rowKey} = this.props;

    const itemComponents = {
      body: {
        row: DeiceItemEditableFormRow,
        cell: EditableItemCell,
      },
    };

    const paramsComponents = {
      body: {
        row: DeiceTechParamsEditableFormRow,
        cell: EditableCell,
      },
    };

    const boolFormParams = {
      handleAdd: this.handleAlarmFormAdd,
      handleModalVisible: this.handleBoolModalVisible,
      recordData: this.state.alarmBoolModalData,
    };

    const nonBoolFormParams = {
      handleAdd: this.handleAlarmFormAdd,
      handleModalVisible: this.handleNonBoolModalVisible,
      recordData: this.state.alarmNonBoolModalData,
    };

    return (
      <div className={styles.standardTable}>
        <Tabs defaultactivekey="1">
          <Tabs.TabPane tab="管理监控设备点" key="1">
            <div>
              <Table
                components={itemComponents}
                dataSource={this.state.itemData}
                columns={this.renderDeviceItemColumn()}
                rowKey={rowKey || 'key'}
                pagination={false}
                expandedRowKeys={this.state.expandedRowKeys}
                expandIconAsCell={false}
                expandedRowRender={(record)=>this.expandedDeviceItemRowRender(record)}
              />
              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="dashed"
                onClick={e => this.newDeviceItem(e)}
                icon="plus"
              >
                添加
              </Button>
            </div>
            <CreateBoolAlarmForm {...boolFormParams} modalVisible={this.state.alarmBoolModal} />
            <CreateNonBoolAlarmForm {...nonBoolFormParams} modalVisible={this.state.alarmNonBoolModal} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="管理设备技术参数" key="2">
            <div>
              <Table
                components={paramsComponents}
                dataSource={this.state.paramsData}
                columns={this.renderDeviceTechParamsColumn()}
                rowKey={rowKey || 'key'}
                pagination={false}
              />
              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="dashed"
                onClick={e => this.newDeviceTechParams(e)}
                icon="plus"
              >
                添加
              </Button>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  };
}
