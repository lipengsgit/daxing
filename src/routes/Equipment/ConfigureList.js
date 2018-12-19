import { Table, Input,Tabs, InputNumber, Popconfirm,message, Form  ,Card,Button,Divider} from 'antd';
import React,  { PureComponent } from 'react';
import {connect} from "dva/index";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

 class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      loading,
      index,
      required,
      ...restProps
    } = this.props;


    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          if(required){
            return (
              <td {...restProps}>
                {editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `请输入 ${title}!`,
                      }],
                      initialValue: record[dataIndex],
                    })  (  <Input   placeholder="必填" /> )}
                  </FormItem>
                ) : restProps.children}
              </td>
            );
          }else{
            return (
              <td {...restProps}>
                {editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {getFieldDecorator(dataIndex, {
                      initialValue: record[dataIndex],
                    })(this.getInput())}
                  </FormItem>
                ) : restProps.children}
              </td>
            );
          }

        }}
      </EditableContext.Consumer>
    );
  }
}


@connect(({ equipmentes, loading }) => ({
  equipmentes,
  loading: loading.models.equipmentes,
}))

export default class ConfigureList extends PureComponent {

  constructor(props) {
    super(props);
    const { dispatch } = this.props;
     dispatch({
      type: 'equipmentes/configure',
      payload: {
        id: this.props.match.params.id,
      },
      callback: (response) => {
        if(response.success===true){
          this.setState({
            data_inspection:response.data.inspection_items,
            data_maintenance:response.data.maintenance_items,
          })
        }else{
          this.setState({
            data_inspection:[],
            data_maintenance:[],
          })
        }

      },
    });

   // 巡检 维护状态分离
    this.state = {
      editingKey_inspection: '',
      editingKey_maintenance: '',
      saveKey_inspection :false ,
      saveKey_maintenance :false ,
      savetemp_inspection:false,
      savetemp_maintenance:false,
      data_maintenance:[],
      data_inspection:[],
      id:this.props.match.params.id,
      // 默认巡检项目
      activeKey: "1",
    };


    this.columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        width: '40%',
        editable: true,
        required:true,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '40%',
        editable: true,
      },

