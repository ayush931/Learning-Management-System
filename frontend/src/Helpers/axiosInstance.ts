import axios from "axios";

const BASE_URL = 'http://localhost:7014/api/v1'

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true
});

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;