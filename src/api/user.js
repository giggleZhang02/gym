import request from '../utils/request.js'

export function login(data) {
  return request({
    url: 'user/login',
    method: 'POST',
	data
  });
}

export function updateUser(data) {
  return request({
    url: 'user/updateUser',
    method: 'POST',
	data
  });
}

export function getCourseStats(params = {}) {
  return request({
    url: 'user/getCourseStats',
    method: 'GET',
	params
  });
}



export function alterUserImage(params = {}) {
  return request({
    url: 'user/alterUserImage',
    method: 'GET',
	params
  });
}


export function getUserById(params = {}) {
  return request({
    url: 'user/getUserById',
    method: 'GET',
	params
  });
}

export function isRepetitionUserUsername(params = {}) {
  return request({
    url: 'user/isRepetitionUserUsername',
    method: 'GET',
	params
  });
}


export function userRegister(data){
	return request({
		url: 'user/userRegister',
		method: 'POST',
		data
	});
}

export function recharge(params = {}) {
  return request({
    url: 'user/recharge',
    method: 'GET',
	params
  });
}