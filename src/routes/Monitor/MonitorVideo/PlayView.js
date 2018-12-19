import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import {
  Card,
  Layout,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ProjectTree from '../../../components/ProjectTree';
import { playView } from '../../../utils/hikHelper';
import styles from './PlayView.less';

@connect(({ monitorVideo, loading }) => ({
  monitorVideo,
  loading: loading.models.deviceManager,
}))
export default class PlayView extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      projectId: -1,
      selectedItem: {},
      buttonControl: {
        top: false,
        left: false,
        right: false,
        bottom: false,
        leftTop: false,
        rightTop: false,
        leftBottom: false,
        rightBottom: false,

        jiaoJuIncrease: false,
        jiaoJuDecrease: false,
        jiaoDianIncrease: false,
        jiaoDianDecrease: false,
        guangQuanIncrease: false,
        guangQuanDecrease: false,
      },
      hivOperateFun:{
        top: 'PTZUp',
        left: 'PTZLeft',
        right: 'PTZRight',
        bottom: 'PTZDown',
        leftTop: 'PTZLeftUp',
        rightTop: 'PTZRightUp',
        leftBottom: 'PTZLeftDown',
        rightBottom: 'PTZRightDown',

        jiaoJuIncrease: 'PTZAddTimes',
        jiaoJuDecrease: 'PTZMinusTimes',
        jiaoDianIncrease: 'PTZFarFocus',
        jiaoDianDecrease: 'PTZNearFocus',
        guangQuanIncrease: 'PTZLargeAperture',
        guangQuanDecrease: 'PTZSmallAperture',
      },
    };

    this.state.projectId = this.props.match.params.id;
  }

  componentDidMount() {
    // playView.initOcx('PreviewOcx');
  }

  componentWillUnmount(){
    // playView.destoryOcx('PreviewOcx');
  }

  selectTreeNode = (positionId, position) => {
    this.setState({
      selectedItem: position,
    }, () => {
      console.info(this.state.selectedItem);
    });
    const { devices } = position;
    // 这里缺少根据position查询下面的所有摄像头设备
    // playView.changePlay('PreviewOcx', devices);
  }

  startControl = (buttonFlag, operateFun) => {
    const buttonControl = {
      ...this.state.buttonControl,
    };
    buttonControl[buttonFlag] = true;
    this.setState({
      buttonControl,
    });
    playView.videoControl('PreviewOcx', operateFun);
  };

  stopControl = (buttonFlag) => {
    if(this.state.buttonControl[buttonFlag]){
      const buttonControl = {
        ...this.state.buttonControl,
      };
      buttonControl[buttonFlag] = false;
      this.setState({
        buttonControl,
      });
      playView.videoControl('PreviewOcx', 'PTZStop');
    }
  };

  genControlDiv = (buttonFlag, pressClass, unPressClass, otherClass) => {
    const isOperating = this.state.buttonControl[buttonFlag];
    const operateFun = this.state.hivOperateFun[buttonFlag];

    const classObj = {};
    classObj[pressClass] = isOperating;
    classObj[unPressClass] = !isOperating;
    classObj[otherClass] = true;
    if(otherClass) {
      classObj[otherClass] = true;
    }
    const divClassNames = classNames(classObj);

    return (
      <div
        className={divClassNames}
        onMouseDown={() => this.startControl(buttonFlag, operateFun)}
        onMouseUp={() => this.stopControl(buttonFlag)}
        onMouseLeave={() => this.stopControl(buttonFlag)}
      />
    );
  };

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
      <PageHeaderLayout title='实时监控' >
        <Card bordered={false}>
          <Layout style={{ background: '#fff' }}>
            <Sider width={320} style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}>
              <div className={styles.hiv_tree_div}>
                <ProjectTree {...treeProps} />
              </div>
              <div className={styles.hiv_circle_div}>
                <div className={styles.circle_box}>
                  {this.genControlDiv('top', styles.arrow_press, styles.arrow_bg, styles.arrow_top)}
                  {this.genControlDiv('left', styles.arrow_press, styles.arrow_bg, styles.arrow_left)}
                  {this.genControlDiv('right', styles.arrow_press, styles.arrow_bg, styles.arrow_right)}
                  {this.genControlDiv('bottom', styles.arrow_press, styles.arrow_bg, styles.arrow_bottom)}

                  {this.genControlDiv('leftTop', styles.arrow_press, styles.arrow_bg1, styles.arrow_left_top)}
                  {this.genControlDiv('rightTop', styles.arrow_press, styles.arrow_bg1, styles.arrow_right_top)}
                  {this.genControlDiv('leftBottom', styles.arrow_press, styles.arrow_bg1, styles.arrow_left_bottom)}
                  {this.genControlDiv('rightBottom', styles.arrow_press, styles.arrow_bg1, styles.arrow_right_bottom)}
                </div>
                <div className={styles.button_box}>
                  <div className={styles.button_1}>
                    {this.genControlDiv('jiaoJuIncrease', styles.increase_bg1, styles.increase_bg, styles.increase)}
                    <span className={styles.text_span}>焦距</span>
                    {this.genControlDiv('jiaoJuDecrease', styles.decrease_bg1, styles.decrease_bg, styles.decrease)}
                  </div>

                  <div className={styles.button_2}>
                    {this.genControlDiv('jiaoDianIncrease', styles.increase_bg1, styles.increase_bg, styles.increase)}
                    <span className={styles.text_span}>焦点</span>
                    {this.genControlDiv('jiaoDianDecrease', styles.decrease_bg1, styles.decrease_bg, styles.decrease)}
                  </div>

                  <div className={styles.button_3}>
                    {this.genControlDiv('guangQuanIncrease', styles.increase_bg1, styles.increase_bg, styles.increase)}
                    <span className={styles.text_span}>光圈</span>
                    {this.genControlDiv('guangQuanDecrease', styles.decrease_bg1, styles.decrease_bg, styles.decrease)}
                  </div>
                </div>
              </div>
            </Sider>
            <Content style={{ padding: '0 0 0 24px' }}>
              <div className={styles.hik_content}>
                <object classID='clsid:AC036352-03EB-4399-9DD0-602AB1D8B6B9' id='PreviewOcx' name='ocx' aria-label="hiv" />
              </div>
            </Content>
          </Layout>
        </Card>
      </PageHeaderLayout>
    );
  }
}
