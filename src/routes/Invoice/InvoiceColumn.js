import React, {Fragment} from 'react';
import {connect} from 'dva';
import {
  Alert,
  AutoComplete,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Switch,
  Steps,
} from 'antd';
import styles from './InvoiceColumn.less';
import style from '../Forms/style.less';
import StandardTable from '../../components/StandardTable';
import DescriptionList from '../../components/DescriptionList';
import {getTableParams} from '../../utils/componentUtil';


const { Description } = DescriptionList;
const {Option} = Select;
const FormItem = Form.Item;
const { Step } = Steps;

@connect(({ InvoiceColumns, loading }) => ({
  InvoiceColumns,
  loading: loading.models.InvoiceColumns,
}))
@Form.create()
export default class InvoiceColumn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      visibleSwitch: false,
      formValues: {
        status: 0,
      },             // 重置
      selectedRows: [],
      stepsStatus: 0,  // 步骤条

    }
  }
componentDidMount() {
  const { dispatch } = this.props;
  const params = this.getFetchParams();
  dispatch({
    type: 'InvoiceColumns/fetch',
    payload: params,
  });

  dispatch({
    type: 'InvoiceColumns/fetchZones',
    payload: {
      page: 1,
      per_page: 999999,
    },
  });
  }

  // 分页事件
  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.InvoiceColumns.data.pagination : pagination;
    const { formValues } = this.state;
    const tableParams = getTableParams(p, filtersArg, sorter);
    const { dateRange } = formValues;
    const params = {
      ...tableParams,
      ...formValues,
    };
    if(dateRange && !params.start_date && dateRange.length!==0){
      params.start_date = dateRange[0].format('YYYY-MM-DD');
      params.end_date = dateRange[1].format('YYYY-MM-DD');
    }
    delete params.dateRange;
    return params;
  };
   handleStandardTableChange = (pagination, filtersArg, sorter) => {
     const { dispatch } = this.props;
     const params = this.getFetchParams(pagination, filtersArg, sorter);
     const { formValues } = this.state;
     dispatch({
       type: 'InvoiceColumns/fetch',
       payload: {...params,status:formValues.status},
     });
   };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };
  // 刷新页面
  refreshTable =()=>{
    const { dispatch } = this.props;
    const params = this.getFetchParams();
    dispatch({
      type: 'InvoiceColumns/fetch',
      payload: params,
    });
  }
  handleSearch = (e, selectParam) => {
    if(e) e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {...fieldsValue,...selectParam};
      console.info(values)
      if(selectParam){
        values = {
          ...fieldsValue,
          ...selectParam,
        };
      }
      if(values.status===0){
        this.setState({
          stepsStatus:0,
        })
      }else{
        this.setState({
          stepsStatus:1,
        })
      }
      this.setState({
        formValues: values,
      }, () => {
        const params = this.getFetchParams({current:1, page_size:10});
        dispatch({
          type: 'InvoiceColumns/fetch',
          payload: params,
        });
      });
    });
  };

  handleZoneChange = (value) => {
    const {formValues} = this.state;
    this.props.dispatch({
      type: 'InvoiceColumns/fetchBuildings',
      payload: {
        zone_id: value,
        page: 1,
        per_page: 999999,
      },
    });
    this.handleSearch(null, {zone_id: value,status:formValues.status});
  };

  handleBuildingChange = (value) => {
    const {formValues} = this.state;
    this.props.dispatch({
      type: 'InvoiceColumns/fetchUnits',
      payload: {
        building_id: value,
        page: 1,
        per_page: 999999,
      },
    });
    this.handleSearch(null, {building_id: value,status:formValues.status});
  };

  //  开票
  handleAddInvoice = (fields)=>{
    this.props.dispatch({
      type: 'InvoiceColumns/applicationInvoice',
      payload: {
        id:fields.id,
      },
      callback: (response) => {
        if (response.success === true){
          message.success('开票成功');
          this.handleModalVisible();
          this.refreshTable();
        }else{
          message.success('开票失败');
        }
      },
    });
  };
  //  得到发票信息
  handleMoreInvoice = (record, e) => {
    e.preventDefault();
    if(record.id !== '' && record.id !==null) {
      this.props.dispatch({
        type: 'InvoiceColumns/getInvoiceInfo',
        payload: {
          id: record.id,
        },
      });
      this.handleModalVisible(true);
    }
  };

  //  弹出开票
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      visibleSwitch: false,
    });
  };
