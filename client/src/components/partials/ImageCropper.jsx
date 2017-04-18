import React from 'react';
import CropperJS from 'react-cropperjs';

class Demo extends React.Component {

  constructor() {
    super();
    this.state = {
      pictureSelected: false,
      src: ''
    };
    this._crop = this._crop.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  _crop() {
    this.refs.cropper.getCroppedCanvas().toBlob(blob => {
      this.props.formData.set('file', blob, 'new_photo');
    }, 'image/png');
  }

  _onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) { files = e.dataTransfer.files; }
    else if (e.target) { files = e.target.files; }
    let reader = new FileReader();
    reader.onload = () => this.setState({ src: reader.result, pictureSelected: true });
    reader.readAsDataURL(files[0]);
  }

  render() {
    return (
      <div className='box'>
        <input type='file' onChange={this._onChange} />
        { this.state.pictureSelected &&
          <CropperJS
            style={{ height: 400, width: '100%' }}
            aspectRatio={1}
            guides={true}
            src={this.state.src}
            ref='cropper'
            crop={this._crop}
          />
        }
      </div>
     );
   }
}

export default Demo;
