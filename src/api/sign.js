import request from '../utils/request.js'

export function userSign(params = {}) {
  return request({
    url: 'sign/userSign',
    method: 'GET',
	params
  });
}

export function checkSignList(params = {}) {
  return request({
    url: 'sign/checkSignList',
    method: 'GET',
	params
  });
}



