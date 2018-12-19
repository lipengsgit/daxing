import React from 'react';
import moment from 'moment';
import uuid from 'uuid';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Radio,
  Select,
  DatePicker,
  Modal,
  Tree,
} from 'antd';
import styles from './DeviceInfoForm.less';
import CommonUpload from '../../Uploader/CommonUpload';

export default class DeviceInfoForm extends React.Component {

  constructor(props){
    super(props);

    const {deviceInfo, operate} = this.props;
    if(operate === 'add') deviceInfo.folder_no = uuid();

    const selectedPositionKey = deviceInfo.position_id ? [deviceInfo.position_id.toString()] : [];
    this.state = {
      modalVisible: false,
      defaultExpandAll: true,
      tmpPositionSelect: null,
      selectedPositionKey,
      deviceInfo,
    }
  }

  handleSave = () => {
    const {deviceInfo} = this.state;
    const { form, operate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();

      const values = {
        ...fieldsValue,
        project_id: deviceInfo.project_id,
        install_date: fieldsValue.install_date ? fieldsValue.install_date.format('YYYY-MM-DD') : null,
        use_date: fieldsValue.use_date ? fieldsValue.use_date.format('YYYY-MM-DD') : null,
        quality_start_date: fieldsValue.quality_start_date ? fieldsValue.quality_start_date.format('YYYY-MM-DD') : null,
        quality_end_date: fieldsValue.quality_end_date ? fieldsValue.quality_end_date.format('YYYY-MM-DD') : null,
      };

      if(operate === 'add') values.position_id = deviceInfo.position_id;
      if(operate === 'edit') values.id = deviceInfo.id;

      const positionName = values.position_name;
      delete values.position_name;

      this.props.onSubmitForm(values, positionName);
    });
  };

  handleBack = () => {
    this.props.onBack();
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      tmpPositionSelect: null,
    });
  };

  okHandle = () => {
    const {tmpPositionSelect} = this.state;
    if(tmpPositionSelect !== null){
      this.props.form.setFieldsValue({
        position_id: tmpPositionSelect.id,
        position_name: tmpPositionSelect.name,
      });
      this.setState({
        selectedPositionKey: [tmpPositionSelect.id.toString()],
      });
    }

    this.handleModalVisible();
  }

  renderTree(){
    const { TreeNode } = Tree;
    const { positions } = this.props;

    const renderTreeNodes = (data) => {
      return data && data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.name} key={item.id} dataRef={item}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.name} key={item.id} dataRef={item} />;
      });
    };

    const treeSelect = (selectedKeys, info) => {
      this.setState({
        tmpPositionSelect: info.node.props.dataRef,
      })
      // this.setState({
      //   positionId: info.node.props.eventKey,
      // }, this.handleFormReset)
    };

    return (
      <Tree
        showLine
        onSelect={treeSelect}
        defaultExpandAll={this.state.defaultExpandAll}
        defaultSelectedKeys={this.state.selectedPositionKey}
      >
        {renderTreeNodes(positions)}
      </Tree>
    );
  }

  renderModal() {
    const title = '选择设备位置';
    const { modalVisible } = this.state;

    return (
      <Modal
        title={title}
        visible={modalVisible}
        onOk={() => this.okHandle()}
        onCancel={() => this.handleModalVisible()}
      >
        {this.renderTree()}
      </Modal>
    );
  }

  render() {
    const FormItem = Form.Item;
    const RadioGroup = Radio.Group;
    const { Option } = Select;

    const { deviceInfo } = this.state;
    const { form: {getFieldDecorator}, deviceStatesOptions, operate } = this.props;
    const typeOptions = this.props.deviceTypeOptions.map(d => <Option key={d.id} title={d.name}>{d.name}</Option>);
    const delegateOptions = this.props.delegateOptions.map(d => <Option key={d.id} title={d.name}>{d.name}</Option>);

    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
    };
    const colLayout = { xs: 24, sm: 12, md: 12 };

    return (
      <div>
        <Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="设备名称">
                {getFieldDecorator('name', {
                  initialValue: deviceInfo.name,
                  rules: [{ required: true, message: '请输入设备名称' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="设备类型">
                {getFieldDecorator('device_category_id', {
                  initialValue: deviceInfo.device_category_id ? deviceInfo.device_category_id.toString() : undefined,
                  rules: [{ required: true, message: '请输入设备类型' }],
                })(
                  <Select placeholder="请选择" showSearch optionFilterProp='title'>
                    {typeOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="代理">
                {getFieldDecorator('delegate_id', {
                  initialValue: deviceInfo.delegate_id ? deviceInfo.delegate_id.toString() : undefined,
                  rules: [{ required: true, message: '请输入代理' }],
                })(
                  <Select placeholder="请选择" showSearch optionFilterProp='title'>
                    {delegateOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="设备型号">
                {getFieldDecorator('device_model', {
                  initialValue: deviceInfo.device_model,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>

            { operate === 'edit' ?
              (
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label="设备位置">
                    {getFieldDecorator('position_name', {
                      initialValue: deviceInfo.position_name,
                    })(<Input onClick={this.handleModalVisible} readOnly />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="设备位置" style={{display:'none'}}>
                    {getFieldDecorator('position_id', {
                      initialValue: deviceInfo.position_id,
                      rules: [],
                    })(<Input type='hidden' />)}
                  </FormItem>
                </Col>
              ) : (
                <Col {...colLayout}>
                  <FormItem {...formItemLayout} label="设备位置">
                    {this.props.deviceInfo.position_name}
                  </FormItem>
                </Col>
              )
            }

            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="设备编号">
                {getFieldDecorator('device_no', {
                  initialValue: deviceInfo.device_no,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>

            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="设备厂家">
                {getFieldDecorator('manufacturer', {
                  initialValue: deviceInfo.manufacturer,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="厂家电话">
                {getFieldDecorator('manufacturer_phone', {
                  initialValue: deviceInfo.manufacturer_phone,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="厂家地址">
                {getFieldDecorator('manufacturer_address', {
                  initialValue: deviceInfo.manufacturer_address,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="安装日期">
                {getFieldDecorator('install_date', {
                  initialValue: deviceInfo.install_date ? moment(deviceInfo.install_date) : null,
                  rules: [],
                })(<DatePicker />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="安装单位">
                {getFieldDecorator('install_company', {
                  initialValue: deviceInfo.install_company,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>

            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="使用年限">
                {getFieldDecorator('use_years', {
                  initialValue: deviceInfo.use_years,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="质保年限">
                {getFieldDecorator('quality_years', {
                  initialValue: deviceInfo.quality_years,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="使用日期">
                {getFieldDecorator('use_date', {
                  initialValue: deviceInfo.use_date ? moment(deviceInfo.use_date) : null,
                  rules: [],
                })(<DatePicker />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="所属公司">
                {getFieldDecorator('company_id', {
                  initialValue: deviceInfo.company_id,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="质保开始日期">
                {getFieldDecorator('quality_start_date', {
                  initialValue: deviceInfo.quality_start_date ? moment(deviceInfo.quality_start_date) : null,
                  rules: [],
                })(<DatePicker />)}
              </FormItem>
            </Col>
            {operate === 'edit' && (
              <Col {...colLayout}>
                <FormItem {...formItemLayout} label="设备状态">
                  {getFieldDecorator('status', {
                    initialValue: deviceInfo.status,
                    rules: [{ required: true, message: '请输入设备状态' }],
                  })(<RadioGroup options={deviceStatesOptions} />)}
                </FormItem>
              </Col>
            )
            }
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="质保结束日期">
                {getFieldDecorator('quality_end_date', {
                  initialValue: deviceInfo.quality_end_date ? moment(deviceInfo.quality_end_date) : null,
                  rules: [],
                })(<DatePicker />)}
              </FormItem>
            </Col>

            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="设备资料">
                {getFieldDecorator('folder_no', {
                  initialValue: deviceInfo.folder_no,
                  rules: [],
                })(
                  <CommonUpload folderNo={deviceInfo.folder_no} total={5} />
                )}
              </FormItem>
            </Col>

            <Col xs={24} sm={24} md={24}>
              <FormItem style={{'marginBottom':0}}>
                <span className={styles.submitButtons}>
                  <Button type="primary" onClick={this.handleSave}>提交</Button>
                  <Button type="primary" onClick={this.handleBack} style={{ marginLeft: 8 }}>返回</Button>
                </span>
              </FormItem>
            </Col>
          </Row>
        </Form>
        {operate === 'edit' && this.renderModal()}
      </div>
    );
  }
}
