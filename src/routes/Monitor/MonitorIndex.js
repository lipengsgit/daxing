import React, { PureComponent } from 'react';

import ProjectTable from 'components/ProjectTable';

export default class MonitorIndex extends PureComponent {


  render() {

    const redirectUrl = '/monitor/project/';

    return (

      <ProjectTable redirectUrl={redirectUrl} />
    );

  }
}
