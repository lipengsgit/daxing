import React, { PureComponent } from 'react';
import ProjectTable from '../../../components/ProjectTable';

export default class PlayViewIndex extends PureComponent {
  render() {
    const redirectUrl = '/monitor/video/playBack/show/';
    return (
      <ProjectTable redirectUrl={redirectUrl} />
    );
  }
}
