import request from '../utils/request.js'


export function purchaseVip(params = {}) {
  return request({
    url: 'vip/purchaseVip',
    method: 'GET',
	params
  });
}


