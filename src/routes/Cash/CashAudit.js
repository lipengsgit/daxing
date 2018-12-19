import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Radio,
  DatePicker,
  Select,
  Modal,
} from 'antd';
import StandardTable from 'components/StandardTable';
import {message} from "antd/lib/index";
import styles from './CashAudit.less';
import {routerRedux} from "dva/router";
import numeral from 'numeral';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const {RangePicker} = DatePicker;



@connect(({ cash, user, loading }) => ({
  cash,
  user,
  loading: loading.models.cash,
}))
@Form.create()
export default class CashAudit extends PureComponent {
  state = {
    formValues: {},

    chargeStatus: '',

    userList: [],

    detailModal: false,
    detailRecord:{},


  };

  componentDidMount() {
    // 查询系统用户
    this.queryUserList();
    // 公司现金统计
    this.queryAuditCash();
    // 现金入账记录列表
    this.queryCashAuditList();
  }
  queryUserList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/queryUserList',
      callback: (res)=>{
        this.setState({
          userList: res,
        });
      },
    });
  };

  queryAuditCash = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cash/queryAuditCash',
    });
  };

  queryCashAuditList = () =>{
    const params = {
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
      type: 'cash/queryCashAuditList',
      payload: params,
    });
  };


  redirectCashRecord = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/finance/cash/record`));
  };

  // --------------  查询Form   -------------//
  handleSearchFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    },()=>{
      this.queryCashAuditList();
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
        this.queryCashAuditList();
      });
    });
  };


  handleRadioButtonChange = (e) => {
    e.preventDefault();
    this.setState({
      chargeStatus: e.target.value,
    },()=>{
      this.queryCashAuditList();
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
      this.queryCashAuditList();
    });

  };


  // ----------------- 入账操作----------------------------
  toggleCashDetailModal = (record, e) => {
    e.preventDefault();
    if (record){
      this.setState({
        detailModal: !this.state.detailModal,
        detailRecord: record,
      });
    }else{
      this.setState({
        detailModal: !this.state.detailModal,
      });
    }

  };

  handleCashConfirm = (uid)=>{
    const params = {
      cash_account_ids: [uid],
    };
    this.props.dispatch({
      type: 'cash/cashConfirm',
      payload: params,
      callback: () => {
        message.success('现金入账确认成功！');
        this.setState({
          detailModal: !this.state.detailModal,
        });
        this.queryAuditCash();
        this.queryCashAuditList();
      },
    });
  };


  renderCashDetail = () => {
    const record = this.state.detailRecord;
    return (
      <Modal
        key="modalCashAudit1"
        title="现金入账确认"
        className={styles.detailModal}
        visible={this.state.detailModal}
        onCancel={(e) => this.toggleCashDetailModal(null , e)}
        onOk={(e) => this.toggleCashDetailModal(null, e)}
        footer={[
          <Button type="primary" onClick={(e)=>this.handleCashConfirm(record.id,e)}>入账确认</Button>,
        ]}
      >
        <p>任务ID：{record.id}</p>
        <p>发起人：{record.user? record.user.full_name : ''}</p>
        <p>经办人：{record.agent}</p>
        <p>金额：¥{numeral(record.amount).format('0,0.00')}</p>
        <p>发起时间：{record.created_at}</p>
      </Modal>

    );
  };




  renderSimpleSearchForm() {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;
    const typeOptions = this.state.userList.map(d => <Option key={d.id} title={d.full_name}>{d.full_name}</Option>);
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="发起人">
              {getFieldDecorator('user_id')(
                <Select placeholder="请选择" showSearch optionFilterProp='title'>
                  {typeOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
          <Col md={4} sm={24}>
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
    const { cash: { cashAuditList, auditCashData }, loading } = this.props;
    const selectedRows = [];

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );


    const columns = [
      {
        title: '任务ID',
        dataIndex: 'id',
      },
      {
        title: '发起人',
        dataIndex: 'user',
        render(val) {
          return val === null ? '--' : val.full_name;
        },
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
        title: '财务审核',
        dataIndex: 'auditor',
        render(val) {
          return val === null ? '--' : val.full_name;
        },
      },
      {
        title: '处理时间',
        dataIndex: 'audit_time',
        render(val) {
          return val === null ? '--' : val;
        },
      },
      {
        title: '操作',
        render: (val, record) => (
          <Fragment>
            {parseInt(record.status, 10) === 0 ?
              <a href="javascript:void(0)" onClick={(e) => this.toggleCashDetailModal(record, e)}>入账</a>
              : '--'
            }

          </Fragment>
        ),
      },
    ];

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListTitle}>
            现金入账审核
          </div>
          <Row className={styles.tableListRow}>
            <Col sm={8} xs={24}>
              <Info title="公司待入账处理现金" value={`¥${numeral(auditCashData.total_entered).format('0,0.00')}`} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <div className={styles.headerInfo}>
                <span>公司已入账现金</span>
                <p>
                  <span style={{marginRight: "10px"}}>¥{numeral(auditCashData.total_confirmed).format('0,0.00')}</span>
                </p>
              </div>
            </Col>
          </Row>
          <div className={styles.tableListSearch}>
            <div>待入账列表</div>
            <div>
              <RadioGroup defaultValue="" onChange={this.handleRadioButtonChange}>
                <RadioButton value="">全部</RadioButton>
                <RadioButton value="0">入账中</RadioButton>
                <RadioButton value="1">已完成</RadioButton>
              </RadioGroup>
            </div>
          </div>
          <div className={styles.tableListForm}>{this.renderSimpleSearchForm()}</div>
          <StandardTable
            selectedRows={selectedRows}
            rowKey='id'
            needRowSelection={false}
            needShowSelect={false}
            loading={loading}
            data={cashAuditList}
            columns={columns}
            onChange={this.handleTableChange}

          />
          <div className={styles.tableListForm}>{this.renderCashDetail()}</div>
        </div>
      </Card>
    );
  }
}
