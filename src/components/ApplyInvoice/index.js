import React from 'react';
import {
  Form,
  Input,
  Button,
  Col,
  AutoComplete,
  Card,
  Switch,
  Modal,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import moment from 'moment/moment';
import {patternRule} from "../../utils/asyncValidatorHelper";
import numeral from "numeral";

const FormItem = Form.Item;
const InputGroup = Input.Group;
const {Description} = DescriptionList;
@Form.create()
export default class InvoiceForm extends React.Component {
  state = {
    dataSource: [],
    visibleSwitch: true,
  }
  handleChange = (value) => {
    this.setState({
      dataSource: !value || value.indexOf('@') >= 0 ? [] : [
        `${value}@gmail.com`,
        `${value}@163.com`,
        `${value}@qq.com`,
      ],
    });
  }

  render() {
    const {handleModalVisible, form, handleAdd, roomInfo,payResult} = this.props;
    const {visibleSwitch} = this.state;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleAdd(fieldsValue);
        handleModalVisible(false);
        });
    };

    const {getFieldProps} = this.props.form;
    const openForm = () => {
      return visibleSwitch === true ? (
        <div>
          <FormItem>
            {form.getFieldDecorator('room_id', {
              initialValue: roomInfo.id,
            })(<Input type="hidden" />)}
          </FormItem>
          <FormItem>
            {form.getFieldDecorator('trade_order_id', {
              initialValue: payResult.id,
            })(<Input type="hidden" />)}
          </FormItem>
          <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="姓名">
            {form.getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '请输入姓名',
                },
                patternRule('name'),
              ],
            })(<Input placeholder="请输入姓名"  />)}
          </FormItem>
          <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="身份证号">
            {form.getFieldDecorator('identification_no', {
              rules: [
                {
                  required: true,
                  message: '请输入身份证号',
                },
                patternRule('idCard'),
              ],
            })(<Input placeholder="请输入身份证号"  />)}
          </FormItem>

          <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="电子邮箱">
            {form.getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: '请输入电子邮箱',
                },
                patternRule('email'),
              ],
            })(
              <AutoComplete
                dataSource={this.state.dataSource}
                style={{width: 200}}
                onChange={this.handleChange}
                placeholder="Email"
              >
                <Input  />
              </AutoComplete>
            )}
          </FormItem>
          <FormItem labelCol={{span: 5}} wrapperCol={{span: 5}} label="电话号码">
            {form.getFieldDecorator('telephone', {
              rules: [
                patternRule('mobile'),
              ],
            })(<Input placeholder="请输入电话号码"  />)}
          </FormItem>

          <div style={{marginLeft: 600}}>
            <Button key="submit" type="primary" onClick={okHandle}>
              提交
            </Button>
          </div>
        </div>
      ) : (<div />);
    };

    const statusForm = () => {
      return payResult.amount_type === 0 ? (
        <div><span style={{color: '#FFBF00'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>全额缴费</span></div>
        )
        : payResult.amount_type === 1 ? (
          <div><span style={{color: '#0E77D1'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>空置缴费</span></div>
        ) : payResult.amount_type === 2 ? (
          <div><span style={{color: '#ff608a'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>空置补缴</span></div>
        ) : (
          <div><span style={{color: '#ff6c16'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>历史补缴</span></div>
        )
    };

    // 打开/关闭 发票信息输入栏
    const handleSwitch = () => {
      this.setState({
        visibleSwitch: !this.state.visibleSwitch,
      });
    };
    return (
      <Modal
        title={roomInfo.address}
        visible
        destroyOnClose
        onCancel={() => handleModalVisible()}
        footer={null}
        width={800}
      >
        <Card style={{border: 'none'}}>
          <DescriptionList style={{fontWeight: 650}}>
            <Description term="业主">{roomInfo.owner_name}</Description>
            <Description term="手机">{payResult.phone}</Description>
            <Description term="面积">{roomInfo.area}㎡</Description>
            <Description term="费用">{`￥${numeral(payResult.receive_amount).format('0,0.00')}`}</Description>
            <Description term="方式">{payResult.payment_type_label} </Description>
            <Description term="状态 ">
              {statusForm()}
            </Description>
            <Description term="收费员">{`${payResult.casher === null ? '公众号' : payResult.casher.full_name}`}</Description>
            <Description term="收据ID">{payResult.trade_no}</Description>
            <Description term="时间">{moment(payResult.created_at).format('YYYY-MM-DD')}</Description>
          </DescriptionList>
        </Card>
        <hr />
        更多开票信息：<Switch checkedChildren="开" defaultChecked unCheckedChildren="关" onChange={handleSwitch} />
        <p style={{float: 'right'}}>点击打开才会展开下列表单</p>
        <div>
          {openForm()}
        </div>
      </Modal>
    );

  }
}
