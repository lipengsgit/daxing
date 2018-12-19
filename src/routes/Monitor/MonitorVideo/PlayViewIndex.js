import React, { PureComponent } from 'react';
import ProjectTable from '../../../components/ProjectTable';

export default class PlayViewIndex extends PureComponent {
  render() {
    const redirectUrl = '/monitor/video/playView/show/';
    return (
      <ProjectTable redirectUrl={redirectUrl} />
    );
  }
}
