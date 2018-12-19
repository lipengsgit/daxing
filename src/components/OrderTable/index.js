import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
  AutoComplete,
  Switch,
  Divider,
  Row,
  Col,
} from 'antd';

import moment from 'moment/moment';
import DescriptionList from '../../components/DescriptionList';
import StandardTable from '../../components/StandardTable/index';
import SendMessage from '../../components/SendMessage';
import Authorized, { hasPermission } from '../../utils/Authorized';
import {patternRule} from "../../utils/asyncValidatorHelper";

const { Description } = DescriptionList;
const FormItem = Form.Item;

@Form.create()
export default class OrderTable extends PureComponent {
  /**
   * 参数说明：
   *
   * data  列表数据
   * loading  等待图标显示标识 boolean
   * onTableChange 翻页方法
   * simpleTable 是否使用简单列表
   * handleRefund 退款方法
   * handleSendMessage 发送短信方法
   * openInvoice 是否默认打开开票信息输入栏
   * scroll 是否有滚动条
   */

  constructor(props){
    super(props);

    this.state = {
      visibleMessage:false,
      selectedOrder:{},
      VisibleRefund:false,
      modalVisible: false,
      visibleSwitch: false,
      dataSource:[],// 邮箱
    }
  };

  /** ***************** 短信 ********************** */
  // 打开短信窗口
  openSendMessage = (record) => {
    this.setState({
      selectedOrder: record,
      visibleMessage: true,
    });
  };
  // 关闭短信窗口
  closeSendMessage = () => {
    this.setState({
      selectedOrder: {},
      visibleMessage: false,
    });
  };
  // 发送短信
  sendMessage = ()=> {
    const { handleSendMessage } = this.props;
    if(handleSendMessage){
      handleSendMessage(this.state.selectedOrder);
    }
    this.setState({
      visibleMessage: false,
      selectedOrder: {},
    });
  };

  /** ***************** 退款 ********************** */
  // 显示/隐藏 退款窗口
  handleVisibleRefund=(flag)=> {
    this.setState({
      VisibleRefund: !!flag,
    });
  };
  // 退款
  handleRefundButton = () => {
    const { selectedOrder } = this.state;
    const { handleRefund } = this.props;
    if(handleRefund){
      handleRefund(selectedOrder.id);
    }
    this.handleVisibleRefund();
    this.handleModalVisible(false);
  };
  // 生成退款窗口
  createRefund () {
    return (
      <Modal
        visible={this.state.VisibleRefund}
        onCancel={()=>this.handleVisibleRefund()}   // 右上角x
        width={200}
        bordered={false}
        mask={false}
        style={{marginTop:300}}
        footer={
          [
            <Button key="b3" style={{position: 'absolute',left:'20px'}} type="primary" onClick={()=>this.handleRefundButton()}>
              确认
            </Button>,
            <Button key="b4"  style={{left:'-10px'}} onClick={()=>this.handleVisibleRefund()}>
              取消
            </Button>,
          ]
        }
      >
        <div style={{marginTop:'10px', marginBottom:'5px'}}>
          <span style={{color:'red',marginLeft:30,fontSize:17}}>确认退款吗？</span>
        </div>
      </Modal>
    );
  };

