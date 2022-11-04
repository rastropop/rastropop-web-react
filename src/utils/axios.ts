/**
 * axios setup to use mock service
 */

import axios from 'axios';

// GALAXPAY REQUESTS

const galaxpayInstance = axios.create({
    baseURL: `https://api.galaxpay.com.br/v2`
});

export const getAccessToken = () => {
    const galaxId = '3800';
    const galaxHash = '5gTo0jX6NnS7FsXt83HjHyIwQvNjBmE072RbJl2k';
    const galaxpayHashEncoded = btoa(`${galaxId}:${galaxHash}`);

    const body = { grant_type: 'authorization_code', scope: 'customers.read subscriptions.read' };

    console.log('Getting access token');

    return galaxpayInstance.post(`/token`, body, { headers: { Authorization: `Basic ${galaxpayHashEncoded}` } });
};

// COSTUMERS
export const getCustomerByEmail = async (start: number, end: number, email: string) => {
    const { data } = await getAccessToken();

    return galaxpayInstance.get(`/customers?startAt=${start}&limit=${end}&emails=${email}`, {
        headers: { Authorization: `Bearer ${data.access_token}` }
    });
};

// SUBSCRIPTIONS
export const getMySubscriptionsByCustomerGalaxPayId = async (start: number, end: number, customerGalaxPayId: string) => {
    const { data } = await getAccessToken();

    return galaxpayInstance.get(`/subscriptions?startAt=${start}&limit=${end}&customerGalaxPayIds=${customerGalaxPayId}`, {
        headers: { Authorization: `Bearer ${data.access_token}` }
    });
};

// Mock calls

const axiosServices = axios.create();

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;
