import React, {Component} from 'react';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: ''
    };
    this.uploadDocumentRequest = this.uploadDocumentRequest.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  uploadDocumentRequest() {
    console.log("i'm here 1: uploadDocumentRequest: ", this.state.file, this.state.name);
    let data = new FormData();
    data.append('file', this.state.file);
    data.append('name', 'default name');

    fetch('/api/uploadHandler', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      },
      body: data
    });
    // .then(response => response.json())
    // .then(resJSON => {
    //   if (resJSON) {
    //     this.reactAlert.showAlert('search profile updated', 'info');
    //     this.props.reload();
    //   } else { throw 'Server returned false'; }
    // })
    // .catch(() => this.reactAlert.showAlert('Unable to update search criteria', 'error'))
    // .then(this.props.toggleControlBar);
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    this.setState({ file });
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileUpload} />
        <button onClick={this.uploadDocumentRequest}>Submit Upload</button>
      </div>
    );
  }
}

export default FileUpload;
