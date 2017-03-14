// // Redux action
// export function uploadSuccess({ data }) {
//   return {
//     type: 'UPLOAD_DOCUMENT_SUCCESS',
//     data,
//   };
// }

// export function uploadFail(error) {
//   return {
//     type: 'UPLOAD_DOCUMENT_FAIL',
//     error,
//   };
// }

// export function uploadDocumentRequest({ file, name }) {
//   let data = new FormData();
//   data.append('file', document);
//   data.append('name', name);

//   return (dispatch) => {
//     axios.post('/files', data)
//       .then(response => dispatch(uploadSuccess(response))
//       .catch(error => dispatch(uploadFail(error));
//   };
// }

/*
 ... A lot of Redux / React boilerplate happens here
 like mapDispatchToProps and mapStateToProps and @connect ...
*/

// Component method


// Component render



import React, {Component} from 'react';
// import axios from 'axios';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: ''
    };
    this.uploadSuccess = this.uploadSuccess.bind(this);
    this.uploadFail = this.uploadFail.bind(this);
    this.uploadDocumentRequest = this.uploadDocumentRequest.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  uploadSuccess({ data }) {
    return {
      type: 'UPLOAD_DOCUMENT_SUCCESS',
      data,
    };
  }

  uploadFail(error) {
    return {
      type: 'UPLOAD_DOCUMENT_FAIL',
      error,
    };
  }

  uploadDocumentRequest() {
    console.log("i'm here 1: uploadDocumentRequest: ", this.state.file, this.state.name);
    let data = new FormData();
    data.append('file', this.state.file);
    data.append('name', this.state.name);
    // axios.post('/api/uploadHandler', data)
    //   .then(response => this.uploadSuccess(response))
    //   .catch(error => this.uploadFail(error));


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

    this.setState({ file, name: 'file to be uploaded' });
    // this.uploadDocumentRequest({
    //    file,
    //    name: 'Awesome Cat Pic'
    // });
  }

  render() {
    console.log("i'm here 0: ", this.state);
    return (
      <div>
        <input type="file" onChange={this.handleFileUpload} />
        <button onClick={this.uploadDocumentRequest}>Submit Upload</button>
      </div>
    );
  }
}

export default FileUpload;
