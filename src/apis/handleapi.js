import axiosClient from './axiosClient';

const callApi = async (url, data, method) => {
	return await axiosClient(url, {
		method: method || 'get',
		...(data && { data }),
	});
};

export default callApi;
