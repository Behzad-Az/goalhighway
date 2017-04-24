import React, {Component} from 'react';
import NewCourseForm from './NewCourseForm.jsx';
import FilterInputBox from './FilterInputBox.jsx';
import CourseRow from './CourseRow.jsx';

class CoursesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewCourseForm: false
    };
    this._toggleNewCourseForm = this._toggleNewCourseForm.bind(this);
  }

  _toggleNewCourseForm() {
    this.setState({ showNewCourseForm: !this.state.showNewCourseForm });
  }

  render() {
    return (
      <div className='courses-container'>
        <NewCourseForm
          reload={this.props.reload}
          instId={this.props.instId}
          instName={this.props.instName}
          showModal={this.state.showNewCourseForm}
          toggleModal={this._toggleNewCourseForm}
        />
        <h1 className='header'>
          Courses:
          <button className='button' onClick={this._toggleNewCourseForm}>Don't see your course?</button>
        </h1>
        <FilterInputBox handleFilter={this.props.handleFilter} />
        { this.props.courses.map(course => <CourseRow key={course.id} course={course} alreadySubscribed={this.props.currUserCourseIds.includes(course.id)} /> )}
      </div>
    );
  }
}

export default CoursesContainer;
