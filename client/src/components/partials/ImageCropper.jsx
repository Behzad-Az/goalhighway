import React from 'react';
import CropperJS from 'react-cropperjs';

class Demo extends React.Component {

   constructor() {
      super();
      this.formData = new FormData();
      this.state = {
         defaultSrc: 'http://i.imgur.com/n483ZwJ.jpg',
         src: 'http://i.imgur.com/n483ZwJ.jpg', // tapptv image (small)
         //  src: 'http://i.imgur.com/1gpjD9I.jpg', // iphone sky photo (large)
         preview: null,
         file: ''
      };
      this._crop = this._crop.bind(this);
      this._handleUpdateProfile = this._handleUpdateProfile.bind(this);
      this._onChange = this._onChange.bind(this);
      this._useDefaultImage = this._useDefaultImage.bind(this);
   }

   // Callback functions
   _build() {
      // console.log('_build');
   }

   _built() {
      // console.log('_built');
   }

   _cropstart() {
      // console.log('_cropstart', data.action);
   }

   _cropmove() {
      // console.log('_cropmove', data.action);
   }

   _cropend() {
      // console.log('_cropend', data.action);
   }

   _zoom() {
      // console.log('_zoom', data.ratio);
   }

   _crop() {
    // console.log('_crop', this.refs.cropper.getCroppedCanvas());
    this.setState({
       preview: this.refs.cropper.getCroppedCanvas().toDataURL()
       // file: this.refs.cropper.getCroppedCanvas().toBlob()
    });

    this.refs.cropper.getCroppedCanvas().toBlob(blob => {
      console.log("blob: ", blob);
      this.formData.set('file', blob, 'new_photo');
    }, 'image/jpeg');
  }

   _handleUpdateProfile() {
    this.formData.append('type', 'profile');
    this.formData.append('username', 'ben');
    this.formData.append('email', 'ben@benq.com');
    this.formData.append('userYear', 4);
    this.formData.append('instId', 1);
    this.formData.append('progId', 1);
    fetch('/api/users/currentuser', {
      method: 'POST',
      credentials: 'same-origin',
      body: this.formData
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) { console.log("Good") }
      else { throw 'Server returned false'; }
    })
    .catch(() => console.log("Bad"));
  }

   _onChange(e) {
      e.preventDefault();
      let files;
      if (e.dataTransfer) {
         files = e.dataTransfer.files;
      } else if (e.target) {
         files = e.target.files;
      }
      console.log("files: ", files[0]);
      let reader = new FileReader();
      reader.onload = () => {
         this.setState({
            src: reader.result
         });
      };
      reader.readAsDataURL(files[0]);
   }

   _useDefaultImage() {
      this.setState({
         src: this.state.defaultSrc
      });
   }

   render() {
      return (
        <div>
           <div
             className='box'
             style={{   width: '70%',   float: 'left'}}>
               <input
                 type='file'
                 onChange={this._onChange} />
               <button onClick={this._useDefaultImage}>
                   Use default img
               </button>
               <br/>
               <br/>

               <CropperJS
                 style={{   height: 400,   width: '100%'}}
                 aspectRatio={1}
                 guides={false}
                 src={this.state.src}
                 ref='cropper'
                 build={this._build}
                 built={this._built}
                 cropstart={this._cropstart}
                 cropmove={this._cropmove}
                 cropend={this._cropend}
                 zoom={this._zoom}
                 crop={this._crop} />
           </div>
           <div
             className='box'
             style={{   width: '30%',   float: 'right'}}>
               <h1>Preview</h1>
               <img
                 style={{   width: '100%'}}
                 src={this.state.preview} />
           </div>
           <br style={{   clear: 'both'}} />
           <button onClick={this._handleUpdateProfile}>Send</button>
        </div>
     );
   }
}

export default Demo;
