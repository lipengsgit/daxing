import { Table, Input, InputNumber, Popconfirm, Form ,Card,Button,Divider,Upload,Icon } from 'antd';
import React,  { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import uuid from 'uuid';
import {connect} from "dva/index";
import {message} from "antd/lib/index";
import {routerRedux} from "dva/router";
import CommonUpload from '../../components/Uploader/CommonUpload';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

var image_folder_no;
var icon_folder_no;

 class EditableCell extends React.Component {


   state = {
       image_folderNo: uuid(),
       icon_folderNo:uuid(),
     };

   getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

 //类型图片上传
  getImageUpload=(record)=>{
   if(record.isNew){
     image_folder_no=this.state.image_folderNo
   }else{
     image_folder_no= (record.image.folder_no==="" ||record.image.folder_no===null ||record.image.folder_no===undefined ? this.state.image_folderNo : record.image.folder_no )
   }
      return (
      <CommonUpload uploadType='photo' folderNo={image_folder_no} total={1} />
    );
  }
  //类型图标上传
   getIconUpload=(record)=>{
     if(record.isNew){
       icon_folder_no=this.state.icon_folderNo
     }else{
       icon_folder_no= (record.icon.folder_no==="" ||record.icon.folder_no===null ||record.icon.folder_no===undefined ? this.state.icon_folderNo : record.icon.folder_no )
     }
     return (
       <CommonUpload uploadType='photo' folderNo={icon_folder_no} total={1} />
     );
   }



  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      loading,
      required,
      image_upload,
      icon_upload,
      index,
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
                    })(<Input   placeholder="必填" />)}
                  </FormItem>
                ) : restProps.children}
              </td>
            );
          }
          else if (icon_upload){
            return (
              <td {...restProps}>
                {editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {getFieldDecorator("icon_folder_no", {
                      initialValue: icon_folder_no,
                    })(this.getIconUpload(record))}
                  </FormItem>
                ) :  (
                     <img src={record[dataIndex]}/>
                  )

                }
              </td>
            );
          }

          else if (image_upload){
            return (
              <td {...restProps}>
                {editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {getFieldDecorator('image_folder_no', {
                      initialValue:image_folder_no,
                    })(this.getImageUpload(record))}
                  </FormItem>
                ) :  (
                 <img src={record}/>
                )
                }
              </td>
            );
          }
          else{
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

export default class Test extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      data:[],
      pagination:[],
      formValues: {},
      editingKey: '',
      saveKey :false ,
      savetemp:false,

    };

