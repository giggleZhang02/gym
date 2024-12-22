import request from '../utils/request.js'

export function getAllMessage(params = {}) {
  return request({
    url: 'message/getAllMessage',
    method: 'GET',
	params
  });
}


