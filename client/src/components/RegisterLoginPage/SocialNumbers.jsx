


import React, {Component} from 'react';

class SocialNumbers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      instCount: 0,
      docCount: 0,
      userCount: 0
    };
    this._conditionData = this._conditionData.bind(this);
  }

  componentDidMount() {
    // fetch('/api/institutions_programs', {
    //   method: 'GET',
    //   credentials: 'same-origin'
    // })
    // .then(response => response.json())
    // .then(resJSON => this._conditionData(resJSON))
    // .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON) {
    if (resJSON) {
      const instProgDropDownList = resJSON.insts.map(inst => {
        const programs = inst.programs.map(prog => {
          return { value: prog.id, label: prog.prog_display_name };
        });
        return { value: inst.id, label: inst.inst_display_name, programs };
      });
      this.setState({ instProgDropDownList, dataLoaded: true });
    } else {
      throw 'Server returned false';
    }
  }


  render() {
    return (
      <div className='social-numbers'>

        <div className='social-number'>
          <p className='value'>2,950</p>
          <p className='type'>Users</p>
        </div>
        <div className='social-number'>
          <p className='value'>2,950</p>
          <p className='type'>Users</p>
        </div>
        <div className='social-number'>
          <p className='value'>2,950</p>
          <p className='type'>Users</p>
        </div>
      </div>
    );
  }
}

export default SocialNumbers;
