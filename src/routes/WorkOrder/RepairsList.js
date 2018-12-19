import React from 'react';
import { connect } from 'dva';
import { Form,Button,Input,Card,Modal,Row,Col,Radio,Rate,message,Select,Steps } from 'antd';
import StandardTable from '../../components/StandardTable';
import SelectHouse1 from '../../components/SelectHouse1';
import SelectHouse from '../../components/SelectHouse';
import { getTableParams } from '../../utils/componentUtil';
import styles from '../UserManager/UserList.less';
import style from '../Forms/style.less';
import {patternRule} from "../../utils/asyncValidatorHelper";

const RadioGroup = Radio.Group;
const {Option} = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Step } = Steps;


@connect(({ repairsList, loading }) => ({
  repairsList,
  loading: loading.models.repairsList,
}))
@Form.create()
export default class RepairsList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      formValues: { status: 0,order_type:1 },   // 重置
      modalVisible: false,// 待审核
      modalVisibleIng:false, // 进行中
    //  modalVisibleFinished:false, // 已完成
      modalOpenedVisible:false,// 已完成,已评价
      newVisible:false,  // 新建
      statusOptionValue:'1',
      stepsStatus: 0,  // 步骤条'
      selectVisible:false, // 房屋选择框
      selectData:{
        room_id:'',
        address:'',
      },
    };

  }
  componentWillMount(){
    const { dispatch } = this.props;
    const params = this.getFetchParams();
    dispatch({
      type: 'repairsList/fetch',
      payload: params,
    });
    dispatch({
      type: 'repairsList/fetchZones',
      payload: {
        page: 1,
        per_page: 999999,
      },
    });
  };

  // 分页事件
  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.repairsList.data.pagination : pagination;
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
      type: 'repairsList/fetch',
      payload: {...params,status:formValues.status,order_type:1},
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };

  //  列表查询
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
      }else if(values.status===2){
        this.setState({
          stepsStatus:2,
        })
      }else{
        this.setState({
          stepsStatus:3,
        })
      }
      this.setState({
        formValues: values,
      }, () => {
        const params = this.getFetchParams({current:1, page_size:10});
        dispatch({
          type: 'repairsList/fetch',
          payload: params,
        });
      });
    });
  };
  handleZoneChange = (value) => {
    const {formValues} = this.state;
    this.props.dispatch({
      type: 'repairsList/fetchBuildings',
      payload: {
        zone_id: value,
        page: 1,
        per_page: 999999,
      },
    });
    this.handleSearch(null, {zone_id: value,status:formValues.status,order_type:1});
  };

  handleBuildingChange = (value) => {
    const {formValues} = this.state;
    this.props.dispatch({
      type: 'repairsList/fetchUnits',
      payload: {
        building_id: value,
        page: 1,
        per_page: 999999,
      },
    });
    this.handleSearch(null, {building_id: value,status:formValues.status,order_type:1});
  };
  refreshTable=()=>{
    const { dispatch } = this.props;
    const params = this.getFetchParams();
    dispatch({
      type: 'repairsList/fetch',
      payload: params,
    });
  }
  //  提交按钮
  handleSubmit=(e,selectParam)=>{
    if(e) e.preventDefault();
    const {form,repairsList:{dataInfo}} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {...fieldsValue,...selectParam};
      this.setState({
        formValues: values,
      }, () => {
        this.props.dispatch({
          type: 'repairsList/principalAssign',
          payload: {
            id: dataInfo.id,
            assign:fieldsValue.id,
          },
          callback: (response) => {
            if (response.success === true) {
              message.success('提交成功');
              this.handleModalVisible();
              this.refreshTable();
            } else {
              message.success('操作失败')
            }
          },
        });
      })
    })
  }
  // 提交驳回
  handleSubmitReturn=(e,selectParam)=>{
    if(e) e.preventDefault();
    const {form,repairsList:{dataInfo}} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {...fieldsValue,...selectParam};
      this.setState({
        formValues: values,
      }, () => {
        this.props.dispatch({
          type: 'repairsList/rejectAssign',
          payload: {
            id: dataInfo.id,
            result:fieldsValue.result,
          },
          callback: (response) => {
            if (response.success === true) {
              message.success('提交成功');
              this.handleModalVisible();
              this.refreshTable();
            } else {
              message.success('操作失败')
            }
          },
        });
      })
    })
  }
  // 完成按钮
  okAccomplish =()=>{
    const {repairsList:{dataInfo}} = this.props;
    this.props.dispatch({
      type: 'repairsList/completeButton',
      payload: {
        id: dataInfo.id,
        result:dataInfo.result,
      },
      callback: (response) => {
        if (response.success === true) {
          message.success('已完成');
          this.handleIngVisible();
          this.refreshTable();
        } else {
          message.success('操作失败')
        }
      },
    });
  }
  //  得到待审核的信息
  findUser =()=>{
    this.props.dispatch({
      type: 'repairsList/fetchUser',
    });
  }
  handleDetailsForm = (no, e) => {
    e.preventDefault();
    if(no !== '' && no !==null) {
      this.props.dispatch({
        type: 'repairsList/fetchDetails',
        payload: {
          id: no,
        },
      });
      this.findUser();
      this.handleModalVisible(true);
    }
  };
  //  得到进行中的信息
  handleGoing = (no, e) => {
    e.preventDefault();
    if(no !== '' && no !==null) {
      this.props.dispatch({
        type: 'repairsList/fetchDetails',
        payload: {
          id: no,
        },
      });
      this.handleIngVisible(true);
    }
  };
  // 得到已完成的信息
  handleFinish = (no, e) => {
    e.preventDefault();
    if(no !== '' && no !==null) {
      this.props.dispatch({
        type: 'repairsList/fetchDetails',
        payload: {
          id: no,
        },
      });
      this.handleGoingVisible(true);
    }
  };
  //  得到已评价的信息
  handleAppraised = (no, e) => {
    e.preventDefault();
    if(no !== '' && no !==null) {
      this.props.dispatch({
        type: 'repairsList/fetchDetails',
        payload: {
          id: no,
        },
      });
      this.props.dispatch({
        type: 'repairsList/fetchAppraise',
        payload: {
          id: no,
        },
      });
      this.handleGoingVisible(true);
    }
  };
  // 新建报修工单
  selectOption = (selectValue)=>{
    this.setState({
      formValues: selectValue,
    })
  }
  // 提交新建
  handleSave =()=>{
    const {form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if(fieldsValue.room_id.length !==3){
        return;
      }
      if(fieldsValue.content==='4'){
        Object.defineProperty(fieldsValue,"content",{value :fieldsValue.desc})
      };
      this.props.dispatch({
          type: 'repairsList/addNewRepairs',
          payload: {
            content: fieldsValue.content,
            room_id:fieldsValue.room_id[2],
            order_type:1,
            phone:fieldsValue.phone,
            reporter_name:fieldsValue.reporter_name,
            source:0,

          },
        });
        this.handleNewVisible();
        this.refreshTable();

    })
  }

  //  弹出详情信息
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  //  弹出进行中
  handleIngVisible = flag => {
    this.setState({
      modalVisibleIng: !!flag,
    });
  };
  //  弹出已完成
  handleGoingVisible = flag => {
    this.setState({
      modalOpenedVisible: !!flag,
    });
  };
  // 关闭进行中
  closedModal = () => {
    this.setState({
      modalOpenedVisible: false,
    });
  };
  //  弹出新建
  handleNewVisible = flag => {
    this.setState({
      newVisible:  !!flag,
      selectData: {
        ...this.state.selectData,
        room_id: '',
        address: '',

      },
    });
  };

  // 弹出房屋选择框
  handleCheckHouse=flag=> {
    this.setState({
      selectVisible:  !flag,
    });
  }
  // 房屋选择后反填数据
  selectData=(data)=>{
    this.setState({
      selectData: {
        ...this.state.selectData,
        room_id: data.id,
        address: data.address,

      },
      selectVisible:  false,
    })
  }

  // 详细信息切换类型
  handleChange = e => {
    this.setState({
      statusOptionValue: e.target.value,
    });
  };
  // 步骤条
  stepsForm() {
    const {stepsStatus} = this.state;
    const getTitleOne = () => {
      return stepsStatus===0 ?(
        <Button type="primary" shape="circle" onClick={()=>{this.handleSearch(null,{status: 0,order_type:1});}} >1</Button>
      ):stepsStatus===1?(
        <Button  shape="circle" onClick={()=>{this.handleSearch(null,{status: 0,order_type:1});}} >1</Button>
      ):stepsStatus===2?(
        <Button  shape="circle" onClick={()=>{this.handleSearch(null,{status: 0,order_type:1});}} >1</Button>
      ):(
        <Button  shape="circle" onClick={()=>{this.handleSearch(null,{status: 0,order_type:1});}} >1</Button>
      )
    };
    const getTitleTwo = () => {
      return stepsStatus===0 ?(
        <Button shape="circle"  onClick={()=>{this.handleSearch(null,{status: 1,order_type:1});}} >2</Button>
      ):stepsStatus===1 ?(
        <Button type="primary" shape="circle"  onClick={()=>{this.handleSearch(null,{status: 1,order_type:1});}} >2</Button>
      ):stepsStatus===2 ?(
        <Button shape="circle"  onClick={()=>{this.handleSearch(null,{status: 1,order_type:1});}} >2</Button>
      ):(
        <Button shape="circle"  onClick={()=>{this.handleSearch(null,{status: 1,order_type:1});}} >2</Button>
      )
    };
    const getTitleThird = () => {
      return stepsStatus===0 ? (
        <Button shape="circle" onClick={()=>{this.handleSearch(null,{status: 2,order_type:1});}} >3</Button>
      ):stepsStatus===1 ? (
        <Button shape="circle" onClick={()=>{this.handleSearch(null,{status: 2,order_type:1});}} >3</Button>
      ):stepsStatus===2 ? (
        <Button type="primary" shape="circle" onClick={()=>{this.handleSearch(null,{status: 2,order_type:1});}} >3</Button>
      ):(
        <Button shape="circle" onClick={()=>{this.handleSearch(null,{status: 2,order_type:1});}} >3</Button>
      )
    };
    const getTitleAppraise = () => {
      return stepsStatus===0 ?(
        <Button shape="circle" onClick={()=>{this.handleSearch(null,{status: 4,order_type:1});}} >4</Button>
      ):stepsStatus===1 ?(
        <Button shape="circle" onClick={()=>{this.handleSearch(null,{status: 4,order_type:1});}} >4</Button>
      ):stepsStatus===2 ?(
        <Button shape="circle" onClick={()=>{this.handleSearch(null,{status: 4,order_type:1});}} >4</Button>
      ):(
        <Button type="primary" shape="circle" onClick={()=>{this.handleSearch(null,{status: 4,order_type:1});}} >4</Button>
      )
    };
    return(
      <Steps  className={style.steps}>
        <Step title="已提交" icon={getTitleOne()} />
        <Step title="进行中" icon={getTitleTwo()} />
        <Step title="已完成" icon={getTitleThird()} />
        <Step title="已评价" icon={getTitleAppraise()} />
      </Steps>
    )
  }
  // 新建
  addModel() {
    const {form} = this.props;
    const {newVisible, selectVisible} = this.state;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 12},
    };
    const {getFieldDecorator} = this.props.form;
    const props = {
      handleNewVisible: this.handleCheckHouse,
      selectVisible: selectVisible,
      selectData: this.selectData,
    }
    return (
      <Modal
        visible={newVisible}
        destroyOnClose  // 关闭时销毁 Modal 里的子元素
        onCancel={() => this.handleNewVisible()}
        onOk={this.handleSave}
      >
        <Form>
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('reporter_name', {
              rules: [
                {

                  message: '请输入姓名',
                },
                patternRule('name'),
              ],
            })(<Input placeholder="请输入" />)}
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
            })(<Input />)}
          </FormItem>
          <FormItem  {...formItemLayout} label="房屋选择">
            {getFieldDecorator('room_id')(
              <SelectHouse1 />
            )}
          </FormItem>
          <FormItem  {...formItemLayout} label="选择房屋">
            <Row gutter={18}>
              <Col span={18}>
                {getFieldDecorator('address', {
                  initialValue: this.state.selectData.address,
                })(
                  <Input disabled />
                )}
              </Col>
              <Col span={6}>
                <Button onClick={() => this.handleCheckHouse()} >请选择</Button>
              </Col>
            </Row>

          </FormItem>

          <FormItem>
            {form.getFieldDecorator('room_id', {
              initialValue: this.state.selectData.room_id,
            })(<Input type="hidden" />)}
          </FormItem>
          <SelectHouse {...props} />

          <FormItem {...formItemLayout} label="故障类型">
            {getFieldDecorator('content', {})(
              <Select
                placeholder="请选择"
                showSearch
              >
                <Option value="室内温度低于18℃">室内温度低于18℃</Option>
                <Option value="进、回水管温度低">进、回水管温度低</Option>
                <Option value="进、回水管漏水">进、回水管漏水</Option>
                <Option value="4">其它</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="故障描述:" style={{display: form.getFieldValue('content') === '4' ? '' : 'none'}}>
            {getFieldDecorator('desc')(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Form>
      </Modal>

      /* <Modal
        visible={newVisible}
        destroyOnClose  // 关闭时销毁 Modal 里的子元素
        onCancel={() => this.handleNewVisible()}
        footer={null}
        width={400}
        bodyStyle={{height:320,marginTop:200}}
      >
        <Form onSubmit={this.handleSave} layout="inline">
          <FormItem {...formItemLayout} label="姓名">
            {form.getFieldDecorator('reporter_name', {
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="故障类型">
            {form.getFieldDecorator('content', {
            })(
              <Select
                placeholder="请选择"
                showSearch
                style={{width:200}}
              >
                <Option value="1">1、室内温度低于18℃</Option>
                <Option value="2">2、进、回水管温度低</Option>
                <Option value="3">3、进、回水管漏水</Option>
                <Option value="4">4、其它</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="故障描述:"  style={{display: form.getFieldValue('content') === '4' ? '' : 'none'}}>
            {form.getFieldDecorator('publicUsers')(
              <Input  placeholder="请输入" />

            )}
          </FormItem>

          <FormItem {...formItemLayout} label="住址">
            <SelectHouse />
            {form.getFieldDecorator('address', {
             // rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号">
            {form.getFieldDecorator('phone', {
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <div style={{marginLeft:60,marginTop:60}}>
            <Button htmlType="submit" type="primary">
            完成
            </Button>
            <Button onClick={() => this.handleNewVisible()} style={{marginLeft:60}} >
            取消
            </Button>
          </div>
        </Form>
      </Modal> */
    )
  }
  // 弹出详细信息
  first(){
    const {repairsList:{ dataInfo,userList},form} = this.props;
    const { modalVisible} = this.state;
    const nameOption = userList.map(name => <Option key={name.id} value={name.id} >{name.full_name}</Option>);
    // 审核
    const checkForm = (
      <div>
        {
          <Form >
            <FormItem >
              {form.getFieldDecorator('id', {
              })(
                <Select placeholder="请选择"  onChange={this.selectOption} style={{width:200}}>
                  {nameOption}
                </Select>
              )}
            </FormItem>
            <div style={{marginTop:130,marginLeft:120}}>
              <Button type="primary"  onClick={(e) => this.handleSubmit(e)} >提交</Button>
            </div>
          </Form>
        }
      </div>
    )
    // 驳回
    const rejectedForm = (
      <Form >
        <FormItem label="驳回原因：" >
          {form.getFieldDecorator('result', {
      })(
        <TextArea autosize={{ minRows: 5, maxRows: 3 }} />
      )}
        </FormItem>
        <div style={{marginTop:80,marginLeft:120}}>
          <Button type="primary"  onClick={(e) => this.handleSubmitReturn(e)} >提交</Button>
        </div>
      </Form>
    )
    const onShow=(
      this.state.statusOptionValue=== '1' ? checkForm:rejectedForm
    )
    return(
      <Modal
        visible={modalVisible}
        destroyOnClose  // 关闭时销毁 Modal 里的子元素
        onCancel={() => this.handleModalVisible()}     // 右上角x
        footer={null}
        width={650}
        bordered={false}
        //  afterClose={() => closed()}   // Modal 完全关闭后的回调
        bodyStyle={{height:530}}
      >
        <div style={{ marginBottom: 24,height:300 }}>

          <Row style={{ marginTop: 15}}>
            <Col span={12}><span style={{marginLeft:30,fontSize:16,color:'black'}}>{dataInfo.address}</span></Col>
            <Col span={30}><span style={{marginLeft:60}}>报修人：{dataInfo.reporter_name}</span></Col>
          </Row>
          <Row style={{ marginTop: 15}}>
            <Col span={12}><span style={{marginLeft:30}}>手机号：{dataInfo.phone}</span></Col>
            <Col span={30}><span style={{marginLeft:60}}>报修时间：{dataInfo.created_at}</span></Col>
          </Row>
          <Row style={{ marginTop: 15}}>
            <Col span={12}><span style={{marginLeft:30}}>用户上报：{dataInfo.content}</span></Col>
            <Col span={12}><span style={{marginLeft:60}}>上报来源：{dataInfo.source}</span></Col>
          </Row>
          <hr />
          <div style={{marginTop:10,marginLeft:180}}>
            <FormItem >
              {form.getFieldDecorator('status')(
                <RadioGroup onChange={this.handleChange}>
                  <Radio value='1'>审核通过</Radio>
                  <Radio value='3'>驳回请求</Radio>
                </RadioGroup>
                )}
            </FormItem>
          </div>
          <div style={{marginTop:20,marginLeft:160}}>
            {onShow}
          </div>
        </div>
      </Modal>

    )
  }
  underway(){
    const { repairsList :{ dataInfo }} = this.props;
    const { modalVisibleIng} = this.state;
    return(
      <Modal
        visible={modalVisibleIng}
        onCancel={() => this.handleIngVisible()}     // 右上角x
        footer={null}
        width={650}
        bordered={false}
        // afterClose={() => this.refreshTable()}   // Modal 完全关闭后的回调
        bodyStyle={{height:260,marginTop:100}}
      >
        <Form onSubmit={this.okAccomplish} style={{ marginBottom: 24,height:300 }}>
          <Row style={{ marginTop: 15}}>
            <Col span={12}><span style={{marginLeft:30,fontSize:16,color:'black'}}>{dataInfo.address}</span></Col>
            <Col span={30}><span style={{marginLeft:60}}>报修人：{dataInfo.reporter_name}</span></Col>
          </Row>
          <Row style={{ marginTop: 15}}>
            <Col span={12}><span style={{marginLeft:30}}>手机号：{dataInfo.owner_phone}</span></Col>
            <Col span={30}><span style={{marginLeft:60}}>报修时间：{dataInfo.created_at}</span></Col>
          </Row>
          <Row style={{ marginTop: 15}}>
            <Col span={12}><span style={{marginLeft:30}}>用户上报：{dataInfo.content}</span></Col>
            <Col span={12}><span style={{marginLeft:60}}>上报来源：{dataInfo.source}</span></Col>
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
  renderSimpleForm() {
    const { form: {getFieldDecorator}, repairsList: { zoneList, buildingList, unitList }} = this.props;
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
                    <Select allowClear onChange={(value) => {this.handleSearch(null, {unit_id: value,status:formValues.status,order_type:1});}}   placeholder="请选择单元">
                      {unitsOptions}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>

          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('keyword', {
              })(
                <Input placeholder="业主姓名/手机号" onPressEnter={(e) => {this.handleSearch(e,{status:formValues.status,order_type:1});}} />
              )}
            </FormItem>
          </Col>

          <Col md={3} sm={24}>
            <span className={styles.submitButtons}>
              <Button htmlType="submit" style={{color:'white',background:'#9c92ff'}}  onClick={()=> {this.handleSearch(null,{status:formValues.status,order_type:1});}}>
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
    const {repairsList:{ data,dataInfo,dataAppraise},loading} = this.props;
    const {modalOpenedVisible,formValues} = this.state;
    const columnBase = [
      {
        title: '报修人',
        dataIndex: 'reporter_name',
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
    ];
    const columnSimple =[
      {
        title: '操作',
        render: (text, record) => {
          return (
            record.status === "待审核" ? (
              <a onClick={(e) => this.handleDetailsForm(record.id, e)}>详细信息</a>
            ) : (
              record.status === "进行中" ?(
                <a style={{color:'red'}} onClick={(e) => this.handleGoing(record.id, e)} >进行中</a>
              ):record.status === "已完成" ?(
                <a style={{color:'green'}} onClick={(e) => this.handleFinish(record.id, e)}>已完成</a>
              ):(
                <a style={{color:'blue'}} onClick={(e) => this.handleAppraised(record.id, e)}>已评价</a>
              )
            )
          );
        },
      },
    ];
    const columnAdd = [
      {
        title: '执行人',
        dataIndex: 'assign_name',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            record.status === "待审核" ? (
              <a onClick={(e) => this.handleDetailsForm(record.id, e)}>详细信息</a>
            ) : (
              record.status === "进行中" ?(
                <a style={{color:'red'}} onClick={(e) => this.handleGoing(record.id, e)} >进行中</a>
              ):record.status === "已完成" ?(
                <a style={{color:'green'}} onClick={(e) => this.handleFinish(record.id, e)}>已完成</a>
              ):(
                <a style={{color:'blue'}} onClick={(e) => this.handleFinish(record.id, e)}>已评价</a>
              )
            )
          );
        },
      },
    ];
    const columns = formValues.status === 0 ? [
      ...columnBase,
      ...columnSimple,
    ] : [
      ...columnBase,
      ...columnAdd,
    ];
    // 评价
   const person=() =>{
      return formValues.status === 4 ? (
        <div>
          <Row style={{ marginTop: 15}}>
            <Col span={12}>
              <span style={{marginLeft:10}}>服务质量：
                <Rate  defaultValue={dataAppraise.quality} disabled />
                {dataAppraise.quality && <span className="ant-rate-text">{dataAppraise.quality}星</span>}
              </span>
            </Col>
          </Row>
          <Row style={{ marginTop: 15}}>
            <Col span={12}>
              <span style={{marginLeft:10}}>服务态度：
                <Rate  defaultValue={dataAppraise.attitude} disabled />
                {dataAppraise.attitude && <span className="ant-rate-text">{dataAppraise.attitude}星</span>}
              </span>
            </Col>
          </Row>
          <Row style={{ marginTop: 15}}>
            <Col span={12}>
              <span style={{marginLeft:10}}>及时率：
                <Rate defaultValue={dataAppraise.response} disabled />
                {dataAppraise.response && <span className="ant-rate-text">{dataAppraise.response}星</span>}
              </span>
            </Col>
          </Row>
          <Row style={{ marginTop: 15}}>
            <Col span={12}>
              <span style={{marginLeft:10}}>综合评价：
                <Rate  defaultValue={dataAppraise.overall} disabled />
                {dataAppraise.overall && <span className="ant-rate-text">{dataAppraise.overall}星</span>}
              </span>
            </Col>
          </Row>
        </div>
      ) :null
    }

    return (
      <Card>
        <div className={styles.tableList}>
          <div><a style={{fontSize:20,color:'black'}}>报修工单</a></div>
          <div>{this.stepsForm()}</div>
          <div className={styles.tableListForm} style={{marginTop:60}}>{this.renderSimpleForm()}</div>
          <div><Button icon="plus" type="primary" onClick={this.handleNewVisible}>新建</Button></div>
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

        <Modal
          visible={modalOpenedVisible}
          onCancel={() => this.closedModal()}
          footer={null}
          width={500}
          bodyStyle={{height:300,marginTop:300}}
        >
          <div style={{ marginBottom: 24,height:300 }}>
            <Row style={{ marginTop: 15}}>
              <Col span={30}><span style={{marginLeft:10,fontSize:20,color:'black'}}>{dataInfo.address}</span></Col>
            </Row>
            <Row style={{ marginTop: 15}}>
              <Col span={12}><span style={{marginLeft:10}}>报修人：{dataInfo.reporter_name}</span></Col>
              <Col span={30}><span style={{marginLeft:10}}>执行人：{dataInfo.assign_name}</span></Col>
            </Row>
            <Row style={{ marginTop: 15}}>
              <Col span={12}><span style={{marginLeft:10}}>手机号：{dataInfo.phone}</span></Col>
              <Col span={30}><span style={{marginLeft:10}}>报修时间：{dataInfo.created_at}</span></Col>
            </Row>
            <Row style={{ marginTop: 15}}>
              <Col span={12}><span style={{marginLeft:10}}>故障类型：{dataInfo.content}</span></Col>
              <Col span={30}><span style={{marginLeft:10}}>完成时间：{dataInfo.complete_time}</span></Col>
            </Row>
            {
              person
            }
          </div>
        </Modal>
        {this.addModel()}
        {this.first()}
        {this.underway()}
      </Card>
    );
  }
}
