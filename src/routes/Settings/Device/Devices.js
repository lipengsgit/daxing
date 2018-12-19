import React, { PureComponent } from 'react';


import ProjectTable from 'components/ProjectTable';


export default class Devices extends PureComponent {


  render() {
    const redirectUrl = '/settings/devices/search/';

    return (
      <ProjectTable redirectUrl={redirectUrl} />
    );

  }
}
