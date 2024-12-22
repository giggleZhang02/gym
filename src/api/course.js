import request from '../utils/request.js'

export function getRecommendCourse(params = {}) {
  return request({
    url: 'course/getRecommendCourse',
    method: 'GET',
	params
  });
}

export function getAllCourseName(params = {}) {
  return request({
    url: 'course/getAllCourseName',
    method: 'GET',
	params
  });
}

export function getAllCourse(params = {}) {
  return request({
    url: 'course/getAllCourse',
    method: 'GET',
	params
  });
}

export function getAllLookCourse(params = {}) {
  return request({
    url: 'course/getAllLookCourse',
    method: 'GET',
	params
  });
}

export function getAllCourseByCoach(params = {}) {
  return request({
    url: 'course/getAllCourseByCoach',
    method: 'GET',
	params
  });
}

export function coachPastSign(params = {}) {
  return request({
    url: 'course/coachPastSign',
    method: 'GET',
	params
  });
}




export function searchCourseByName(params = {}) {
  return request({
    url: 'course/searchCourseByName',
    method: 'GET',
	params
  });
}

export function searchLookCourseByName(params = {}) {
  return request({
    url: 'course/searchLookCourseByName',
    method: 'GET',
	params
  });
}



