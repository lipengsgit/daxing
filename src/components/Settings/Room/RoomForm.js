import React from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Radio,
} from 'antd';
import styles from './RoomForm.less';

export default class RoomForm extends React.Component {

  constructor(props){
    super(props);

    const { dataInfo, operate } = this.props;
    this.state = {
      buildingList: [],
      unitList: [],
    };
    if(operate === 'edit') {
      this.props.dispatch({
        type: 'buildings/fetch',
        payload: { page: 1, per_page: 9999, zone_id: parseInt(dataInfo.zone_id, 10) },
        callback: (data) => {
          this.setState({
            buildingList: [...data.list],
          })
        },
      });
      this.props.dispatch({
        type: 'units/fetch',
        payload: { page: 1, per_page: 9999, building_id: parseInt(dataInfo.building_id, 10) },
        callback: (data) => {
          this.setState({
            unitList: [...data.list],
          })
        },
      });
    }
  }

  handleSave = () => {
    const { form, operate, dataInfo } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();

      const values = {
        ...fieldsValue,
      };
      if(operate === 'edit') values.id = dataInfo.id;
      this.props.onSubmitForm(values);
    });
  };

  handleBack = () => {
    this.props.onBack();
  };

  handleZoneChange = (value) => {
    const { form } = this.props;
    this.props.dispatch({
      type: 'buildings/fetch',
      payload: { page: 1, per_page: 9999, zone_id: parseInt(value, 10) },
      callback: (data) => {
        form.setFields({building_id: {value: ''}, unit_id: {value: ''}});
        this.setState({
          buildingList: [...data.list],
          unitList: [],
        })
      },
    });
  };

  handleBuildingChange = (value) => {
    const { form } = this.props;
    this.props.dispatch({
      type: 'units/fetch',
      payload: { page: 1, per_page: 9999, building_id: parseInt(value, 10) },
      callback: (data) => {
        form.setFields({unit_id: {value: ''}});
        this.setState({
          unitList: [...data.list],
        })
      },
    });
  };

  render() {
    const FormItem = Form.Item;
    const { TextArea } = Input;
    const { Option } = Select;
    const RadioGroup = Radio.Group;

    const { buildingList, unitList } = this.state;
    const { form: {getFieldDecorator}, zoneList, dataInfo } = this.props;

    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
    };
    const colLayout = { xs: 24, sm: 12, md: 12 };

    const zoneOptions = zoneList.map(d => <Option key={d.id} title={d.name}>{d.name}</Option>);
    const buildingOptions = buildingList.map(d => <Option key={d.id} title={d.name}>{d.name}</Option>);
    const unitOptions = unitList.map(d => <Option key={d.id} title={d.name}>{d.name}</Option>);

    return (
      <div>
        <Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="名称">
                {getFieldDecorator('name', {
                  initialValue: dataInfo.name,
                  rules: [{ required: true, message: '请输入房间名称' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="所属小区">
                {getFieldDecorator('zone_id', {
                  initialValue: dataInfo.zone_id ? dataInfo.zone_id.toString() : '',
                  rules: [{ required: true, message: '请选择所属小区' }],
                })(
                  <Select placeholder="请选择" showSearch optionFilterProp='title' onChange={this.handleZoneChange}>
                    {zoneOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="所属楼栋">
                {getFieldDecorator('building_id', {
                  initialValue: dataInfo.building_id ? dataInfo.building_id.toString() : '',
                  rules: [{ required: true, message: '请选择所属楼栋' }],
                })(
                  <Select placeholder="请选择" showSearch optionFilterProp='title' onChange={this.handleBuildingChange}>
                    {buildingOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="所属单元">
                {getFieldDecorator('unit_id', {
                  initialValue: dataInfo.unit_id ? dataInfo.unit_id.toString() : '',
                  rules: [{ required: true, message: '请选择所属单元' }],
                })(
                  <Select placeholder="请选择" showSearch optionFilterProp='title'>
                    {unitOptions}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="业主姓名">
                {getFieldDecorator('owner_name', {
                  initialValue: dataInfo.owner_name,
                  rules: [{ required: true, message: '请输入业主姓名' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="面积">
                {getFieldDecorator('area', {
                  initialValue: dataInfo.area,
                  rules: [{ required: true, message: '请输入面积' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="业主手机">
                {getFieldDecorator('owner_phone', {
                  initialValue: dataInfo.owner_phone,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="业主身份证号">
                {getFieldDecorator('owner_id_card_no', {
                  initialValue: dataInfo.owner_id_card_no,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="空置状态">
                {getFieldDecorator('use_status', {
                  initialValue: dataInfo.use_status,
                  rules: [{ required: true, message: '请选择空置状态' }],
                })(
                  <RadioGroup>
                    <Radio value={0}>空置</Radio>
                    <Radio value={1}>在用</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="使用方式">
                {getFieldDecorator('use_type', {
                  initialValue: dataInfo.use_type,
                  rules: [{ required: true, message: '请选择使用方式' }],
                })(
                  <RadioGroup>
                    <Radio value={0}>自用</Radio>
                    <Radio value={1}>租用</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="房间类型">
                {getFieldDecorator('room_type', {
                  initialValue: dataInfo.room_type,
                  rules: [],
                })(
                  <RadioGroup>
                    <Radio value={0}>住宅</Radio>
                    <Radio value={1}>商铺</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="简介">
                {getFieldDecorator('summary', {
                  initialValue: dataInfo.summary,
                  rules: [],
                })(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="请输入简介"
                    rows={4}
                  />
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
      </div>
    );
  }
}
