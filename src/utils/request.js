import axios from 'axios'

const request = axios.create({
	baseURL: 'http://localhost:8081',
	timeout: 5000
})

request.interceptors.request.use(
	function(config) {
		// 在发送请求之前做些什么
		const type = localStorage.getItem('type');
		if (type === '管理员') {
			const adminToken = localStorage.getItem('AdminToken');
			if (adminToken) {
				// 如果存在AdminToken，则将其添加到请求头中
				config.headers['AdminAuthorization'] = adminToken;
			}
			return config;
		} else if (type === '用户') {
			const userToken = localStorage.getItem('UserToken');
			if (userToken) {
				// 如果存在AdminToken，则将其添加到请求头中
				config.headers['UserAuthorization'] = userToken;
			}
			return config;
		} else {
			const coachToken = localStorage.getItem('CoachToken');
			if (coachToken) {
				// 如果存在AdminToken，则将其添加到请求头中
				config.headers['CoachAuthorization'] = coachToken;
			}
			return config;
		}

	},
	function(error) {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
)

export default request