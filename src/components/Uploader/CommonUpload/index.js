import React from 'react';
import { stringify } from 'qs';
import uuid from 'uuid';
import {
  Upload,
  Icon,
  message,
  Button,
  Modal,
} from 'antd';
import request from '../../../utils/request';

/**
 * 上传组件说明
 * props:
 *    名称        必须  类型    默认值  说明
 *    folderNo    是  string    无    服务端保存文件组key值，默认使用传入的值到服务端查询已上传参数
 *    multiple    否  boolean  true   支持文件多选
 *    fileList    否   array    []    文件列表
 *    size        否  number    5     单个文件大小限制，单位MB
 *    total       否  number    10    最多上传文件个数
 *    accept      否  string    无    上传文件类型
 *    uploadType  否  string    无    上传组件类型，默认普通文件列表，‘photo’为照片墙
 *    disabled    否  boolean  false  禁用
 *
 */
class CommonUpload extends React.PureComponent {
  constructor(props){
    super(props);


    const folderNo = this.props.folderNo || uuid();
    const multiple = this.props.multiple || true;
    const fileList = this.props.fileList || [];
    const disabled = this.props.disabled || false;

    const size = this.props.size || 5;
    const total = this.props.total || 10;


    this.state = {
      serverUrl: 'http://192.168.1.138:3010',
      fileList,
      size,
      total,
      initProps: {
        data: { folder_no: folderNo },
        multiple,
        disabled,
      },

      previewVisible: false,
      previewImage: '',
      withCredentials: false,
    }

    if(this.props.uploadType && this.props.uploadType === 'photo') {
      this.state.initProps.accept = 'image/*';
      this.state.initProps.listType = "picture-card";
    }else if(this.props.accept){
      this.state.initProps.accept = this.props.accept;
    }
  }

  componentWillMount(){
    this.initList();
  }

  initList = async () => {
    const { folderNo } = this.props;
    if(folderNo){
      try{
        const {serverUrl, withCredentials} = this.state;
        const req = await request(`${serverUrl}/api/v1/file_folders?${stringify({folder_no: folderNo})}`, {credentials: withCredentials});
        if(req.success === true){
          const fileList = req.data.map((file, index) => {
            return {
              uid: 0 - index,
              name: file.file_original_name,
              status: 'done',
              url: `${serverUrl}${file.url}`,
              serverId: file.id,
            };
          });
          this.setState({
            fileList,
          })
        }
      }catch(err){
        console.info(err);
      }
    }
  }

  beforeUpload = (file) => {
    const { size, total, fileList } = this.state;

    const checkTotal = fileList.length < total;
    if (!checkTotal) {
      message.error(`上传文件最大个数不能超过${total}个!`);
      file.response = { success: false }; // eslint-disable-line
    }

    const checkSize = file.size <= size * 1024 * 1024;
    if (!checkSize) {
      message.error(`上传文件最大不能超过${size}MB!`);
      file.response = { success: false }; // eslint-disable-line
    }

    return checkTotal && checkSize;
  }

  handleChange = (info) => {
    let {fileList} = info;

    // 2. 从服务器response获取文件信息
    fileList = fileList.map((file) => {
      if (file.response && file.response.success === true) {

        file.url = `${this.state.serverUrl}${file.response.data[0].url}`; // eslint-disable-line
        file.serverId = file.response.data[0].id; // eslint-disable-line
      }
      return file;
    });

    // 3. filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.success === true;
      }
      return true;
    });

    this.setState({ fileList: fileList.slice() });
  }

  handleDelete = async (file) => {
    if(this.state.initProps.disabled) return false;

    const id = file.serverId;
    try{
      const {serverUrl, withCredentials} = this.state;
      let req = await request(`${serverUrl}/api/v1/file_folders/${id}`, {
        method: 'DELETE',
        credentials: withCredentials,
      });
      if(typeof req === "string"){
        req = JSON.parse(req)
      }
      if(req.success === true){ return true; }
    }catch(err){
      console.info(err);
      message.error('删除文件失败，请稍后再试');
      return false;
    }
    message.error('删除文件失败，请稍后再试');
    return false;
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  render() {
    const { fileList, initProps, serverUrl, total, previewVisible, previewImage } = this.state;
    const { uploadType } = this.props;
    const showButton = fileList.length < total && !this.state.initProps.disabled;

    const props = {
      ...initProps,
      name:'file[]',
      action: `${serverUrl}/api/v1/file_folders`,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
      onRemove: this.handleDelete,
      onPreview: this.handlePreview,
    };

    const rederPhoto = (
      <div className="clearfix">
        <Upload {...props} fileList={fileList}>
          {showButton && (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          )}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );

    const renderCommon = (
      <Upload {...props} fileList={fileList}>
        { showButton && (
          <Button>
            <Icon type="upload" /> 上传
          </Button>
        )}
      </Upload>
    );

    return uploadType === 'photo' ? rederPhoto : renderCommon;
  }
}

export default CommonUpload;
