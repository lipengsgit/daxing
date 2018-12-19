import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  message,
} from 'antd';
import styles from './HistoryOrders.less';
import {getTableParams} from "../../utils/componentUtil";
import OrderTable from "../../components/OrderTable";
import RoomCascader from "../../components/RoomCascader";

const FormItem = Form.Item;

const convertLocation = (value) => {
  if(value && value.start_date) return value;
  const param = {};
  if(value !== undefined && value !== null ){
    Object.keys(value).forEach((key) => {
      switch (key) {
        case 'zoneId':
          param.zone_id = value.zoneId;
          break;
        case 'buildingId':
          param.building_id = value.buildingId;
          break;
        case 'unitId':
          param.unit_id = value.unitId;
          break;
        default:
      }
    });
  }
  return param;
};

@connect(({ tradeOrders, loading }) => ({
  tradeOrders,
  loading: loading.models.tradeOrders,
}))
@Form.create()
export default class HistoryOrders extends PureComponent {
  state = {
    formValues: {},
  };

  componentDidMount(){
    const { dispatch } = this.props;
    const params = this.getFetchParams({
      page:1,
      per_page: 20,
    });
    dispatch({
      type: 'tradeOrders/fetchOrders',
      payload: params,
    });
    this.props.dispatch({
      type: 'tradeOrders/fetchZones',
      payload: {
        page: 1,
        per_page: 999999,
      },
    });
  }

  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.tradeOrders.data.pagination : pagination;
    const { formValues } = this.state;
    const tableParams = getTableParams(p, filtersArg, sorter);
    const { dateRange } = formValues;
    const params = {
      ...tableParams,
      ...formValues,
    };
    if(dateRange && !params.start_date){
      params.start_date = dateRange[0].format('YYYY-MM-DD');
      params.end_date = dateRange[1].format('YYYY-MM-DD');
    }
    delete params.dateRange;
    return params;
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'tradeOrders/fetchOrders',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'roomCascader/initial',
    });
    this.setState({
      formValues: {},
    });
  };

  handleSearch = (e, selectParam, locationParam) => {
    if(e) e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {...fieldsValue};
      if(selectParam){
        values = {
          ...values,
          ...selectParam,
        };
      }
      if(locationParam){
        values = {
          ...values,
          ...convertLocation(locationParam),
        }
      }else {
        values = {
          ...values,
          ...convertLocation(fieldsValue.location),
        }
      }
      this.setState({
        formValues: values,
      }, () => {
        const params = this.getFetchParams({current:1, page_size:10});
        dispatch({
          type: 'tradeOrders/fetchOrders',
          payload: params,
        });
      });
    });
  };

  handleLocationChange = (value) => {
    this.handleSearch(null, null, value);
  };

  handleSendMessage = (selectedOrder) => {
    this.props.dispatch({
      type: 'tradeOrders/sendByPhone',
      payload: {
        order_id:selectedOrder.id,
        phone:selectedOrder.phone,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('发送短信成功');
        }else{
          message.success('发送短信失败')
        }
      },
    });
  };

  handleRefund = (orderId) => {
    this.props.dispatch({
      type: 'tradeOrders/refundButton',
      payload: {
        id: orderId,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('退款成功');
        }else{
          const errorMessage = response.error_msg ? response.error_msg : '退款失败';
          message.error(errorMessage);
        }
        this.handleStandardTableChange();
      },
    })
  };

  handleAddInvoice = (fields) => {
    this.props.dispatch({
      type: 'tradeOrders/applicationInvoice',
      payload: fields,
      callback: (response) => {
        if (response.success === true){
          message.success('申请发票成功');
        }else{
          message.success('申请发票失败');
        }
        this.handleStandardTableChange();
      },
    });
  };

  renderSimpleForm() {
    const { form: {getFieldDecorator} } = this.props;
    const { RangePicker } = DatePicker;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <FormItem label="位置" >
              {getFieldDecorator('location')(
                <RoomCascader onChange={this.handleLocationChange} />
              )}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="日期" >
              {getFieldDecorator('dateRange')(
                <RangePicker format="YYYY-MM-DD" onChange={(dateArray, dateStrArray) => {this.handleSearch(null, {start_date: dateStrArray[0], end_date: dateStrArray[1]});}} />
              )}
            </FormItem>
          </Col>

          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword', { initialValue: this.state.formValues.keyword })(
                <Input placeholder="业主姓名/房号/手机号" onPressEnter={(e) => {this.handleSearch(e)}} />
              )}
            </FormItem>
          </Col>

          <Col md={3} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" >
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const { tradeOrders: { data }, loading } = this.props;

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <OrderTable
            data={data}
            loading={loading}
            onTableChange={this.handleStandardTableChange}
            simpleTable={false}
            handleSendMessage={this.handleSendMessage}
            handleRefund={this.handleRefund}
            handleAddInvoice={this.handleAddInvoice}
          />
        </div>
      </Card>
    );
  }
}
