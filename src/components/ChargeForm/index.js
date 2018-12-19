import React, { PureComponent } from 'react';
import {
  Form,
  Modal,
  Input,
  Tooltip,
  Icon,
  Radio,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import numeral from 'numeral';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { patternRule } from '../../utils/asyncValidatorHelper';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TextArea } = Input;
const { Description } = DescriptionList;

@Form.create()
export default class ChargeForm extends PureComponent {

  componentDidMount() {
    const { form, payInfo } = this.props;
    let amountType = '0'; // 0: 当年未缴
    let paymentAmount = payInfo.full.payment_amount;
    if(payInfo.unpaid_type === 1) { // 1：当年补缴
      amountType = '2';
      paymentAmount = payInfo.seventy.payment_amount;
    } else if(payInfo.unpaid_type === -1) { // -1：历史补缴
      amountType = '1';
      paymentAmount = payInfo.thirty.payment_amount;
    }
    form.setFieldsValue({
      amount_type: amountType,
      payment_type: '1', // 默认现金收费
      payment_amount: paymentAmount,
      remark: '',
    });
  }

  onValidateForm = () => {
    const { form, payInfo, handleSubmit } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        handleSubmit({
          ...values,
          year: payInfo.year,
          room_id: payInfo.room_id,
        })
      }
    });
  };

  handleTypesChange = (event) => {
    const { form, payInfo } = this.props;
    let { payment_type: paymentType,  amount_type: amountType } = form.getFieldsValue();
    if(event.target.name === 'amountTypeRadio'){
      amountType = event.target.value;
    }
    if(event.target.name === 'paymentTypeRadio'){
      paymentType = event.target.value;
    }
    let payType = payInfo.full;
    let receiveAmount = '';
    if(amountType === '1') {
      payType = payInfo.thirty;
    } else if(amountType === '2') {
      payType = payInfo.seventy;
    }
    const { payment_amount: paymentAmount, pos_receive_amount: posAmount, scan_receive_amount: scanAmount } = payType;
    switch (paymentType) {
      case '2': // 刷卡
        receiveAmount = posAmount;
        break;
      case '4': // 扫码
        receiveAmount = scanAmount;
        break;
      default:
    }
    form.setFieldsValue({
      payment_amount: paymentAmount,
      receive_amount: receiveAmount,
    });
  };

  // 实收金额验证
  receiveAmountValidate = (options, value, callback) => {
    const { form } = this.props;
    const { payment_type: paymentType, payment_amount: paymentAmount } = form.getFieldsValue();
    if(/(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/.test(value)){
      const differenceAmount = (paymentAmount - value).toFixed(2);
      if (paymentType === '1' && Math.abs(differenceAmount) >= 1) {
        callback('实收金额误差不能超过1元');
      }
    } else if(value !== '' && value !== undefined) {
      callback('请输入合法的金额');
    }
    callback();
  };

  render() {
    const { payInfo, room, onCancel } = this.props;
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const unpaidType = payInfo.unpaid_type;

    const { payment_type: paymentType } = getFieldsValue();

    const content = (
      <DescriptionList size="large" col={2}>
        <Description term="业主">{room.owner_name}</Description>
        <Description term="面积">{`${room.area}㎡`}</Description>
      </DescriptionList>
    );
    const amountTypeGroup = (
      <RadioGroup buttonStyle="solid" onChange={(e) => this.handleTypesChange(e)} name="amountTypeRadio">
        {unpaidType === 0 && (<RadioButton value="0">{`全额：￥${numeral(payInfo.full.payment_amount).format('0,0.00')}`}</RadioButton>)}
        {(unpaidType === 0 || unpaidType === -1) && (<RadioButton value="1">{`空置：￥${numeral(payInfo.thirty.payment_amount).format('0,0.00')}`}</RadioButton>)}
        {(unpaidType === 1) && (<RadioButton value="2">{`空置补交：￥${numeral(payInfo.seventy.payment_amount).format('0,0.00')}`}</RadioButton>)}
      </RadioGroup>
    );
    const tipTitle = paymentType === '1' ? "差额<￥1" : "除去手续费";

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    const title = (
      <div>
        <div>{payInfo.year}年度</div>
        <div>{room.address}采暖费</div>
      </div>
    );
    return (
      <Modal
        visible
        onCancel={onCancel}
        okText="提交"
        maskClosable={false}
        width={680}
        onOk={this.onValidateForm}
      >
        <PageHeaderLayout title={title} content={content} >
          <Form>
            <FormItem
              {...formItemLayout}
              label="采暖类型"
            >
              {getFieldDecorator('amount_type')(
                amountTypeGroup
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="交费方式"
            >
              {getFieldDecorator('payment_type')(
                <RadioGroup buttonStyle="solid" onChange={(e) => this.handleTypesChange(e)} name="paymentTypeRadio">
                  <RadioButton value="1">现金</RadioButton>
                  <RadioButton value="2">刷卡</RadioButton>
                  <RadioButton value="4">扫码</RadioButton>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="应收">
              {getFieldDecorator('payment_amount')(<Input addonBefore="￥" readOnly />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>实收&nbsp;
                  <Tooltip title={tipTitle}>
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('receive_amount', {
                rules: [
                  {
                    required: true,
                    message: '请输入实收金额',
                  },{
                    validator: this.receiveAmountValidate,
                  },
                ],
              })(<Input addonBefore="￥" readOnly={paymentType !== '1'} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="手机号码"
            >
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入交费人手机',
                  },
                  patternRule('mobile'),
                ],
              })(<Input addonBefore={<Icon type="phone" />} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark')(<TextArea style={{ minHeight: 24 }} rows={3} />)}
            </FormItem>
          </Form>
          <DescriptionList size="large" col={3}>
            <Description term="" />
            <Description term="收费员" style={{float: 'right'}}>{global.currentUser.full_name}</Description>
          </DescriptionList>
        </PageHeaderLayout>
      </Modal>
    );
  };
};
