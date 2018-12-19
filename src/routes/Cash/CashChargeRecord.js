import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Radio,
  Button,
  DatePicker,
} from 'antd';
import numeral from 'numeral';
import StandardTable from 'components/StandardTable';
import styles from './CashChargeRecord.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const {RangePicker} = DatePicker;


@connect(({ cash, loading }) => ({
  cash,
  loading: loading.models.cash,
}))
@Form.create()
export default class CashChargeRecord extends PureComponent {
  state = {
    formValues: {},
    source_type: '',
    amount_type: '',
  };

  componentDidMount() {
    this.queryCashRecordList()
  }


  queryCashRecordList = () =>{
    const params = {
      user_id: global.currentUser.id,
      ...this.state.formValues,
      source_type:this.state.source_type,
      amount_type:this.state.amount_type,
    };
    if(this.state.amount_type === ""){
      delete params.amount_type;
    }
    if(params.start){
      params.date_from = params.start[0].format('YYYY-MM-DD');
      params.date_to = params.start[1].format('YYYY-MM-DD');
      delete params.start;
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'cash/queryCashRecordList',
      payload: params,
    });
  };

  // --------------  查询Form   -------------//
  handleSearchFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    },()=>{
      this.queryCashRecordList();
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
        this.queryCashRecordList();
      });

    });
  };

  handleRadioButtonChange = (e) => {
    e.preventDefault();
    let source_type = '';
    let amount_type = '';
    if(e.target.value !== ''){
      // 收费
      if(parseInt(e.target.value,10) === 0){
        source_type = '0,1';
        amount_type = '1';
      }
      // 入账
      if(parseInt(e.target.value,10) === 1){
        source_type = '3';
      }
      // 退款
      if(parseInt(e.target.value,10) === 2){
        source_type = '0,1';
        amount_type = '-1';
      }
    }
    this.setState({
      source_type,
      amount_type,
    },()=>{
      this.queryCashRecordList();
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
      this.queryCashRecordList();
    });

  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
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
          <Col md={10} sm={24}>
            <RadioGroup defaultValue="" onChange={this.handleRadioButtonChange}>
              <RadioButton value="">全部</RadioButton>
              <RadioButton value="0">收费</RadioButton>
              <RadioButton value="1">入账</RadioButton>
              <RadioButton value="2">退款</RadioButton>
            </RadioGroup>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { cash: { cashRecordList }, loading } = this.props;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '类型',
        dataIndex: 'source_type_label',
        align: 'center',
      },
      {
        title: '对方名称',
        dataIndex: 'source_type',
        align: 'center',
        render(val, record) {
          return (parseInt(val, 10) === 3 ? record.reciprocal.agent : record.reciprocal.name );
        },
      },
      {
        title: '金额',
        dataIndex: 'amount',
        align: 'center',
        render(val) {
          return val.startsWith('-') ? `${numeral(val).format('0,0.00').replace('-','-¥')}` : `¥${numeral(val).format('0,0.00')}`;
        },
      },
      {
        title: '变动时间',
        dataIndex: 'created_at',
        align: 'center',
      },
      {
        title: '现金余额',
        dataIndex: 'balance',
        align: 'center',
        render(val) {
          return `¥${numeral(val).format('0,0.00')}`;
        },
      },
    ];

    return (
      <Card bordered={false} style={{marginTop: "20px"}}>
        <div className={styles.tableList}>
          <div className={styles.tableListTitle}>
            现金余额变动记录
          </div>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <StandardTable
            rowKey='id'
            needRowSelection={false}
            needShowSelect={false}
            loading={loading}
            data={cashRecordList}
            columns={columns}
            onChange={this.handleTableChange}
          />
        </div>
      </Card>
    );
  }
}
