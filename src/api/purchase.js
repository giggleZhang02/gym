import request from '../utils/request.js'

export function userPurchaseCourse(data) {
  return request({
    url: 'purchase/userPurchaseCourse',
    method: 'POST',
	data
  });
}

export function getAllPurchaseCourse(params = {}) {
  return request({
    url: 'purchase/getAllPurchaseCourse',
    method: 'GET',
	params
  });
}