//  弹出开票信息
  handleSwitch = () => {
    this.setState({
      visibleSwitch: !this.state.visibleSwitch,
    });
  };

  // 步骤条
   stepsForm() {
    const {stepsStatus} = this.state;
    const getTitleOne = () => {
      return stepsStatus===0 ?(
        <Button type="primary" shape="circle" onClick={() => {this.handleSearch(null, {status: 0});}} >1</Button>
      ):(
        <Button  shape="circle" onClick={() => {this.handleSearch(null, {status: 0});}} >1</Button>
      )
    };
    const getTitleTwo = () => {
      return stepsStatus===0 ?(
        <Button  shape="circle" onClick={() => {this.handleSearch(null, {status: 1});}} >2</Button>
      ):(
        <Button type="primary" shape="circle" onClick={() => {this.handleSearch(null, {status: 1});}} >2</Button>
      )
    };
    return(
      <Steps className={style.steps}>
        <Step  title="待开票" icon={getTitleOne()} />
        <Step  title="已开票" icon={getTitleTwo()} />
      </Steps>
    )
  }

  handleSelectRows = (selectedRows) => {
    this.setState({
      selectedRows: [...selectedRows],
    })
  };

 //  导出 Excel
  titleForm(){
    return(
      <Alert
        message={
          <Fragment>
            <span>已选择 <a style={{ fontWeight: 600 }}>{this.state.selectedRows.length}</a> 项</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button style={{color:'white',background:'#9c92ff'}} size="small">导出 Excel</Button>
          </Fragment>
        }
        type="info"
        showIcon
      />
    );
  }
  // 状态
   statusText=(Info)=>{
    return   Info.payment_status=== 0 ? (
      <p><span style={{color: '#FFBF00'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>全额缴费</span></p>
      )
      : Info.payment_status=== 1 ?(
        <p><span style={{color: '#0E77D1'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>空置缴费</span ></p>
      ):Info.payment_status=== 2 ? (
        <p><span style={{color: '#ff608a'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>空置补缴</span></p>
      ): (
        <p><span style={{color: '#ff6c16'}}>● </span><span style={{color: 'rgba(0, 0, 0, 0.427450980392157)'}}>历史补缴</span></p>
      )
  };
// 弹出页面-开票
   createForm(){
    const {InvoiceColumns:{Info},form} =this.props;
     const { modalVisible,visibleSwitch} = this.state;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        this.handleAddInvoice(fieldsValue);
      });
    };
    // 提交发票
    const openForm = ()=>{
      return visibleSwitch === true ?(
        <div>
          <FormItem>
            {form.getFieldDecorator('id', {
              initialValue: Info.id,
            })(<Input type="hidden"  />)}
          </FormItem>
          <FormItem>
            {form.getFieldDecorator('room_id', {
              initialValue: Info.room_id,
            })(<Input type="hidden"  />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发票抬头">
            {form.getFieldDecorator('title', {
              initialValue: Info.title,
            })(<Input  disabled  />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="纳税人识别号">
            {form.getFieldDecorator('identification_no', {
              initialValue: Info.identification_no,
            })(<Input disabled />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电话号码">
            { form.getFieldDecorator('telephone', {
              initialValue: Info.telephone,
            })
            (<Input  disabled />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电子邮箱">
            {form.getFieldDecorator('email', {
              initialValue: Info.email,
            })(
              <AutoComplete
                style={{ width: 200 }}
                disabled
              >
                <Input />
              </AutoComplete>
            )}
          </FormItem>
          <div style={{marginTop:20,marginLeft:500}}>
            {
              Info.invoice_status === 0 ? (
                <Button type="primary" onClick={(e) => okHandle(e)}>开票</Button>
              ) : (
                null
              )
            }
          </div>
        </div>
      ): (<div />);
    };
    // 查询发票抬头
    const queryInvoiceForm = ()=>{
      return(
        <div>
          <FormItem>
            {form.getFieldDecorator('id', {
              initialValue: Info.id,
            })(<Input type="hidden"  />)}
          </FormItem>
          <FormItem>
            {form.getFieldDecorator('room_id', {
              initialValue: Info.room_id,
            })(<Input type="hidden"  />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="发票抬头">
            {form.getFieldDecorator('title', {
              initialValue: Info.title,
            })(<Input disabled />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="纳税人识别号">
            {form.getFieldDecorator('identification_no', {
              initialValue: Info.identification_no,
            })(<Input disabled />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电话号码">
            { form.getFieldDecorator('telephone', {
              initialValue: Info.telephone,
            })
            (<Input  disabled />)}
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电子邮箱">
            {form.getFieldDecorator('email', {
              initialValue: Info.email,
            })(
              <AutoComplete
                style={{ width: 200 }}
                onChange={this.handleChangeMailBox}
                disabled
              >
                <Input />
              </AutoComplete>
            )}
          </FormItem>
        </div>
      )
    };


    return (
      <Modal
        visible={modalVisible}
        onOk={okHandle}
        destroyOnClose  // 关闭时销毁 Modal 里的子元素
        onCancel={() => this.handleModalVisible()}     // 右上角x
        footer={null}
        width={800}
        bordered={false}
        bodyStyle={{height:700}}
      >
        <div style={{fontSize:20}}>
          {Info.room_address}
        </div>
        <DescriptionList style={{ marginTop: 15}}>
          <Description term="业主">{Info.owner_name}</Description>
          <Description term="手机">{Info.telephone}</Description>
          <Description term="面积">{Info.area}</Description>
          <Description term="费用">
            ¥{Info.payment_amount}
          </Description>
          <Description term="方式">
            { Info.payment_type===0 ? '微信支付':
              Info.payment_type===1 ? '现金收缴':
              Info.payment_type===2 ? '刷卡':
              Info.payment_type===3 ? '转账':'扫码'}
          </Description>
          <Description term="状态">{this.statusText(Info)}</Description>
          <Description term="收费员">{Info.casher_name}</Description>
          <Description term="收据ID">{Info.trade_no}</Description>
          <Description term="时间">{Info.invoice_time}</Description>
        </DescriptionList>
        <hr />
        <div style={{marginTop:20}}>
          更多开票信息：<Switch checkedChildren="开"  unCheckedChildren="关"  onChange={() =>this.handleSwitch()} />
        </div>
        <div  style={{marginLeft:100}}><p>点击打开才会展开下列表单</p></div>
        <div style={{marginTop:-20}}>
          {
            Info.invoice_status=== 0 ?
              openForm():queryInvoiceForm()
          }
        </div>
      </Modal>
    );
  }
  renderSimpleForm() {
    const { form: {getFieldDecorator}, InvoiceColumns: { zoneList, buildingList, unitList }} = this.props;
    const { RangePicker } = DatePicker;
    const {formValues} = this.state;
    const zonesOptions = zoneList.map(zone => <Option key={zone.id} value={zone.id} >{zone.name}</Option>);
    const buildingsOptions = buildingList.map(building => <Option key={building.id} value={building.id}>{building.name}</Option>);
    const unitsOptions = unitList.map(unit => <Option key={unit.id} value={unit.id}>{unit.name}</Option>);

    return (
      <Form onSubmit={(e) => {this.handleSearch(e,{status:formValues.status})}} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <Row gutter={{ md: 4}}>
              <Col md={8} sm={8}>
                <FormItem label="住址" >
                  {getFieldDecorator('zone_id')(
                    <Select allowClear onChange={this.handleZoneChange}   placeholder="请选择小区">
                      {zonesOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={8}>
                <FormItem>
                  {getFieldDecorator('building_id')(
                    <Select allowClear onChange={this.handleBuildingChange}   placeholder="请选择楼栋">
                      {buildingsOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={8}>
                <FormItem>
                  {getFieldDecorator('unit_id')(
                    <Select allowClear onChange={(value) => {this.handleSearch(null, {unit_id: value,status:formValues.status});}}   placeholder="请选择单元">
                      {unitsOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="日期" >
              {getFieldDecorator('dateRange')(
                <RangePicker format="YYYY-MM-DD" onChange={(dateArray, dateStrArray) => {this.handleSearch(null, {start_date: dateStrArray[0], end_date: dateStrArray[1],status:formValues.status});}} />
              )}
            </FormItem>
          </Col>

          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(
                <Input placeholder="业主姓名/手机号" onPressEnter={(e) => {this.handleSearch(e,{status:formValues.status})}} />
              )}
            </FormItem>
          </Col>

          <Col md={3} sm={24}>
            <span className={styles.submitButtons}>
              <Button htmlType="submit" style={{color:'white',background:'#9c92ff'}} >
                查询
              </Button>
              <Button style={{ marginLeft: 8 ,color:'white',background:'#9c92ff'}} onClick={this.handleFormReset} >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  // 渲染页面
  render() {
    const {InvoiceColumns:{ data },loading} = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'owner_name',
      },
      {
        title: 'ID',
        dataIndex: 'trade_no',
      },

      {
        title: '住址',
        dataIndex: 'room_address',
      },
      {
        title: '手机号',
        dataIndex: 'order_phone',
      },
      {
        title: '时间',
        dataIndex: 'invoice_time',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <span>
              {
                record.invoice_status === 0 ? (
                  <Button  style={{color:'white',background:'#9c92ff'}} onClick={(e) => this.handleMoreInvoice(record, e)} size="small" >开票</Button>
                ) : (
                  <Button  style={{color:'white',background:'#9c92ff'}} onClick={(e) => this.handleMoreInvoice(record, e)} size="small" >详情</Button>
                )
              }
            </span>
          );
        },
      },
    ];
    return (
      <Card>
        <div className={styles.tableList}>
          <div><a style={{fontSize:20,color:'black'}}>发票</a></div>
          <div className={styles.tableListForm}>{this.stepsForm()}</div>
          <div style={{marginTop:60}} className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <div style={{width:280}}>{this.titleForm()}</div>
          <StandardTable
            selectedRows={this.state.selectedRows}
            loading={loading}
            data={data}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            rowKey='id'
            needShowSelect={false}
          />
        </div>
        {this.createForm()}
      </Card>

    );
  }
}
