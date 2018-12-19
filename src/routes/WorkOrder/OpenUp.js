import React from 'react';
import { connect } from 'dva';
import { Form,Button,Input,Card,Modal,Row,Col,Select,Radio ,message ,Steps} from 'antd';
import styles from '../Invoice/InvoiceColumn.less';
import style from '../Forms/style.less';
import StandardTable from '../../components/StandardTable';
import { getTableParams } from '../../utils/componentUtil';

const RadioGroup = Radio.Group;
const {Option} = Select;
const FormItem = Form.Item;
const { Step } = Steps;

@connect(({ openUp, loading }) => ({
  openUp,
  loading: loading.models.openUp,
}))
@Form.create()
export default class OpenUp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      formValues: { status: 0,order_type:0},   // 重置
      modalOpenedVisible:false, // 待开通
      modalVisible: false, // 进行中
      modalFinishVisible:false, // 已开通
      stepsStatus: 0,  // 步骤条
    };

  }
  componentWillMount() {
    const { dispatch } = this.props;
    const params = this.getFetchParams();
    dispatch({
      type: 'openUp/fetch',
      payload: params,
    });
    dispatch({
      type: 'openUp/fetchZones',
      payload: {
        page: 1,
        per_page: 999999,
      },
    });
  }

  // 分页事件
  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.openUp.data.pagination : pagination;
    const { formValues } = this.state;
    const tableParams = getTableParams(p, filtersArg, sorter);
    const params = {
      ...tableParams,
      ...formValues,
    };
    return params;
  };


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = this.getFetchParams(pagination, filtersArg, sorter);
    const { formValues } = this.state;
    dispatch({
      type: 'openUp/fetch',
      payload: {...params,status:formValues.status,order_type:0},
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
        modalOpenedVisible: false, // 待开通
        modalVisible: false, // 进行中
        modalFinishVisible: false, // 已开通

    });
  };
  refreshTable=()=>{
    const { dispatch } = this.props;
    const params = this.getFetchParams();
    dispatch({
      type: 'openUp/fetch',
      payload: params,
    });
  }
  //  得到待开通中的信息
  //  得到user的信息
  findUser =()=>{
    this.props.dispatch({
      type: 'openUp/fetchUser',
    });
  }
  handleWaitOpen = (no, e) => {
    e.preventDefault();
    if(no.id !== '' && no.id !==null) {
      this.props.dispatch({
        type: 'openUp/fetchDetails',
        payload: {
          id: no.id,
        },
      });
      this.findUser();
      this.handleModalVisibleOpen(true);
    }
  };
  //  得到进行中的信息
  handleGoing = (no, e) => {
    e.preventDefault();
    if(no !== '' && no !==null) {
      this.props.dispatch({
        type: 'openUp/fetchDetails',
        payload: {
          id: no,
        },
      });
      this.handleModalVisible(true);
    }
  };
  //  得到已开通中的信息
  handleOpened = (no, e) => {
    e.preventDefault();
    if(no !== '' && no !==null) {
      this.props.dispatch({
        type: 'openUp/fetchDetails',
        payload: {
          id: no,
        },
      });
      this.handleVisibleFinish(true);
    }
  };
  //  提交按钮
  handleOpenedSubmit=(e)=>{
    if(e) e.preventDefault();
    const {openUp:{listInfoData},form} = this.props;
    form.validateFields((err) => {
      if (err) return;
      this.props.dispatch({
        type: 'openUp/principalAssign',
        payload: {
          id: listInfoData.id,
          assign:listInfoData.id,
        },
        callback: (response) => {
          if (response.success === true) {
            message.success('提交成功');
            this.handleModalVisibleOpen();
            this.refreshTable();
          } else {
            message.success('操作失败')
          }
        },
      });
    })
  }
  // 工单完成按钮
  okAccomplish =()=>{
    const {openUp:{listInfoData}} = this.props;
      this.props.dispatch({
        type: 'openUp/completeButton',
        payload: {
          id: listInfoData.id,
          result:listInfoData.result,
        },
        callback: (response) => {
          if (response.success === true) {
            message.success('已完成');
            this.handleModalVisible();
            this.refreshTable();
          } else {
            message.success('操作失败')
          }
        },
      });
  }
