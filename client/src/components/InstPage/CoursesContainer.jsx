import React, {Component} from 'react';
import HandleModal from '../partials/HandleModal.js';
import FilterInputBox from './FilterInputBox.jsx';
import CourseRow from './CourseRow.jsx';

class CoursesContainer extends Component {
  render() {
    return (
      <div className='courses-container'>
        <h1 className='header'>
          Courses:
          <button className='button' onClick={() => HandleModal('new-course-form')}>Don't see your course?</button>
        </h1>
        <FilterInputBox handleFilter={this.props.handleFilter} />
        { this.props.courses.map(course => <CourseRow key={course.id} course={course} alreadySubscribed={this.props.currUserCourseIds.includes(course.id)} /> )}
      </div>
    );
  }
}

export default CoursesContainer;
