// import React, {Component} from 'react';
// import { Link } from 'react-router';

// class RightSideBar extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dataLoaded: false,
//       pageError: false,
//       courseCount: 'N/A',
//       feeds: [],
//       instId: '',
//       instName: 'N/A',
//       revCount: 'N/A',
//       studentCount: 'N/A',
//       tutorCount: 'N/A'
//     };
//     this._conditionData = this._conditionData.bind(this);
//     this._commaSeparateNumber = this._commaSeparateNumber.bind(this);
//   }

//   componentWillMount() {
//     fetch('/api/rightsidebar', {
//       method: 'GET',
//       credentials: 'same-origin'
//     })
//     .then(response => response.json())
//     .then(resJSON => this._conditionData(resJSON))
//     .catch(() => this.setState({ dataLoaded: true, pageError: true }));
//   }

//   _conditionData(resJSON) {
//     if (resJSON) {
//       resJSON.dataLoaded = true;
//       this.setState(resJSON);
//     } else {
//       throw 'Server returned false';
//     }
//   }

//   _commaSeparateNumber(num) {
//     return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//   }

//   render() {
//     return this.state.dataLoaded ? (
//       <div className='card side-bar right'>
//         <div className='card-content'>

//           <div className='media'>
//             <div className='media-left'>
//               <figure className='image inst-logo'>
//                 <img src='http://www.cs.ubc.ca/~shafaei/homepage/images/logoUBC.gif' alt='Image' />
//               </figure>
//             </div>
//             <div className='media-content'>
//               <Link to={`/institutions/${this.state.instId}`} className='title is-4'>{this.state.instName}</Link>
//             </div>
//           </div>

//           <div className='content'>
//             <p><i className='fa fa-users' aria-hidden='true' /> {this._commaSeparateNumber(this.state.studentCount)} peers</p>
//             <p><i className='fa fa-graduation-cap' aria-hidden='true' /> {this._commaSeparateNumber(this.state.courseCount)} courses available</p>
//             <p><i className='fa fa-file' aria-hidden='true' /> {this._commaSeparateNumber(this.state.revCount)} files posted.</p>
//             <p><i className='fa fa-slideshare' aria-hidden='true' /> {this._commaSeparateNumber(this.state.tutorCount)} tutors</p>
//           </div>
//         </div>
//       </div>
//     ) : <p></p>;
//   }
// }

// export default RightSideBar;
