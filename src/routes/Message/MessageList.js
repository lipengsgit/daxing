import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  DatePicker,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from 'components/Ellipsis'
import {message} from "antd/lib/index";
import styles from './MessageList.less';
import moment from 'moment';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;


@connect(({ messages, loading }) => ({
  messages,
  loading: loading.models.messages,
}))
@Form.create()
export default class MessageList extends PureComponent {
  state = {
    formValues: {},
    selectedRows: [],
    expandedRowKeys: [],
  };

  componentDidMount() {
    this.queryMessagesList();
  }

  queryMessagesList = (_payload = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'messages/fetchMessagesList',
      payload: _payload,
    });
  };

  wrapperData = (data) => {
    if(data === undefined || data === null) return [];
    return data.map((item) => {
      return {
        ...item,
        ...{"expanded": false},
      };
    });
  };


  // --------------  查询Form   -------------//
  handleSearchFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.queryMessagesList()
  };


  handleSearch = e => {
    e.preventDefault();

    const {form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const value = {
        title: fieldsValue.title === undefined ? '' : fieldsValue.title,
        start_date: '',
        end_date: '',
      };
      if(fieldsValue.date !== undefined){
        value.start_date = fieldsValue.date[0].format('YYYY-MM-DD');
        value.end_date = fieldsValue.date[1].format('YYYY-MM-DD');

      }

      this.setState({
        formValues: value,
      });
      this.queryMessagesList(value);
    });
  };



  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleBatchDelete = () => {
    const { dispatch } = this.props;
    const data = this.state.selectedRows.map((item) => {
      return item.id;
    });
    if(data.length === 0) return;
    dispatch({
      type: 'messages/deleteMessage',
      payload: {
        ids: data.join(','),
      },
      callback: () => {
        message.success('删除成功');
      },
    });
  };

  // --------------  查询Form   -------------//

  // 分页事件
  handleTableChange = (pagination, filters, sorter) => {
    const values = {
      ...this.state.formValues,
      page: pagination.current,
      per_page: pagination.pageSize,
    };
    this.queryMessagesList(values);
  };

  handleExpandRow = (record, e) => {
    e.preventDefault();
    const r = record;
    const expandedKey = [...this.state.expandedRowKeys];
    if(expandedKey.indexOf(r.id) === -1) {
      expandedKey.push(r.id);
      r.expanded = true;
    }else{
      for(let i = 0; i < expandedKey.length; i+=1) {
        if(expandedKey[i] === r.id) {
          expandedKey.splice(i, 1);
          r.expanded = false;
        }
      }
    }
    this.setState({
      expandedRowKeys: expandedKey,
    });
  };
  expandedRowRender = (record) =>{
    return (
      <div className='shrInfo'>
        <p>消息标题:{record.title}</p>
        <p>发送人:{record.created_user}</p>
        <p>发送时间:{record.created_time}</p>
        <p>消息内容:{record.summary}</p>
      </div>
    );
  };

  renderSimpleSearchForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="消息标题">
              {getFieldDecorator('title')(<Input placeholder="请输入姓名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="选择日期">
              {getFieldDecorator('date')(<RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />)}
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
    const { messages: {messagesList}, loading } = this.props;
    const { selectedRows } = this.state;

    const newData = {list: this.wrapperData(messagesList.list),pagination: messagesList.pagination};

    const columns = [
      {
        title: '消息标题',
        dataIndex: 'title',
        width: '15%',
      },
      {
        title: '发送人',
        dataIndex: 'created_user',
        width: '10%',
      },
      {
        title: '发送时间',
        dataIndex: 'created_time',
        width: '15%',
      },
      {
        title: '消息内容',
        dataIndex: 'summary',
        width: '50%',
        render: (text, record) => {
          return <Ellipsis lines={1}>{text}</Ellipsis>
        },
      },
      {
        title: '操作',
        width: '10%',
        render: (text, record) => {
          return (
            record.expanded ? (
              <a href="#" onClick={(e) => this.handleExpandRow(record, e)}>
                详情<Icon type="up" />
              </a>
            ) : (
              <a href="#" onClick={(e) => this.handleExpandRow(record, e)}>
                详情<Icon type="down" />
              </a>
            )

          )
        },
      },
    ];

    return (
      <PageHeaderLayout title="消息列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <Button onClick={this.handleBatchDelete}>
                批量删除
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={newData}
              columns={columns}
              rowKey="id"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTableChange}
              expandedKeys={this.state.expandedRowKeys}
              expandedRender={(record)=>this.expandedRowRender(record)}

            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
