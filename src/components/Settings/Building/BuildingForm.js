import React from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
} from 'antd';
import styles from './BuildingForm.less';

export default class BuildingForm extends React.Component {

  constructor(props){
    super(props);

    const {dataInfo} = this.props;

    this.state = {
      dataInfo,
    }
  }

  handleSave = () => {
    const { dataInfo } = this.state;
    const { form, operate } = this.props;
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

  render() {
    const FormItem = Form.Item;
    const { TextArea } = Input;
    const { Option } = Select;

    const { dataInfo } = this.state;
    const { form: {getFieldDecorator}, zoneList } = this.props;

    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
    };
    const colLayout = { xs: 24, sm: 12, md: 12 };

    const zoneOptions = zoneList.map(d => <Option key={d.id} title={d.name}>{d.name}</Option>);

    return (
      <div>
        <Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="楼栋名称">
                {getFieldDecorator('name', {
                  initialValue: dataInfo.name,
                  rules: [{ required: true, message: '请输入楼栋名称' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="所属小区">
                {getFieldDecorator('zone_id', {
                  initialValue: dataInfo.zone_id ? dataInfo.zone_id.toString() : '',
                  rules: [{ required: true, message: '请选择所属小区' }],
                })(
                  <Select placeholder="请选择" showSearch optionFilterProp='title'>
                    {zoneOptions}
                  </Select>
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
