import request from '../utils/request.js'

export function login(data) {
  return request({
    url: 'coach/login',
    method: 'POST',
	data
  });
}

export function updateCoach(data) {
  return request({
    url: 'coach/updateCoach',
    method: 'POST',
	data
  });
}


export function isRepetitionCoachUsername(params = {}) {
  return request({
    url: 'coach/isRepetitionCoachUsername',
    method: 'GET',
	params
  });
}

export function getCoachById(params = {}) {
  return request({
    url: 'coach/getCoachById',
    method: 'GET',
	params
  });
}

export function alterCoachImage(params = {}) {
  return request({
    url: 'coach/alterCoachImage',
    method: 'GET',
	params
  });
}

export function coachRegister(data){
	return request({
		url: 'coach/coachRegister',
		method: 'POST',
		data
	});
}