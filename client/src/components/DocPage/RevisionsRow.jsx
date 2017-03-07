// import React, {Component} from 'react';
// import { browserHistory, Link } from 'react-router';

// class RevisionsRow extends Component {
//   constructor(props) {
//     super(props);
//     this.handleRevisionRequest = this.handleRevisionRequest.bind(this);
//     this.handleDeletionRequest = this.handleDeletionRequest.bind(this);
//   }

//   handleRevisionRequest(e) {
//     $.ajax({
//       method: 'GET',
//       url: `/api/courses/${this.props.doc.course_id}/docs/${this.props.doc.id}/revisions/${e.target.id}`,
//       dataType: 'JSON',
//       success: response => {
//         response[0] ? console.log("printing revision response 0: ", response) : console.error("server error - 0", response);
//       }
//     });
//   }

//   handleDeletionRequest(e) {
//     $.ajax({
//       method: 'DELETE',
//       url: `/api/courses/${this.props.doc.course_id}/docs/${this.props.doc.id}/revisions/${e.target.id}`,
//       success: response => {
//         if (response) {
//           response === this.props.currentUrl ? this.props.reload(this.props.doc.course_id, this.props.doc.id) : browserHistory.push(response);
//         } else {
//           console.error("server error - 0", response);
//         }
//       }
//     });
//   }

//   render() {
//     return (
//       <div className="row-container">
//         <h1 className="header">
//           Document Revisions
//           <i className="fa fa-angle-down" aria-hidden="true" />
//         </h1>
//         { this.props.doc.revisions.map((revision, index) => {
//           return (
//             <div key={index} className="revision-row columns">
//               <div className="column is-3">Date:<br/>{revision.rev_created_at.slice(0, 10)}</div>
//               <div className="column is-6">Description:<br/>{revision.rev_desc}</div>
//               <div className="column is-3 buttons">
//                 <figure className="image is-48x48">
//                   <img src="../../../../../public/images/pdf.png" alt="" id={revision.id} onClick={this.handleRevisionRequest} style={{cursor: 'pointer'}} />
//                 </figure>
//                 {!revision.deleteable && <i id={revision.id} onClick={this.handleDeletionRequest} className="fa fa-trash" aria-hidden="true" />}
//                 <i className="fa fa-flag" aria-hidden="true" />
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }
// }

// export default RevisionsRow;
