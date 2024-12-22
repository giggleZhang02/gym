import request from '../utils/request.js'

export function userCollectCourse(params = {}) {
  return request({
    url: 'collect/userCollectCourse',
    method: 'GET',
	params
  });
}

export function getAllCollectCourse(params = {}) {
  return request({
    url: 'collect/getAllCollectCourse',
    method: 'GET',
	params
  });
}



