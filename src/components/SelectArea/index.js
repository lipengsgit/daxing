import React from 'react';
import { connect } from 'dva';

import {
  Cascader,
} from 'antd';

/**
 * 组件说明
 * props:
 *    参数名称        必须  类型      默认值     说明
 *    adcode          是    数组      数组      修改时 需要添加的参数 需要级联显示 地区 如 ['610000','610100','610111']
 *
 */
@connect(({ selectArea, loading }) => ({
  selectArea,
  loading: loading.models.selectArea,
}))
export default class SelectArea extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      options:[],

    };
  }
  componentDidMount(){
    const {dispatch,adcode=[]} = this.props;
      dispatch({
        type: 'selectArea/getArea',
        callback: (response) => {
          const result=[]
          response.data.areas.map((key) =>
            result.push(
              {
                value: key.adcode,
                label: key.name,
                level: key.level,
                citycode:key.citycode,
                isLeaf:false,
              }
            )
          )
          this.setState({options: result});
         // 判断如果参数有值 则是设置默认的选中项
          if(adcode.length>0){
            this.loadDefaultCityData(adcode,result)
          }
        },
      })
  }

  onChange = (value ) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange({...value});
    }
  }

  // 2018 08 18
  queryAreas=(params,targetOption,isleaf)=>{
    const {dispatch ,adcode=[]} = this.props;
    dispatch({
      type: 'selectArea/getArea',
      payload:params,
      callback: (response) => {
        response.data.areas.map((key) =>
          targetOption.children.push(
            {
              value: key.adcode,
              label: key.name,
              level: key.level,
              citycode:key.citycode,
              isLeaf:isleaf,
            }
          )
        )
        this.setState({
          options: [...this.state.options],
        });

        if(adcode.length===1||adcode.length===0) return;
        // 查询默认区县的  onchage 用于编辑时 没有进行操作 需手动 调用onchange 赋值
        if(adcode.length>0) this.onChange(adcode); this.loadDefaultAreaData(adcode,targetOption);

      },
    })
  }



  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const params={
      citycode:targetOption.citycode,
      adcode:targetOption.value,
      level:targetOption.level,
    }
    targetOption.loading = true;
    let isleaf=false;
    // 查询城市
    if(selectedOptions.length===1){
      targetOption.loading = false;
      targetOption.children = [];
      this.queryAreas(params,targetOption,isleaf)

    }
    // 查询区县
    if(selectedOptions.length===2){
      isleaf=true;
      targetOption.loading = false;
      targetOption.children = [];
      this.queryAreas(params,targetOption,isleaf)
    }
    else{
      targetOption.loading = false;

    }

  }


   // 查询默认城市
  loadDefaultCityData = (selectedOptions,result) => {
       // 根据参数个数判断查询目标
        const targetCityOption = result.find(
            data => {
              return data.value === selectedOptions[0];
            },
           )
          const params={
            citycode:targetCityOption.citycode,
            adcode:targetCityOption.value,
            level:targetCityOption.level,
          }
          // 查询城市
          targetCityOption.loading = false;
          targetCityOption.children = [];
          this.queryAreas(params,targetCityOption,false)
    }

  // 查询默认区县
  loadDefaultAreaData = (selectedOptions,result) => {
    // 根据参数个数判断查询目标
     const  targetAreaOption = result.children.find(
        data => {
          return data.value === selectedOptions[1];
        },
      )

    if(targetAreaOption===undefined){
       return false;
    }
      const params={
        citycode:targetAreaOption.citycode,
        adcode:targetAreaOption.value,
        level:targetAreaOption.level,
      }
      // 查询区县
     targetAreaOption.loading = false;
     targetAreaOption.children = [];
     this.queryAreas(params,targetAreaOption,true)

  }

  render() {
    return (
      <div>
        <Cascader
          defaultValue={this.props.adcode}
          options={this.state.options}
          loadData={this.loadData}
          onChange={this.onChange}
          placeholder="请选择地区"
          changeOnSelect
        />
      </div>
    );
  }
}
