import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Radio,
  Modal,
  DatePicker,
} from 'antd';
import StandardTable from 'components/StandardTable';
import {message} from "antd/lib/index";
import styles from './CashCharge.less';
import {routerRedux} from "dva/router";
import numeral from 'numeral';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const {RangePicker} = DatePicker;



const CreateChargeForm = Form.create()(props => {
  const { modalVisible, form, handleCreate, handleModalVisible } = props;
  const { getFieldDecorator } = form;
  let formValidate = false;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 12 },
    },
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleCreate(fieldsValue);
    });
  };

  return (
    <Modal
      title='发起现金入账(将现金归转给财务)'
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form >
        <FormItem {...formItemLayout} label="发起金额">
          {getFieldDecorator('amount', {
            rules: [
              {
                required: true,
                message: '请输入现金入账金额',
              },
            ],
          })(<InputNumber placeholder="输入入账金额(以可归转金额为上限)" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="经办人">
          {getFieldDecorator('agent', {
            rules: [
              {
                required: true,
                message: '请输入经办人',
              },
            ],
          })(<Input placeholder="请输入经办人" />)}
        </FormItem>
      </Form>
    </Modal>
  );
});



@connect(({ cash, loading }) => ({
  cash,
  loading: loading.models.cash,
}))
@Form.create()
export default class CashCharge extends PureComponent {
  state = {
    formValues: {},
    createModalVisible: false,

    chargeStatus: '',
  };

  componentDidMount() {
    // 我的现金统计
    this.queryMyCash();
    // 现金入账记录列表
    this.queryCashChargeList();
  }
  queryMyCash = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cash/queryMyCash',
      payload: {
        user_id: global.currentUser.id,
      },
    });
  };

  queryCashChargeList = () =>{
    const params = {
      user_id: global.currentUser.id,
      ...this.state.formValues,
    };
    if(this.state.chargeStatus !== ""){
      params.status = this.state.chargeStatus;
    }
    if(params.start){
      params.from_date = params.start[0].format('YYYY-MM-DD');
      params.to_date = params.start[1].format('YYYY-MM-DD');
      delete params.start;
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'cash/queryCashChargeList',
      payload: params,
    });
  };


  redirectCashRecord = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/finance/cash/record`));
  };

  // --------------  新增现金入账  -------------//

  handleChargeAddModalVisible = () => {
    this.setState({
      createModalVisible: !this.state.createModalVisible,
    });
  };

  handleSubmit = (fields) => {
    const { cash: { myCashData } } = this.props;
    if(parseFloat(fields.amount) <= 0){
      message.error('发起金额必须大于0且不能为负数');
      return false;
    }
    if(parseFloat(fields.amount) > parseFloat(myCashData.total_checked)){
      message.error('发起金额不能大于可归转金额');
      return false;
    }
    this.props.dispatch({
      type: 'cash/addCashCharge',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.setState({
          createModalVisible: false,
        });
        this.queryMyCash();
        this.queryCashChargeList();
      },
    });

  };



  // --------------  查询Form   -------------//
  handleSearchFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    },()=>{
      this.queryCashChargeList();
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        formValues: fieldsValue,
      },()=>{
        this.queryCashChargeList();
      });
    });
  };


  handleRadioButtonChange = (e) => {
    e.preventDefault();
    this.setState({
      chargeStatus: e.target.value,
    },()=>{
      this.queryCashChargeList();
    });
  };

  // 分页事件
  handleTableChange = (pagination, filters, sorter) => {
    const values = {
      ...this.state.formValues,
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    this.setState({
      formValues: values,
    },()=>{
      this.queryCashChargeList();
    });

  };


  renderSimpleSearchForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="经办人">
              {getFieldDecorator('agent')(<Input placeholder="请输入经办人" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('start')(
                <RangePicker format="YYYY-MM-DD" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleSearchFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { cash: { cashChargeList, myCashData }, loading } = this.props;
    const selectedRows = [];

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    // 用户新建
    const parentMethods = {
      handleCreate: this.handleSubmit,
      handleModalVisible: this.handleChargeAddModalVisible,
    };

    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
      },
      {
        title: '经办人',
        dataIndex: 'agent',
      },
      {
        title: '金额',
        dataIndex: 'amount',
        render(val) {
          return val.startsWith('-') ? `${numeral(val).format('0,0.00').replace('-','-¥')}` : `¥${numeral(val).format('0,0.00')}`;
        },
      },
      {
        title: '状态',
        dataIndex: 'status_label',
      },
      {
        title: '审核人',
        dataIndex: 'auditor',
        render(val) {
          return val === null ? '--' : val.full_name;
        },
      },
      {
        title: '审核时间',
        dataIndex: 'audit_time',
        render(val) {
          return val === null ? '--' : val;
        },
      },
      {
        title: '发起时间',
        dataIndex: 'created_at',
      },
    ];

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListTitle}>
            现金入账
          </div>
          <Row className={styles.tableListRow}>
            <Col sm={6} xs={24}>
              <div className={styles.headerInfo}>
                <span>我的现金</span>
                <p>
                  <span style={{marginRight: "10px"}}>¥{numeral(myCashData.current_cash).format('0,0.00')}</span>
                  <span className={styles.chargeRecord} onClick={(e) => this.redirectCashRecord(e)}>
                    变动记录
                  </span>
                </p>
                <em />
              </div>
            </Col>
            <Col sm={6} xs={24}>
              <Info title="待对账" value={`¥${numeral(myCashData.total_unchecked).format('0,0.00')}`} bordered />
            </Col>
            <Col sm={6} xs={24}>
              <Info title="可归转/可入账" value={`¥${numeral(myCashData.total_checked).format('0,0.00')}`} bordered />
            </Col>
            <Col sm={6} xs={24}>
              <div className={styles.headerInfo}>
                <span>入账中</span>
                <p>
                  <span style={{marginRight: "10px"}}>¥{numeral(myCashData.total_entered).format('0,0.00')}</span>
                </p>
                <em />
              </div>
            </Col>
          </Row>
          <div className={styles.tableListSearch}>
            <div>入账任务列表</div>
            <div>
              <RadioGroup defaultValue="" onChange={this.handleRadioButtonChange}>
                <RadioButton value="">全部</RadioButton>
                <RadioButton value="0">入账中的</RadioButton>
                <RadioButton value="1">已完成的</RadioButton>
              </RadioGroup>
            </div>
          </div>
          <div className={styles.tableListForm}>{this.renderSimpleSearchForm()}</div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" onClick={this.handleChargeAddModalVisible}>
              新建
            </Button>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            rowKey='id'
            needRowSelection={false}
            needShowSelect={false}
            loading={loading}
            data={cashChargeList}
            columns={columns}
            onChange={this.handleTableChange}

          />
        </div>
        <CreateChargeForm {...parentMethods} modalVisible={this.state.createModalVisible} />
      </Card>
    );
  }
}
