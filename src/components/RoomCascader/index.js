import React, { PureComponent } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Col,
} from 'antd';

const { Option } = Select;

@connect(({ roomCascader, loading }) => ({
  roomCascader,
  loading: loading.models.roomCascader,
}))
export default class RoomCascader extends PureComponent {

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'roomCascader/fetchZones',
    })
  }

  handleZoneChange = (zoneId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roomCascader/selectZone',
      payload: zoneId,
    });
    dispatch({
      type: 'roomCascader/fetchBuildings',
      payload: {
        zone_id: zoneId,
      },
    });
    this.triggerChange({ zoneId });
  };

  handleBuildingChange = (buildingId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roomCascader/selectBuilding',
      payload: buildingId,
    });
    dispatch({
      type: 'roomCascader/fetchUnits',
      payload: {
        building_id: buildingId,
      },
    });
    this.triggerChange({ buildingId });
  };

  handleUnitChange = (unitId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roomCascader/selectUnit',
      payload: unitId,
    });
    this.triggerChange({ unitId });
  };

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange, roomCascader: { value } } = this.props;
    if (onChange) {
      onChange(Object.assign({}, value, changedValue));
    }
  };

  render() {
    const {
      roomCascader: { zones, buildings, units, value },
    } = this.props;
    const zonesOptions = zones.map(item => <Option key={item.id} value={item.id} >{item.name}</Option>);
    const buildingsOptions = buildings.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>);
    const unitsOptions = units.map(item => <Option key={item.id} value={item.id}>{`${item.name}单元`}</Option>);
    return (
      <Row gutter={{ md: 4}}>
        <Col md={8} sm={8}>
          <Select
            value={value.zoneId}
            onSelect={this.handleZoneChange}
            placeholder="请选择小区"
            allowClear
          >
            {zonesOptions}
          </Select>
        </Col>
        <Col md={8} sm={8}>
          <Select
            value={value.buildingId}
            onChange={this.handleBuildingChange}
            placeholder="请选择楼栋"
            allowClear
          >
            {buildingsOptions}
          </Select>
        </Col>
        <Col md={8} sm={8}>
          <Select
            value={value.unitId}
            onChange={this.handleUnitChange}
            placeholder="请选择单元"
            allowClear
          >
            {unitsOptions}
          </Select>
        </Col>
      </Row>
    );
  }
}
