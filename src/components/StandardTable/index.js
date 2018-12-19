import React, { PureComponent, Fragment } from 'react';
import { Table, Alert, Checkbox } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        selectedRowKeys: [],
        needTotalList,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let needTotalList = [...this.state.needTotalList];
    needTotalList = needTotalList.map(item => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
      };
    });

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  handleSelectAllChange = (event) => {
    if(event.target.checked){
      this.selectAllKeys()
    } else {
      this.cleanSelectedKeys();
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  selectAllKeys = () => {
    const { data: { list }, rowKey } = this.props;
    const selectedKeys = list.map((item) => {
      return item[rowKey || 'key'];
    });
    this.handleRowSelectChange(selectedKeys, list);
  };

  handlePaginationTotal = (total, range, pagination) => {
    if(!pagination) return '共0条记录';

    const totalPage = Math.ceil(pagination.total / pagination.page_size);
    return `共${total}条记录  第${pagination.current} / ${totalPage} 页`
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data: { list, pagination }, loading, columns,
      rowKey, needRowSelection, needShowSelect, expandedKeys,
      expandedRender, showHeader,
      scroll, paginations } = this.props;
    // const rowClass = typeof rowClassName === 'function' ? rowClassName : () => { return '' };
    let paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => this.handlePaginationTotal(total, range, pagination),
      ...pagination,
      pageSize: pagination ? pagination.page_size : 10,
    };
    if(paginations) paginationProps = paginations;

    let rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    if(needRowSelection !== undefined && !needRowSelection) rowSelection = undefined;

    let alertShow = true;
    if(needShowSelect !== undefined && !needShowSelect){
      alertShow = false
    }

    let expandedRowKeys = [];
    if(expandedKeys !== undefined && expandedKeys.length > 0) expandedRowKeys = expandedKeys;

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert} style={{ display: alertShow ? 'block' : 'none' }}>
          <Alert
            message={
              <Fragment>
                {showHeader===false ? (<Checkbox onChange={this.handleSelectAllChange} style={{margin: '0 8px'}} />) : ''}
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {needTotalList.map(item => (
                  <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                    {item.title}总计&nbsp;
                    <span style={{ fontWeight: 600 }}>
                      {item.render ? item.render((item.total).toFixed(2)) : (item.total).toFixed(2)}
                    </span>
                  </span>
                ))}
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  清空
                </a>
              </Fragment>
            }
            type="info"
            showIcon={showHeader!==false}
          />
        </div>
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          expandedRowKeys={expandedRowKeys}
          expandIconAsCell={false}
          expandedRowRender={expandedRender}
          scroll={scroll}
          showHeader={showHeader!==false}
        />
      </div>
    );
  }
}

export default StandardTable;