//  2018 09 27
  handleSearch = (e, selectParam) => {
    if(e) e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {...fieldsValue,...selectParam};
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
      }else if(values.status===1){
        this.setState({
          stepsStatus:1,
        })
      }else{
        this.setState({
          stepsStatus:2,
        })
      }
      this.setState({
        formValues: values,
      }, () => {
        const params = this.getFetchParams({current:1, page_size:10});
        dispatch({
          type: 'openUp/fetch',
          payload: params,
        });
      });
    });
  };
  handleZoneChange = (value) => {
    const {formValues} = this.state;
    this.props.dispatch({
      type: 'openUp/fetchBuildings',
      payload: {
        zone_id: value,
        page: 1,
        per_page: 999999,
      },
    });
    this.handleSearch(null, {zone_id: value, status:formValues.status, order_type:0});
  };

  handleBuildingChange = (value) => {
    const {formValues} = this.state;
    this.props.dispatch({
      type: 'openUp/fetchUnits',
      payload: {
        building_id: value,
        page: 1,
        per_page: 999999,
      },
    });
    this.handleSearch(null, {building_id: value,status:formValues.status,order_type:0});
  };

  //  弹出待开通
  handleModalVisibleOpen = flag => {
    this.setState({
      modalOpenedVisible: !!flag,
    });
  };

  //  弹出进行中
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  //  弹出已开通
  handleVisibleFinish = flag => {
    this.setState({
      modalFinishVisible: !!flag,
    });
  };

 // 步骤条
  stepsForm() {
    const {stepsStatus} = this.state;
    const getTitleOne = () => {
      return stepsStatus===0 ?(
        <Button type="primary" shape="circle" onClick={()=>{this.handleSearch(null,{status: 0,order_type:0});}} >1</Button>
      ):stepsStatus===1 ?(
        <Button shape="circle" onClick={()=>{this.handleSearch(null,{status: 0,order_type:0});}} >1</Button>
      ):(
        <Button shape="circle" onClick={()=>{this.handleSearch(null,{status: 0,order_type:0});}} >1</Button>
      )
    };
    const getTitleTwo = () => {
      return stepsStatus===0 ?(
        <Button  shape="circle" onClick={()=>{this.handleSearch(null,{status: 1,order_type:0});}} >2</Button>
      ):stepsStatus===1 ?(
        <Button type="primary" shape="circle" onClick={()=>{this.handleSearch(null,{status: 1,order_type:0});}} >2</Button>
      ):(
        <Button  shape="circle" onClick={()=>{this.handleSearch(null,{status: 1,order_type:0});}} >2</Button>
      )
    };
    const getTitleThird = () => {
      return stepsStatus===0 ?(
        <Button  shape="circle" onClick={()=>{this.handleSearch(null,{status: 2,order_type:0});}} >3</Button>
      ):stepsStatus===1 ?(
        <Button  shape="circle" onClick={()=>{this.handleSearch(null,{status: 2,order_type:0});}} >3</Button>
      ):(
        <Button type="primary" shape="circle" onClick={()=>{this.handleSearch(null,{status: 2,order_type:0});}} >3</Button>
      )
    };
     return(
       <Steps className={style.steps}>
         <Step title="待开通" icon={getTitleOne()} />
         <Step title="进行中" icon={getTitleTwo()} />
         <Step title="已开通" icon={getTitleThird()} />
       </Steps>
     )
  }

  handleChange = e => {
    this.setState({
      formValues:{status:e.target.value} ,
    });
  };
  // 新建报修工单
  selectOption = (selectValue)=>{
    console.info(selectValue)
    this.setState({
    //  formValues: selectValue,
    })
  }
  openFirst(){
    const { openUp :{ listInfoData, userList},form} = this.props;
    const { modalOpenedVisible} = this.state;
    const nameOption = userList.map(name => <Option key={name.id} value={name.id} >{name.full_name}</Option>);
    const renderOpen = (
      <Form style={{marginLeft:250}}>
        <FormItem>
          {form.getFieldDecorator('status', {
          })(
            <RadioGroup onChange={this.handleChange} >
              <Radio value="1" >开通</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem >
          {form.getFieldDecorator('id', {
          })(
            <Select placeholder="请选择" onChange={this.selectOption} style={{width:200,marginRight:180,float:"right"}}>
              {nameOption}
            </Select>
          )}
        </FormItem>
        <div style={{marginTop:200}} >
          <Button key="submit" type="primary" onClick={(e)=>this.handleOpenedSubmit(e)} >
            提交
          </Button>
        </div>
      </Form>
    )
    return(
      <Modal
        visible={modalOpenedVisible}
        destroyOnClose
        onCancel={() => this.handleModalVisibleOpen()}
        footer={null}
        width={620}
        bodyStyle={{height:560,marginTop:200}}
      >
        <div style={{ marginBottom: 24,height:300 }}>
          <Row style={{ marginTop: 15}}>
            <Col span={12}><span style={{marginLeft:30,fontSize:16,color:'black'}}>{listInfoData.address}</span></Col>
            <Col span={30}><span style={{marginLeft:60}}>业主：{listInfoData.owner_name}</span></Col>
          </Row>
          <Row style={{ marginTop: 15}}>
            <Col span={12}><span style={{marginLeft:30}}>手机号：{listInfoData.owner_phone}</span></Col>
            <Col span={30}><span style={{marginLeft:60}}>上报时间：{listInfoData.created_at}</span></Col>
          </Row>
          <hr />
          <div>
            {renderOpen}
          </div>
        </div>
      </Modal>
    )
  }
  openSecond(){
    const { openUp :{ listInfoData }} = this.props;
    const { modalVisible} = this.state;
    return(
      <Modal
        visible={modalVisible}
        onCancel={() => this.handleModalVisible()}     // 右上角x
        footer={null}
        width={650}
        bordered={false}
       // afterClose={() => this.refreshTable()}   // Modal 完全关闭后的回调
        bodyStyle={{height:260,marginTop:100}}
      >
        <Form onSubmit={this.okAccomplish} style={{ marginBottom: 24,height:300 }}>
          <Row style={{ marginTop: 15}}>
            <Col span={12}><span style={{marginLeft:30,fontSize:16,color:'black'}}>{listInfoData.address}</span></Col>
            <Col span={30}><span style={{marginLeft:60}}>业主：{listInfoData.owner_name}</span></Col>
          </Row>
          <Row style={{ marginTop: 15}}>
            <Col span={12}><span style={{marginLeft:30}}>手机号：{listInfoData.owner_phone}</span></Col>
            <Col span={30}><span style={{marginLeft:60}}>上报时间：{listInfoData.created_at}</span></Col>
          </Row>
          <Row style={{ marginTop: 15}}>
            <Col span={12}><span style={{marginLeft:30}}>负责人：{listInfoData.assign_name}</span></Col>
            <Col span={30}><span style={{marginLeft:60}}>ID：{listInfoData.order_no}</span></Col>
          </Row>
          <hr />
          <div>
            <Button type="primary" htmlType="submit" style={{position: 'absolute',marginTop:50,marginLeft:260}}>
              完成
            </Button>
          </div>
        </Form>
      </Modal>
    )
  }

  openThird(){
    const { openUp :{ listInfoData }} = this.props;
    const {modalFinishVisible} = this.state;
  return(
    <Modal
      visible={modalFinishVisible}
      destroyOnClose  // 关闭时销毁 Modal 里的子元素
      onCancel={() => this.handleVisibleFinish()}     // 右上角x
      footer={null}
      width={700}
      bordered={false}
      // afterClose={() => closed()}   // Modal 完全关闭后的回调
      bodyStyle={{height:260,marginTop:300}}
    >
      <Form style={{ marginBottom: 24,height:300 }}>
        <Row style={{ marginTop: 15}}>
          <Col span={12}><span style={{marginLeft:30,fontSize:16,color:'black'}}>{listInfoData.address}</span></Col>
          <Col span={30}><span style={{marginLeft:60}}>业主：{listInfoData.owner_name}</span></Col>
        </Row>
        <Row style={{ marginTop: 15}}>
          <Col span={12}><span style={{marginLeft:30}}>手机号：{listInfoData.owner_phone}</span></Col>
          <Col span={30}><span style={{marginLeft:60}}>上报时间：{listInfoData.created_at}</span></Col>
        </Row>
        <Row style={{ marginTop: 15}}>
          <Col span={12}><span style={{marginLeft:30}}>负责人：{listInfoData.assign_name}</span></Col>
          <Col span={30}><span style={{marginLeft:60}}>ID：{listInfoData.order_no}</span></Col>
        </Row>
        <Row style={{ marginTop: 15}}>
          <Col span={12}><span style={{marginLeft:30}}>开通时间：{listInfoData.created_at}</span></Col>
        </Row>
      </Form>
    </Modal>
  )
  }
  renderSimpleForm() {
    const { form: {getFieldDecorator}, openUp: { zoneList, buildingList, unitList }} = this.props;
    const {formValues} = this.state;
    const zonesOptions = zoneList.map(zone => <Option key={zone.id} value={zone.id} >{zone.name}</Option>);
    const buildingsOptions = buildingList.map(building => <Option key={building.id} value={building.id}>{building.name}</Option>);
    const unitsOptions = unitList.map(unit => <Option key={unit.id} value={unit.id}>{unit.name}</Option>);

    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={15} sm={24}>
            <Row gutter={{ md: 4}}>
              <Col md={8} sm={8}>
                <FormItem label="住址" >
                  {getFieldDecorator('zone_id')(
                    <Select  onChange={this.handleZoneChange} allowClear  placeholder="请选择小区">
                      {zonesOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={8}>
                <FormItem>
                  {getFieldDecorator('building_id')(
                    <Select  onChange={this.handleBuildingChange}  allowClear placeholder="请选择楼栋">
                      {buildingsOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={8}>
                <FormItem>
                  {getFieldDecorator('unit_id')(
                    <Select allowClear onChange={(value) => {this.handleSearch(null, {unit_id: value,status:formValues.status,order_type:0});}}   placeholder="请选择单元">
                      {unitsOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword')(
                <Input placeholder="业主姓名/手机号" onPressEnter={(e) => {this.handleSearch(e,{status:formValues.status,order_type:0});}} />
              )}
            </FormItem>
          </Col>

          <Col md={3} sm={24}>
            <span className={styles.submitButtons}>
              <Button htmlType="submit" style={{color:'white',background:'#9c92ff'}} onClick={(e) => {this.handleSearch(e,{status:formValues.status,order_type:0});}}>
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
    const {formValues} = this.state;
    const { openUp :{ data },loading} = this.props;
    const columnAdd = [
      {
        title: '姓名',
        dataIndex: 'owner_name',
      },
      {
        title: 'ID',
        dataIndex: 'order_no',
      },

      {
        title: '住址',
        dataIndex: 'address',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '时间',
        dataIndex: 'created_at',
      },
      {
        title: '执行人',
        dataIndex: 'assign_name',
      },
      {
        title: '操作',
        render: (text, record) => {
          return record.status === "待审核"?(
            <Button style={{color:'white',background:'#9c92ff'}} onClick={(e) => this.handleWaitOpen(record, e)} size="small">开通</Button>
          ):
            record.status === "进行中" ?
              (
                <Button  style={{color:'white',background:'#ff2409'}} onClick={(e) => this.handleGoing(record.id, e)} size="small">进行中</Button>
              ):
              (
                <Button style={{color:'white',background:'#2bff33'}} onClick={(e) => this.handleOpened(record.id, e)} size="small" >已开通</Button>
              )
        },
      },
    ];
    const columnBase = [
      {
        title: '姓名',
        dataIndex: 'owner_name',
      },
      {
        title: 'ID',
        dataIndex: 'order_no',
      },

      {
        title: '住址',
        dataIndex: 'address',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <Button style={{color:'white',background:'#9c92ff'}} onClick={(e) => this.handleWaitOpen(record, e)} size="small">开通</Button>
          )
        },
      },
    ];

    const columns = formValues.status === 0 ? [
      ...columnBase,
    ] : [
      ...columnAdd,
    ];
    return (
      <Card>
        <div className={styles.tableList}>
          <div><a style={{fontSize:20,color:'black'}}>供暖开通工单</a></div>
          <div>{this.stepsForm()}</div>
          <div className={styles.tableListForm} style={{marginTop:60}}>{this.renderSimpleForm()}</div>
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
        {this.openFirst()}
        {this.openSecond()}
        {this.openThird()}
      </Card>
    );
  }
}
