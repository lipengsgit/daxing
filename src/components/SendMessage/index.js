import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Modal,
} from 'antd';

export default class SendMessage extends PureComponent {

  render() {
    const { title, phoneNumber, show, closeSendModal, sendMessage } = this.props;
    return(
      <Modal
        width={300}
        visible={show}
        onCancel={closeSendModal}
        mask={false}
        style={{ marginTop: 270,right:55}}
        bordered={false}
        footer={
          [
            <Button key="b1" style={{position: 'absolute',left:'20px'}} type="primary" onClick={sendMessage} >
              确认
            </Button>,
            <Button key="b2" type="primary" style={{left:'-10px'}} onClick={closeSendModal}>
              取消
            </Button>,
          ]
        }
      >
        <Card bordered={false}>
          <div style={{fontWeight:650 }}>
            {title}
          </div>
          <div style={{ marginTop: 24}}>
            短信将发送至：<span style={{background:'#f1edff'}}> {phoneNumber}</span>
          </div>
        </Card>
      </Modal>
    );
  }
}
