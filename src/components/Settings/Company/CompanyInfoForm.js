import React from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Radio,
} from 'antd';
import { patternRule } from '../../../utils/asyncValidatorHelper'
import styles from './CompanyInfoForm.less';
import SelectArea from '../../SelectArea';

export default class CompanyInfoForm extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      companyInfo: this.props.companyInfo,
    }
  }

  handleSave = () => {
    const {companyInfo} = this.state;
    const { form, operate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();

      const values = {
        ...fieldsValue,
      };
      values.adcode = values.adcode['2'];
      if(operate === 'edit') values.id = companyInfo.id;
      this.props.onSubmitForm(values);
    });
  };

  handleBack = () => {
    this.props.onBack();
  };

  render() {
    const FormItem = Form.Item;
    const RadioGroup = Radio.Group;
    const { TextArea } = Input;

    const { companyInfo } = this.state;
    const { form: {getFieldDecorator} } = this.props;

    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
    };
    const colLayout = { xs: 24, sm: 12, md: 12 };
    const statusOptions = [
      {label:'运营商', value:'0'},
      {label:'物业公司', value:'1'},
      {label:'运维公司', value:'2'},
    ]

    return (
      <div>
        <Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="公司简称">
                {getFieldDecorator('name', {
                  initialValue: companyInfo.name,
                  rules: [{ required: true, message: '请输入公司简称' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="公司全称">
                {getFieldDecorator('company_full_name', {
                  initialValue: companyInfo.company_full_name,
                  rules: [{ required: true, message: '请输入公司全称' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="公司类别">
                {getFieldDecorator('company_type', {
                  initialValue: companyInfo.company_type,
                  rules: [{ required: true, message: '请选择公司类别' }],
                })(<RadioGroup options={statusOptions} />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="地区">
                {getFieldDecorator('adcode', {
                  initialValue: companyInfo.adcode,
                  rules: [{ required: true, message: '请选择地区' }],
                })(<SelectArea />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="公司电话">
                {getFieldDecorator('phone', {
                  initialValue: companyInfo.phone,
                  rules: [patternRule('phoneAll')],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>

            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="公司地址">
                {getFieldDecorator('address', {
                  initialValue: companyInfo.address,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="公司负责人">
                {getFieldDecorator('contact_person_name', {
                  initialValue: companyInfo.contact_person_name,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="公司负责人电话">
                {getFieldDecorator('contact_person_phone', {
                  initialValue: companyInfo.contact_person_phone,
                  rules: [patternRule('mobile')],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="公司简介">
                {getFieldDecorator('summary', {
                  initialValue: companyInfo.summary,
                  rules: [{ required: true, message: '请输入公司简介' }],
                })(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="请输入公司简介"
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
