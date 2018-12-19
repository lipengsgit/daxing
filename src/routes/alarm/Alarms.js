import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Select,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getTableParams } from '../../utils/componentUtil';

import styles from './Alarms.less';

const FormItem = Form.Item;

@connect(({ alarms, loading }) => ({
  alarms,
  loading: loading.models.alarms,
}))
@Form.create()
export default class Alarms extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'alarms/fetchCategories',
    });

    const params = this.getFetchParams();
    dispatch({
      type: 'alarms/fetch',
      payload: params,
    });
  }

  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.alarms.data.pagination : pagination;
    const { formValues } = this.state;
    const tableParams = getTableParams(p, filtersArg, sorter);

    return {
      ...tableParams,
      ...formValues,
    };
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    dispatch({
      type: 'alarms/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'alarms/fetch',
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'alarms/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;

    const categoryOptions = this.props.alarms.categoryList.map(d => <Option key={d.id} title={d.name}>{d.name}</Option>);

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col md={10} sm={24}>
            <FormItem label="警告类型">
              {getFieldDecorator('alarm_category_id', { initialValue: this.state.formValues.alarm_category_id })(
                <Select placeholder="请选择" showSearch optionFilterProp='title'>
                  {categoryOptions}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24} offset={4}>
            <FormItem label="警告状态">
              {getFieldDecorator('alarm_status', { initialValue: this.state.formValues.alarm_status })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <FormItem label="设备名称">
              {getFieldDecorator('device_name', { initialValue: this.state.formValues.device_name })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={14} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { alarms: { data }, loading } = this.props;

    const columns = [
      {
        title: '警告类型',
        dataIndex: 'alarm_category_name',
        width: '10%',
      },
      {
        title: '警告时间',
        dataIndex: 'alarm_time',
        width: '10%',
      },
      {
        title: '警告状态',
        dataIndex: 'alarm_status_name',
        width: '10%',
      },
      {
        title: '设备名称',
        dataIndex: 'device_name',
        width: '20%',
      },
      {
        title: '设备编号',
        dataIndex: 'device_no',
        width: '10%',
      },
      {
        title: '所属项目',
        dataIndex: 'project_name',
        width: '10%',
      },
      {
        title: '设备位置',
        dataIndex: 'position_name',
        width: '20%',
      },
      {
        title: '点名称',
        dataIndex: 'device_item_name',
        width: '10%',
      },
    ];

    return (
      <PageHeaderLayout title="警告">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
              rowKey='id'
              needRowSelection={false}
              needShowSelect={false}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
