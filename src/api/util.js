import request from '../utils/request.js'

export function getVerificationImage(params = {}) {
  return request({
    url: 'util/getVerificationImage',
    method: 'GET',
	params
  });
}

export function verificationCode(params = {}) {
  return request({
    url: 'util/verificationCode',
    method: 'GET',
	params
  });
}

