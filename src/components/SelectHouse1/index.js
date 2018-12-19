import React from 'react';
import {connect} from 'dva';
import {
  Cascader,
} from 'antd';
@connect(({selectHouse, zones,buildings,loading}) => ({
  selectHouse,
  zones,
  buildings,
  loading: loading.models.selectHouse,
}))
export default class SelectHouse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
    };
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'zones/fetch',
      callback: (response) => {
        const result = []
        response.list.map((key) =>
          result.push(
            {
              value: key.id,
              label: key.name,
              zone_id: key.id,
              isLeaf: false,
            }
          )
        )
        this.setState({options: result});
      },
    })
  }

  onChange = (value, selectedOptions) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange({...value});
    }
  }

  // 08 29根据小区查楼栋
  queryBuild = (params, targetOption) => {
    this.props.dispatch({
      type: 'buildings/fetch',
      payload: params,
      callback: (response) => {
        response.list.map((key) =>
          targetOption.children.push(
            {
              value: key.id,
              id: key.id,
              label: key.name,
              isLeaf: false,
            }
          )
        )
        this.setState({
          options: [...this.state.options],
        });
      },
    })
  }
  // 根据楼栋查 单元房屋信息
  queryHouse = (params, targetOption) => {
    this.props.dispatch({
      type: 'selectHouse/getHouse',
      payload: params,
      callback: (response) => {
        response.data.rows.map((key) =>
          targetOption.children.push(
            {
              value: key.id,
              id: key.id,
              owner_name: key.owner_name,
              label: key.address_without_zone,
              isLeaf: true,
            }
          )
        )
        this.setState({
          options: [...this.state.options],
        })
      },
    })
  }
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // 查询楼栋
    if (selectedOptions.length === 1) {
      const params = {
        zone_id: targetOption.zone_id,
      }
      targetOption.loading = false;
      targetOption.children = [];
      this.queryBuild(params, targetOption)
    }
    // 查单元房号
    else if (selectedOptions.length === 2) {
      targetOption.loading = false;
      targetOption.children = [];
      const param = {
        building_id: targetOption.id,
      }
      this.queryHouse(param, targetOption)
    }
    else {
      targetOption.loading = false;
    }
  }

  render() {
    return (
      <div>
        <Cascader
          style={{width: '100%', marginTop: 15, zIndex: 10}}
          options={this.state.options}
          loadData={this.loadData}
          onChange={this.onChange}
          placeholder="请选择"
          changeOnSelect

        />
      </div>
    );
  }
}