  /** ***************** 发票 ********************** */
  //  提交申请发票
  addInvoice = (fields)=>{
    const values = {
      room_id:fields.room_id,
      title:fields.title,
      email:fields.email,
      telephone:fields.telephone,
      identification_no:fields.identification_no,
      trade_order_id:fields.id,
    };
    const { handleAddInvoice } = this.props;
    if(handleAddInvoice){
      handleAddInvoice(values);
    }
    this.handleModalVisible(false);
  };
  // 生成发票输入栏
  createInvoiceForm = () => {
    const { visibleSwitch, selectedOrder, dataSource } = this.state;
    const { form } = this.props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        this.addInvoice(fieldsValue);
      });
    };
    return visibleSwitch === true ? (
      <div>
        <FormItem>
          {form.getFieldDecorator('id', {
            initialValue: selectedOrder.id,
          })(<Input type="hidden"  />)}
        </FormItem>
        <FormItem>
          {form.getFieldDecorator('room_id', {
            initialValue: selectedOrder.room_id,
          })(<Input type="hidden"  />)}
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

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电子邮箱">
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
              dataSource={dataSource}
              style={{ width: 200 }}
              onChange={this.handleChangeMailBox}
              placeholder="Email"
            >
              <Input />
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
        <div style={{marginLeft:600}}>
          <Button key="submit" type="primary" onClick={okHandle} >
            提交
          </Button>
        </div>
      </div>
    ) : (<div />);
  };

  /** ***************** 详细信息 ********************** */
  // 显示详细信息窗口
  handleMoreInvoice = (record,e) => {
    e.preventDefault();
    this.setState({
      selectedOrder:record,
    });
    this.handleModalVisible(true);
  };
  // 显示/隐藏 详细信息窗口，并更改发票信息输入栏显示状态
  handleModalVisible = flag => {
    const { openInvoice } = this.props;
    // 打开详细信息弹窗时，根据openInvoice判断是否默认打开填写发票信息
    let visibleSwitch = false;
    if(flag) visibleSwitch = openInvoice === true;
    this.setState({
      modalVisible: !!flag,
      visibleSwitch,
    });
  };
  // 打开/关闭 发票信息输入栏
  handleSwitch = () => {
    this.setState({
      visibleSwitch: !this.state.visibleSwitch,
    });
  };
  // 邮件
  handleChangeMailBox = (value) => {
    this.setState({
      dataSource: !value || value.indexOf('@') >= 0 ? [] : [
        `${value}@mail.com`,
        `${value}@163.com`,
        `${value}@qq.com`,
      ],
    });
  };
  // 支付类型翻译
  statusText = (selectedOrder) => {
    return   selectedOrder.payment_status=== 0 ? (
      <div><span style={{color: '#FFBF00'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>全额缴费</span></div>
    )
    : selectedOrder.payment_status=== 1 ?(
      <div><span style={{color: '#0E77D1'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>空置缴费</span ></div>
    ):selectedOrder.payment_status=== 2 ? (
      <div><span style={{color: '#ff608a'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>空置补缴</span></div>
    ): (
      <div><span style={{color: '#ff6c16'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>历史补缴</span></div>
    )
  };
  // 生成详细信息弹出页
  createOrderModal() {
    const { modalVisible, selectedOrder } = this.state;
    const { handleRefund, openInvoice } = this.props;
    return (
      <Modal
        visible={modalVisible}
        destroyOnClose  // 关闭时销毁 Modal 里的子元素
        onCancel={() => this.handleModalVisible()}     // 右上角x
        footer={null}
        width={800}
        bodyStyle={{height:780}}
      >
        <div style={{fontSize:20}}>
          {selectedOrder.address}
        </div>
        <DescriptionList style={{ marginTop: 15}}>
          <Description term="业主">{selectedOrder.owner_name}</Description>
          <Description term="手机">{selectedOrder.phone}</Description>
          <Description term="面积">{selectedOrder.area}</Description>
          <Description term="费用">
            ¥{selectedOrder.receive_amount}
          </Description>
          <Description term="方式">
            { selectedOrder.payment_type===0 ? '微信支付':
              selectedOrder.payment_type===1 ? '现金收缴':
                selectedOrder.payment_type===2 ? '刷卡':
                  selectedOrder.payment_type===3 ? '转账':'扫码'}
          </Description>
          <Description term="状态">{this.statusText(selectedOrder)}</Description>
          <Description term="收费员">{selectedOrder.casher_name}</Description>
          <Description term="收据ID">{selectedOrder.trade_no}</Description>
          <Description term="时间">{selectedOrder.created_at}</Description>
        </DescriptionList>
        { selectedOrder.status !== 3 && (
          <Fragment>
            <hr />
            <Row>
              <Col md={12} sm={12}>
                <div style={{float:'left'}}>
                  更多开票信息：<Switch checkedChildren="开"  unCheckedChildren="关" defaultChecked={openInvoice}  onChange={() => this.handleSwitch()} />
                </div>
                <div style={{float:'left', marginTop:'10px'}}>
                  <div><p style={{marginLeft:100}}>点击打开才会展开下列表单</p></div>
                </div>
              </Col>
              <Col md={12} sm={12} style={{textAlign:'right', paddingTop:'20px', paddingRight:'50px'}}>
                { handleRefund && (
                  <Authorized authority={hasPermission('refundOrder')}>
                    <Button type="danger" ghost onClick={()=>this.handleVisibleRefund(true)} style={{fontSize:15}}>退款</Button>
                  </Authorized>
                )}
              </Col>
            </Row>
            <div>
              {this.createInvoiceForm()}
            </div>
          </Fragment>
        )}
      </Modal>
    );
  };

  renderTable() {
    const { data, loading, onTableChange, simpleTable, handleSendMessage, scroll } = this.props;

    const columnBase = [
      {
        title: '姓名',
        dataIndex: 'owner_name',
        key:'name',
      },
      {
        title: '费用',
        dataIndex: 'payment_amount',
        needTotal: simpleTable,
      },
    ];

    const columnSimple = [
      {
        title: '状态',
        dataIndex: 'payment_status',
        render:(text,record)=>(
          this.statusText(record)
        ),
      },
      {
        title: '住址',
        dataIndex: 'address',
      },
      {
        title: '时间',
        dataIndex: 'created_at',
        render:(text) => (
          moment(text).format('HH:mm')
        ),
      },
      {
        title: '操作',
        render: (text,record) =>{
          return(
            <Fragment>
              {handleSendMessage ? (
                <Fragment>
                  <a onClick={() => this.openSendMessage(record)}>发短信</a>
                  <Divider type="vertical" />
                </Fragment>
              ) : (<div />)}
              {record.invoice_status === null ? <a onClick={(e) => this.handleMoreInvoice(record, e)}>申请发票</a> :<a>已申请</a>}
            </Fragment>
          )
        },
      },
    ];

    const columnsAll = [
      {
        title: '收费员',
        dataIndex: 'casher_name',
      },
      {
        title: '住址',
        dataIndex: 'address',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '面积',
        dataIndex: 'area',
      },
      {
        title: '时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        render: (text,record) =>{
          return(
            <Fragment>
              {handleSendMessage ? (
                <Fragment>
                  <a onClick={() => this.openSendMessage(record)}>发短信</a>
                  <Divider type="vertical" />
                </Fragment>
              ) : (<div />)}
              <a onClick={(e) => this.handleMoreInvoice(record, e)}>开发票</a>
            </Fragment>
          )
        },
      },
    ];

    const columns = simpleTable === true ? [
      ...columnBase,
      ...columnSimple,
    ] : [
      ...columnBase,
      ...columnsAll,
    ];

    return (
      <StandardTable
        needRowSelection={simpleTable === true}
        needShowSelect={simpleTable === true}
        loading={loading}
        data={data}
        columns={columns}
        onChange={onTableChange}
        rowKey='id'
        scroll={scroll}
        showHeader={simpleTable !== true}
      />
    );
  }


  render() {
    const { visibleMessage, selectedOrder } = this.state;
    const { handleSendMessage, handleRefund } = this.props;

    return (
      <Fragment>
        {this.renderTable()}
        {handleSendMessage ? (
          <SendMessage
            title={selectedOrder.address}
            phoneNumber={selectedOrder.phone}
            show={visibleMessage}
            closeSendModal={this.closeSendMessage}
            sendMessage={this.sendMessage}
          />
        ) : <div />}
        { handleRefund && (this.createRefund())}
        {this.createOrderModal()}
      </Fragment>
    );

  }
}
