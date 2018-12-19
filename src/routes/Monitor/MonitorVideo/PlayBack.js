import React from 'react';
import { connect } from 'dva';
import {
  Card,
  Layout,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ProjectTree from '../../../components/ProjectTree';
import { playBack } from '../../../utils/hikHelper';
import styles from './PlayBack.less';

@connect(({ monitorVideo, loading }) => ({
  monitorVideo,
  loading: loading.models.deviceManager,
}))
export default class PlayBack extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      projectId: -1,
      selectedItem: {},
    };
    this.state.projectId = this.props.match.params.id;
  }

  componentDidMount() {
    // playBack.initOcx('PlayBackOcx');
  }

  componentWillUnmount(){
    // playBack.destoryOcx('PlayBackOcx');
  }

  selectTreeNode = (positionId, position) => {
    this.setState({
      selectedItem: position,
    }, () => {
      console.info(this.state.selectedItem);
    });

    const { indexCode } = position;
    // 这里缺少根据position查询下面的所有摄像头设备
    // playBack.changePlay('PlayBackOcx', indexCode);
  }

  render() {
    const { dispatch } = this.props;
    const { Content, Sider } = Layout;
    const treeProps = {
      dispatch,
      projectId: this.state.projectId,
      treeSelectCallback: this.selectTreeNode,
      showLine: false,
    };

    return (
      <PageHeaderLayout title='历史回放' >
        <Card bordered={false}>
          <Layout style={{ background: '#fff' }}>
            <Sider width={320} style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}>
              <div className={styles.hiv_tree_div}>
                <ProjectTree {...treeProps} />
              </div>
            </Sider>
            <Content style={{ padding: '0 0 0 24px' }}>
              <div className={styles.hik_content}>
                <object classID='clsid:FC2CA541-806E-4015-950F-EB5B74409F44' id='PlayBackOcx' name='ocx' aria-label="hiv" />
              </div>
            </Content>
          </Layout>
        </Card>
      </PageHeaderLayout>
    );
  }
}
