/**
 * axios setup to use mock service
 */

import axios from 'axios';
import { auth } from 'services/firebase';

// GALAXPAY REQUESTS

const galaxpayInstance = axios.create({
    baseURL: `https://api.galaxpay.com.br/v2`
});

// GOOGLE MAPS REQUESTS
const googleMapsInstance = axios.create({
    baseURL: `https://maps.googleapis.com/maps/api`
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
    const costumer = await galaxpayInstance.get(`/customers?startAt=${start}&limit=${end}&emails=${email}`, {
        headers: { Authorization: `Bearer ${data.access_token}` }
    });

    return costumer;
};

// SUBSCRIPTIONS
export const getMySubscriptionsByCustomerGalaxPayId = async (start: number, end: number, customerGalaxPayId: string) => {
    const { data } = await getAccessToken();

    return galaxpayInstance.get(`/subscriptions?startAt=${start}&limit=${end}&customerGalaxPayIds=${customerGalaxPayId}`, {
        headers: { Authorization: `Bearer ${data.access_token}` }
    });
};

export const getAddressByLatLng = async (lat: number, lng: number) =>
    googleMapsInstance.get(`/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`);

export const callUpdateZonesToApplyChanges = async () => {
    alert('executando callUpdateZonesToApplyChanges comentado');
    // const url = 'http://34.216.152.167:21800/api/security_areas/updateAllSecurityAreas';
    // const idToken = await auth.currentUser?.getIdToken(true);
    // const uid = auth.currentUser?.uid;

    // await axios.post(
    //     url,
    //     {
    //         user_id: uid,
    //         token: idToken
    //     },
    //     {
    //         withCredentials: false,
    //         headers: {
    //             'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    //             'Access-Control-Allow-Origin': '*',
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         }
    //     }
    // );
};

// Mock calls

const axiosServices = axios.create();

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;
