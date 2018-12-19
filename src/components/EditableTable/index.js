import React  from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Button,
  Select,
} from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = (inputType, options) => {
    if (inputType === 'number') {
      return <InputNumber />;
    }else if(inputType === 'select'){
      const { Option } = Select;
      const selectOptions = options.optionData.map(d => <Option key={d[options.key]} title={d[options.text]}>{d[options.text]}</Option>);
      return (
        <Select placeholder="请选择">
          {selectOptions}
        </Select>
      )
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
      index,
      rules,
      options,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules,
                    initialValue: record[dataIndex],
                  })(this.getInput(inputType, options))}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);

    const propColumns = this.props.columns;
    const columns = [
      ...propColumns,
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div style={{textAlign: 'right'}}>
              {editable ? (
                this.isAdd() ? (
                  <span>
                    <EditableContext.Consumer>
                      {form => (
                        <Popconfirm title="确定要添加吗?" onConfirm={() => this.create(form)}>
                          <a style={{ marginRight: 8 }}>添加</a>
                        </Popconfirm>
                      )}
                    </EditableContext.Consumer>
                    <a href='#' onClick={(e) => this.cancel(e)}>取消</a>
                  </span>
                ) : (
                  <span>
                    <EditableContext.Consumer>
                      {form => (
                        <Popconfirm title="确定要保存吗?" onConfirm={() => this.update(form, record.key)}>
                          <a style={{ marginRight: 8 }}>保存</a>
                        </Popconfirm>
                      )}
                    </EditableContext.Consumer>
                    <a href='#' onClick={(e) => this.cancel(e)}>取消</a>
                  </span>
                )
              ) : (
                <div>
                  <a onClick={() => this.edit(record.key)} style={{ marginRight: 8 }}>编辑</a>
                  <Popconfirm title="确定要删除吗?" onConfirm={() => this.delete(record.key)}>
                    <a style={{color: 'red'}}>删除</a>
                  </Popconfirm>
                </div>
              )}
            </div>
          );
        },
      },
    ];

    this.state = {
      data: [],
      editingKey: '',
      isAdd: false,
      columns,
    };
  }

  componentWillReceiveProps(nextProps, nextContext){
    this.setState({
      data: nextProps.data,
    })
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };
  isAdd = () => {
    return this.state.isAdd;
  };
  deleteEmptyData = () => {
    const data = [...this.state.data];
    const index = data.findIndex(
      item => {
        return item.key === '';
      },
    );
    if(index > -1) data.splice(index, 1);
    return data;
  };
  new(e){
    e.preventDefault();
    if(this.state.isAdd) return;

    const data = [...this.state.data];
    data.unshift({ key: '' });
    this.setState({
      editingKey: '',
      isAdd: true,
      data,
    }, this.props.onAdd)
  }
  create(form) {
    form.validateFields((error, row) => {
      if (error) return;

      this.props.onCreate(row);
      this.setState({ editingKey: '', isAdd: false });
    });
  }
  edit(key) {
    const data = this.deleteEmptyData();
    this.setState({ editingKey: key, isAdd: false, data });
  }
  update(form, key) {
    form.validateFields((error, row) => {
      if (error) return;

      if(this.props.onUpdate) this.props.onUpdate(key, row);
      this.setState({ editingKey: '', isAdd: false });
    });
  };
  delete(key){
    if(this.props.onDelete) this.props.onDelete(key);
  };
  cancel = (e) => {
    e.preventDefault();
    const data = this.deleteEmptyData();
    this.setState({ editingKey: '', isAdd: false, data });
  };
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
    this.setState({ editingKey: '', isAdd: false });
  };
  handldePaginationTotal = (total, range, pagination) => {
    if(!pagination) return '共0条记录';

    const totalPage = Math.floor(pagination.total / pagination.page_size) + 1;
    return `共${total}条记录  第${pagination.current} / ${totalPage} 页`
  };

  render() {
    const { loading, pagination, rowKey } = this.props;
    const { columns, data } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => this.handldePaginationTotal(total, range, pagination),
      ...pagination,
    };

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const tableColumns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.inputType ? col.inputType : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          rules: col.rules ? col.rules : [],
          options: col.options,
        }),
      };
    });
    return (
      <div>
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={e => this.new(e)}
          icon="plus"
        >
          添加
        </Button>
        <Table
          components={components}
          bordered
          rowClassName="editable-row"
          loading={loading}
          rowKey={rowKey || 'key'}
          columns={tableColumns}
          pagination={paginationProps}
          dataSource={data}
          onChange={this.handleTableChange}
        />

      </div>
    );
  }
}
