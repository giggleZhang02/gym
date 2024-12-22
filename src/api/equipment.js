import request from '../utils/request.js'


export function getAllEquipment(params = {}){
	return request({
		url: 'equipment/getAllEquipment',
		method: 'GET',
		params
	});
}