      {
        title: '操作',
        width: '20%',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          // 保存判断巡检 维护
          let savetable
          if(this.state.activeKey==="1"){
             savetable=this.state.saveKey_inspection;
             }else{
            savetable=this.state.saveKey_maintenance;
          }
          const no=this.state.id;
          if(editable){
            if(savetable){
              return (
                <div>
                  <span>
                    <EditableContext.Consumer>
                      {form => (
                        <a
                          onClick={() => this.add(form ,no)}
                          style={{ marginRight: 8 }}
                        >
                        添加
                        </a>
                    )}
                    </EditableContext.Consumer>
                    <Popconfirm
                      title="确认取消?"
                      onConfirm={() => this.saveCancel(record.id)}
                    >
                      <a>取消</a>
                    </Popconfirm>
                  </span>
                </div>
              );
            }
            return (
              <div>
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        onClick={() => this.save(form, record.id)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="确认取消?"
                    onConfirm={() => this.cancel(record.id)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              </div>
            );
          }else{
           return (
             <div>
               <a onClick={() => this.edit(record.id)}>编辑</a>

               <Divider type="vertical" />
               <Popconfirm
                 title="确认删除?"
                 onConfirm={() => this.remove(record.id)}
               >
                 <a style={{ color: '#FD3F9E' }}>删除</a>
               </Popconfirm>
             </div>
           )
          }


        },
      },
    ];
  }


  onChange = (activeKey) => {
    this.setState({ activeKey });

  }

  edit(id) {
    if(this.state.activeKey==="1"){
      const savetempInspection=this.state.savetemp_inspection;
      if(savetempInspection){
     //   alert("当前巡检 新增打开")
        this.saveCancel(this.state.editingKey_inspection)
      }
      this.setState({ editingKey_inspection: id });
      this.setState({saveKey_inspection :false });
    }else{
      const savetempMaintenance=this.state.savetemp_maintenance;
      if(savetempMaintenance){
         this.saveCancel(this.state.editingKey_maintenance)
      }
      this.setState({ editingKey_maintenance: id });
      this.setState({saveKey_maintenance :false });
    }
  }


 // 新增 type=1 data_inspection  2 data_maintenance
  index = 0;
  handleAdd = (type,data) => {
    let newData=[];
    if(data.length>0){
      newData =data.map(item => ({ ...item }));
    }
    // 没有的情况下 可以新增
    if(newData.length===0){
      newData.push({
        id: `NEW_TEMP_ID_${this.index}`,
        name: '',
        description: '',
        editable: true,
        isNew: true,

      });
    }

    else if(! newData[newData.length-1].isNew){
      newData.push({
        id: `NEW_TEMP_ID_${this.index}`,
        name: '',
        description: '',
        editable: true,
        isNew: true,

      });
    }else{
      return false;
    }

   if(type==="1"){
     this.setState({ editingKey_inspection: `NEW_TEMP_ID_${this.index}`});
     this.setState({saveKey_inspection:true});
     this.setState({ data_inspection: newData });
     this.setState({savetemp_inspection:true})

   }else{
     this.setState({ editingKey_maintenance: `NEW_TEMP_ID_${this.index}`});
     this.setState({saveKey_maintenance:true});
     this.setState({ data_maintenance: newData });
     this.setState({savetemp_maintenance:true})
   }
  this.index += 1;

  }


  // 删除设备
  remove(no) {
    const {dispatch} =this.props
    if(this.state.activeKey==="1"){
      dispatch({
        type:'equipmentes/delete_inspection', // 如果在 model 外调用，需要添加 namespace
        payload: {
          id:no,
        },
        callback:(response)=>{
          if(response.success===true){
            this.refreshTable();
            message.success('删除成功')
          }else{
            message.error('删除失败')
          }
        },
      })
    }else{
      dispatch({
        type:'equipmentes/delete_maintenance', // 如果在 model 外调用，需要添加 namespace
        payload: {
          id:no,
        },
        callback:(response)=>{
          if(response.success===true){
            this.refreshTable();
            message.success('删除成功')
          }else{
            message.error('删除失败')
          }
        },
      })
    }

  }
  // 新增添加
  add(form,no){
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
     const {dispatch} =this.props
      const configType=this.state.activeKey;
      // 配置巡检项目
      if(configType==="1"){
        dispatch({
          type: 'equipmentes/config_inspection_items',
          payload:{
            id:no,
            name :row.name,
            description:row.description,
          },
          callback: (response) => {
            if (response.success === true){
              this.setState({editingKey_inspection: '' });
              this.refreshTable();
              message.success('操作成功');
            }else{
              message.success('操作失败');
            }
          },
        });
      }
      // 配置维护项目
    else{
        dispatch({
          type: 'equipmentes/config_maintenance_items',
          payload:{
            id:no,
            name :row.name,
            description:row.description,
          },
          callback: (response) => {
            if (response.success === true){
              this.setState({editingKey_maintenance: '' });
              this.refreshTable();
              message.success('操作成功');
            }else{
              message.success('操作失败');
            }
          },
        });
      }


    });
  }

  // 修改保存
  save(form, no) {
       form.validateFields((error, row) => {
      if (error) {
        return;
      }
        const {dispatch} =this.props
         if(this.state.activeKey==="1"){
           dispatch({
             type: 'equipmentes/edit_inspection',
             payload:{
               name :row.name,
               description:row.description,
               id:no,
             },
             callback: (response) => {
               if (response.success === true){
                 this.setState({editingKey_inspection: '' });
                 this.refreshTable();
                 message.success('操作成功');
               }else{
                 this.setState({editingKey_inspection: '' });
                 message.success('操作失败');
               }
             },
           });
         }else{
           dispatch({
             type: 'equipmentes/edit_maintenance',
             payload:{
               name :row.name,
               description:row.description,
               id:no,
             },
             callback: (response) => {
               if (response.success === true){
                 this.setState({editingKey_maintenance: '' });
                 this.refreshTable();
                 message.success('操作成功');
               }else{
                 this.setState({editingKey_maintenance: '' });
                 message.success('操作失败');
               }
             },
           });
         }
     });
  }


  // 刷新页面
  refreshTable = () => {
    this.props.dispatch({
      type: 'equipmentes/configure',
      payload: {
        id: this.props.match.params.id,
      },
      callback: (response) => {
        if(response.success===true){
          this.setState({
            data_inspection:response.data.inspection_items,
            data_maintenance:response.data.maintenance_items,
          })
        }

      },
    });
  }

  cancel = () => {
      if(this.state.activeKey==="1"){
      this.setState({ editingKey_inspection: '' });
    }else{
      this.setState({ editingKey_maintenance: '' });
    }

  };
  // 新增取消
  saveCancel(id){
    if(this.state.activeKey==="1"){
      const newData = this.state.data_inspection.filter(item => item.id !== id);
      this.setState({ data_inspection: newData });
      this.setState({savetemp_inspection:false})
    }else{
      const newData = this.state.data_maintenance.filter(item => item.id !== id);
      this.setState({ data_maintenance: newData });
      this.setState({savetemp_maintenance:false})
    }

  }



  // 编辑是判断是否展开可编辑
  isEditing= (record) => {
    const configType=this.state.activeKey;
    if(configType==="1"){
      return record.id === this.state.editingKey_inspection;
    }else{
      return record.id === this.state.editingKey_maintenance;
    }

  };

  render() {
    const {loading } = this.props;
    const {TabPane} = Tabs;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    // 维护
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          required:col.required,
          editing: this.isEditing(record),
        }),
      };
    });

         return (
           <div>
             <PageHeaderLayout  title="设备类型列表名称-配置">
               <Card title="" bordered={false}>
                 <Tabs  defaultActiveKey="1"   onChange={this.onChange}  activeKey={this.state.activeKey}>
                   <TabPane  tab="设备类型巡检项目" key="1">
                     <Table
                       loading={loading}
                       components={components}
                       dataSource={this.state.data_inspection}
                       columns={columns}
                       rowClassName="editable-row"
                       pagination={false}
                       rowKey="id"
                     />
                     <Button
                       style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                       type="dashed"
                       onClick={()=>this.handleAdd("1",this.state.data_inspection)}
                       icon="plus"
                     >
                      新建
                     </Button>
                   </TabPane>
                   <TabPane tab="设备类型维护项目" key="2">
                     <Table
                       loading={loading}
                       components={components}
                       dataSource={this.state.data_maintenance}
                       columns={columns}
                       rowClassName="editable-row"
                       pagination={false}
                       rowKey="id"
                     />
                     <Button
                       style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                       type="dashed"
                       onClick={()=>this.handleAdd("2",this.state.data_maintenance)}
                       icon="plus"
                     >
                        新建
                     </Button>
                   </TabPane>
                 </Tabs>
               </Card>
             </PageHeaderLayout>
           </div>
      );
  }
}


