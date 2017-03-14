import React from 'react';
import ReactDOM from 'react-dom';
import DropzoneComponent from 'react-dropzone-component';

export default class Example extends React.Component {
    constructor(props) {
        super(props);

        this.acceptedFiles = [
          'image/jpeg',
          'image/gif',
          'image/png',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            addRemoveLinks: false,
            acceptedFiles: this.acceptedFiles.join(','),
            maxFilesize: 10,
            autoDiscover: false,
            previewsContainer: false,
            uploadMultiple: false,
            maxFiles: 1
        };

        this.componentConfig = {
            // iconFiletypes: ['.jpg', '.png', '.gif'],
            // showFiletypeIcon: false,
            postUrl: '/api/uploadHandler'
        };

        // If you want to attach multiple callbacks, simply
        // create an array filled with all your callbacks.
        this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];

        // Simple callbacks work too, of course
        this.callback = () => console.log('Hello!');

        this.success = file => console.log('uploaded', file);

        this.removedfile = file => console.log('removing...', file);

        this.dropzone = null;
    }

    render() {

        // For a list of all possible events (there are many), see README.md!
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            drop: this.callbackArray,
            addedfile: this.callback,
            success: this.success,
            removedfile: null
        };

        return <DropzoneComponent config={this.componentConfig} eventHandlers={eventHandlers} djsConfig={this.djsConfig} />
    }
}
