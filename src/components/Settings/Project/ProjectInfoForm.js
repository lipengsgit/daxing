import React from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
} from 'antd';
import styles from './ProjectInfoForm.less';

export default class ProjectInfoForm extends React.Component {

  constructor(props){
    super(props);

    const {projectInfo} = this.props;
    this.state = {
      projectInfo,
    }
  }

  handleSave = () => {
    const {projectInfo} = this.state;
    const { form, operate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();

      const values = {
        ...fieldsValue,
      };
      if(operate === 'edit') values.id = projectInfo.id;
      this.props.onSubmitForm(values);
    });
  };

  handleBack = () => {
    this.props.onBack();
  };

  render() {
    const FormItem = Form.Item;
    const { TextArea } = Input;

    const { projectInfo } = this.state;
    const { form: {getFieldDecorator} } = this.props;

    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
    };
    const colLayout = { xs: 24, sm: 24, md: 24 };

    return (
      <div>
        <Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="小区名称">
                {getFieldDecorator('name', {
                  initialValue: projectInfo.name,
                  rules: [{ required: true, message: '请输入小区名称' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="序号">
                {getFieldDecorator('sequence', {
                  initialValue: projectInfo.sequence,
                  rules: [],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="简介">
                {getFieldDecorator('summary', {
                  initialValue: projectInfo.summary,
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
            <Col {...colLayout}>
              <FormItem {...formItemLayout} label="地址">
                {getFieldDecorator('address', {
                  initialValue: projectInfo.address,
                  rules: [],
                })(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="请输入地址"
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
