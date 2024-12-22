import request from '../utils/request.js'

export function login(data) {
  return request({
    url: 'admin/login',
    method: 'POST',
	data
  });
}


export function alterCourse(data) {
  return request({
    url: 'admin/alterCourse',
    method: 'POST',
	data
  });
}

export function alterMessage(data) {
  return request({
    url: 'admin/alterMessage',
    method: 'POST',
	data
  });
}

export function alterEquipment(data) {
  return request({
    url: 'admin/alterEquipment',
    method: 'POST',
	data
  });
}


export function addEquipment(data) {
  return request({
    url: 'admin/addEquipment',
    method: 'POST',
	data
  });
}





export function addCourse(data) {
  return request({
    url: 'admin/addCourse',
    method: 'POST',
	data
  });
}

export function addMessage(data) {
  return request({
    url: 'admin/addMessage',
    method: 'POST',
	data
  });
}







export function getAllCoachName(params = {}) {
  return request({
    url: 'admin/getAllCoachName',
    method: 'GET',
	params
  });
}

export function equipmentChart(params = {}) {
  return request({
    url: 'admin/equipmentChart',
    method: 'GET',
	params
  });
}

export function courseChart(params = {}) {
  return request({
    url: 'admin/courseChart',
    method: 'GET',
	params
  });
}







export function getAllMessage(params = {}) {
  return request({
    url: 'admin/getAllMessage',
    method: 'GET',
	params
  });
}

export function getAllCourse(params = {}) {
  return request({
    url: 'admin/getAllCourse',
    method: 'GET',
	params
  });
}



export function getAllEquipment(params = {}) {
  return request({
    url: 'admin/getAllEquipment',
    method: 'GET',
	params
  });
}





export function isRepetitionAdminUsername(params = {}) {
  return request({
    url: 'admin/isRepetitionAdminUsername',
    method: 'GET',
	params
  });
}


export function deleteUserById(params = {}) {
  return request({
    url: 'admin/deleteUserById',
    method: 'GET',
	params
  });
}

export function deleteCoachById(params = {}) {
  return request({
    url: 'admin/deleteCoachById',
    method: 'GET',
	params
  });
}

export function deleteCourseById(params = {}) {
  return request({
    url: 'admin/deleteCourseById',
    method: 'GET',
	params
  });
}




export function getAllUser(params = {}) {
  return request({
    url: 'admin/getAllUser',
    method: 'GET',
	params
  });
}
export function getAllCoach(params = {}) {
  return request({
    url: 'admin/getAllCoach',
    method: 'GET',
	params
  });
}

export function searchCourseByName(params = {}) {
  return request({
    url: 'admin/searchCourseByName',
    method: 'GET',
	params
  });
}



export function adminSearchUserByName(params = {}) {
  return request({
    url: 'admin/adminSearchUserByName',
    method: 'GET',
	params
  });
}

export function adminSearchCoachByName(params = {}) {
  return request({
    url: 'admin/adminSearchCoachByName',
    method: 'GET',
	params
  });
}

export function adminSearchEquipmentByName(params = {}) {
  return request({
    url: 'admin/adminSearchEquipmentByName',
    method: 'GET',
	params
  });
}



export function deleteMessageById(params = {}) {
  return request({
    url: 'admin/deleteMessageById',
    method: 'GET',
	params
  });
}


export function deleteEquipmentById(params = {}) {
  return request({
    url: 'admin/deleteEquipmentById',
    method: 'GET',
	params
  });
}






export function adminSearchMessageByName(params = {}) {
  return request({
    url: 'admin/adminSearchMessageByName',
    method: 'GET',
	params
  });
}




export function adminRegister(data){
	return request({
		url: 'admin/adminRegister',
		method: 'POST',
		data
	});
}

export function checkSupperAdminPassword(params = {}){
	return request({
		url: 'admin/checkSupperAdminPassword',
		method: 'GET',
		params
	});
}
