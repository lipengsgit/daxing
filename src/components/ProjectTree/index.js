import React, { PureComponent } from 'react';
import {
  Tree,
} from 'antd';

export default class ProjectTree extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      positionId: -1,
      positions: [],
    };
  }

  componentDidMount() {
    const { dispatch, fetchPositionsCallback, projectId, positionId } = this.props;

    dispatch({
      type: 'deviceManager/fetchPositions',
      payload: {projectId},
      callback: (result) => {
        if (result && result.length > 0){
          const state = {positions: result};

          if(positionId && positionId !== -1){
            state.positionId = positionId;
          }else if(this.props.defaultChecked){
            state.positionId = result[0].id;
          }
          this.setState(state);
          if(fetchPositionsCallback){
            fetchPositionsCallback(state.positionId);
          }
        }
      },
    });
  }

  treeSelect = (selectedKeys, info) => {
    const { treeSelectCallback } = this.props;
    this.setState({
      positionId: info.node.props.eventKey,
    });
    if(treeSelectCallback){
      treeSelectCallback(info.node.props.eventKey, info.node.props.dataRef);
    }
  };

  renderTreeNodes = (data) => {
    const { TreeNode } = Tree;
    return data && data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} />;
    });
  };

  render() {
    const {showLine, defaultExpandAll} = this.props;
    const treeProps = {
      showLine: showLine === undefined ? true : showLine,
      defaultExpandAll: defaultExpandAll === undefined ? true : defaultExpandAll,
      defaultExpandParent: true,
      onSelect: this.treeSelect,
      selectedKeys: [this.state.positionId.toString()],
    };

    return (
      this.state.positions.length > 0 ? (
        <Tree
          {...treeProps}
        >
          {this.renderTreeNodes(this.state.positions)}
        </Tree>
      ) : (
        null
      )
    );
  }
}
