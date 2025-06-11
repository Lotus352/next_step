import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: true, 
});

const isTokenExpired = (token: string) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (!decoded.exp) return true;
        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Invalid token:', error);
        return true;
    }
};

axiosClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken'); 
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


export default axiosClient;

export { isTokenExpired};