/*    const propState = this.props.location.state;
    if (propState !== undefined){
      this.state.formValues = propState.formValues;
      const { dispatch } = this.props;
      dispatch({
        type: 'equipmentes/setPagination',
        payload: propState.pagination,
      });
    }*/



    this.columns = [
      {
        title: '设备类型名称',
        dataIndex: 'name',
        width: '25%',
        editable: true,
        required:true,
      },
      {
        title: '排序',
        dataIndex: 'sequence',
        width: '10%',
        editable: true,
      },

      {
        title: '类型图标',
        dataIndex: 'icon',
        key: 'icon',
        width: '20%',
        icon_upload:true,
        editable: true,

      },


      {
        title: '类型图片',
        dataIndex: 'image',
        key: 'image',
        width: '20%',
        image_upload:true,
        editable: true,
      },

      {
        title: '操作',
        width: '15%',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          //保存
          const savetable=this.state.saveKey;
          if(editable){
            if(savetable){
              return (
                <div>
                 <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.add(form)}
                        style={{ marginRight: 8 }}
                      >
                        添加
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="确认取消?"
                    onConfirm={() => this.save_cancel(record.id)}
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
                        href="javascript:;"
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
             <a onClick={() => this.configure(record)}>配置</a>
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

  //返回数据 从props 中获取数据
 /* componentDidMount() {
    const { dispatch } = this.props;
     dispatch({
      type: 'equipmentes/fetch',

    });
  }*/


  // 直接返回数据 设置状态
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentes/fetch',
      callback: (response) => {
        this.setState({
          data:response.list,
          pagination:response.pagination,
        })
      },
    });
  }


  getFetchParams = (pagination, filtersArg, sorter) => {
    const p = pagination === undefined ? this.props.equipmentes.data.pagination : pagination;
    const { formValues } = this.state;

    let filters = {};
    if(filtersArg){
      filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
      }, {});
    }

    const params = {
      ...formValues,
      ...filters,
    };
    if(p && p.current){
      params.page = p.current;
    }
    if(p && p.page_size){
      params.per_page = p.page_size;
    }
    if (sorter && sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    return params;
  }



  // 刷新页面
  refreshTable =  () => {

    this.props.dispatch({
      type: 'equipmentes/fetch',
      callback: (response) => {
        this.setState({
          data: response.list,
          pagination:response.pagination
        })
      },
    })
  }
  //编辑刷新页面
  edit_refreshTable =  () => {
    const param = {
      page:this.state.pagination.current,
      per_page:this.state.pagination.pageSize,
    }
    this.props.dispatch({
      type: 'equipmentes/fetch',
      payload:param,
      callback: (response) => {
        this.setState({
          data: response.list,
          pagination:response.pagination
        })
      },
    })
  }


  isEditing = (record) => {
    return record.id === this.state.editingKey;
  };
  edit(id) {
    let savetemp=this.state.savetemp;
    if(savetemp){
      this.save_cancel(this.state.editingKey)
    }
    this.setState({ editingKey: id });
    this.setState({saveKey :false });
  }

  //配置设备
  configure(record){
       this.props.dispatch(routerRedux.push(`/device_mangement/configure/`+record.id));
  }

 // 新增
  index = 0;
  handleAdd = () => {
    let newData
    let datasource=[...this.state.data];
    if(datasource.length>0){
      newData =datasource.map(item => ({ ...item }));
    }
    if(newData.length==0){
      newData.unshift({
        id: `NEW_TEMP_ID_${this.index}`,
        name: '',
        sequence: '',
        editable: true,
        isNew: true,
      });
    }
    else if(! newData[0].isNew){
      newData.unshift({
        id: `NEW_TEMP_ID_${this.index}`,
        name: '',
        sequence: '',
        editable: true,
        isNew: true,

      });
    }else{
      return false;
    }
    //如果当前页面显示 不下， 则删除最后一条
    let pagesize=this.state.pagination.pageSize
    if(newData.length>pagesize){
      newData=newData.slice(0,-1);
    }
    this.setState({ editingKey: `NEW_TEMP_ID_${this.index}`});
    this.index += 1;
    //设置 添加按钮状态
    this.setState({savetemp:true});
    this.setState({saveKey:true});
    this.setState({ data: newData });
  }


  // 删除设备
  remove(id) {
    const {dispatch} =this.props
    dispatch({
      type:'equipmentes/delete_equipment', // 如果在 model 外调用，需要添加 namespace
      payload: {
        id:id,
      },
      callback:(response)=>{
        if(response.success===true){
          this.refreshTable();
          message.success('删除成功')
        }else{
          message.error('删除失败')
        }
      }
    })
  }
  //新增添加
  add(form){
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
         const {dispatch} =this.props
        dispatch({
          type: 'equipmentes/save_equipment',
          payload:{
            name :row.name,
            sequence:row.sequence,
            image_folder_no:row.image_folder_no,
            icon_folder_no:row.icon_folder_no,
           },
          callback: (response) => {
            if (response.success === true){
              //添加成功后 要删除之前的临时数据
              let savetemp=this.state.savetemp;
              if(savetemp){
                this.save_cancel(this.state.editingKey)
              }
              this.setState({editingKey: '' });
              this.refreshTable();
              message.success('操作成功');
            }else{
              message.success('操作失败');
            }
          },
        });

    });
  }

  // 修改保存
  save(form, id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
        const {dispatch} =this.props
        dispatch({
         type: 'equipmentes/edit_equipment',
         payload:{
           name :row.name,
           sequence:row.sequence,
           image_folder_no:row.image_folder_no,
           icon_folder_no:row.icon_folder_no,
           id:id,
         },
         callback: (response) => {
           if (response.success === true){
             this.setState({editingKey: '' });
             this.edit_refreshTable();
             message.success('操作成功');
           }else{
             message.success('操作失败');
           }
         },
       });
     });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };
  //新增是 取消
  save_cancel=(id)=>{
    const dataSource = [...this.state.data];
    const newData = dataSource.filter(item => item.id !== id);
    this.setState({data: newData});
    this.setState({savetemp:false});
    this.setState({ editingKey: '' });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {

   //分页之前先清空之前的临时数据 先判断有没有打开未取消的临时数据，
    let savetemp=this.state.savetemp;
    if(savetemp){
      this.save_cancel(this.state.editingKey)
    }
    this.setState({
      editingKey: ""
    }, () => {
      const { dispatch } = this.props;
      const param = {
        page: pagination,
        per_page:filtersArg
      }
      dispatch({
        type: 'equipmentes/fetch',
        payload: param,
        callback: (response) => {
          this.setState({
            data: response.list,
            pagination:response.pagination,
          })
        },
      });

    })



  };
  render() {

    const { loading } = this.props;
     const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      onChange:this.handleTableChange,

      pageSize:this.state.pagination.pageSize,
      total: this.state.pagination.total,
      current:this.state.pagination.current,
  };


    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

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
          icon_upload:col.icon_upload,
          image_upload:col.image_upload,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div>
        <PageHeaderLayout
          title="设备类型"
        >
          <Card title="设备类型" bordered={false}>
      <Button
        style={{ marginTop: 16, marginBottom: 8 }}
        type="primary"
        onClick={this.handleAdd}
        icon="plus"
      >
        新建
      </Button>
        <Table
        loading={loading}
        components={components}
        pagination={paginationProps}
     //   dataSource={data.list}
        dataSource={this.state.data}
        columns={columns}
        rowClassName="editable-row"
        rowKey="id"
      />
          </Card>
        </PageHeaderLayout>
      </div>

    );
  }
}


