import axios from 'axios';
import Storage from 'utils/Storage';


const API = axios.create({
	baseURL: 'https://us-central1-plancam-fda56.cloudfunctions.net',
	crossDomain: true
});

API.interceptors.request.use(config => {
	const token = Storage.get('access_token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
}, error => Promise.reject(error));

const NodeAPI = {
	sendVerificationCode: async data => {
		return await API.get('/sendEmail', {
			params: data,
		});
	},
};

export default NodeAPI;