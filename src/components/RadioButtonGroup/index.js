import React, {PureComponent} from 'react';
import {
  Radio,
} from 'antd';

export default class RadioButtonGroup extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {data, onChange, defaultValue} = this.props;
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;

    const radioButtons = data.map((key) => {
      return (<RadioButton key={key.id} value={key.id}>{key.name}</RadioButton>);
    });
    return (
      <RadioGroup onChange={e => onChange(e)} defaultValue={defaultValue} buttonStyle="solid" >
        {radioButtons}
      </RadioGroup>
    );
  }

}
