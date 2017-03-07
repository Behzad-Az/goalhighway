import React, {Component} from 'react';
import AlertContainer from 'react-alert';

class ReactAlert {
  constructor() {
    this.alertOptions = {
      offset: 14,
      position: 'bottom left',
      theme: 'dark',
      transition: 'scale'
    };

    this.icons = {
      info: <i className="fa fa-info-circle fa-fw" aria-hidden="true"/>,
      error: <i className="fa fa-exclamation-circle fa-fw" aria-hidden="true"/>
    };

    this.container = <AlertContainer ref={(a) => global.msg = a} {...this.alertOptions} />;
  }

  showAlert(content, type) {
    msg.show(content, {
      time: 2000,
      type: type,
      icon: this.icons[type]
    });
  }
}

export default ReactAlert;
