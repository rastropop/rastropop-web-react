// types
import { ConfigProps } from 'types/config';

export const JWT_API = {
    secret: 'SECRET-KEY',
    timeout: '1 days'
};

export const FIREBASE_API = {
    apiKey: 'AIzaSyDH_7_wOu01itmJsIpkMuOuyax5G8LwTkU',
    authDomain: 'letmeask-e9ab2.firebaseapp.com',
    databaseURL: 'https://letmeask-e9ab2-default-rtdb.firebaseio.com',
    storageBucket: 'letmeask-e9ab2.appspot.com',
    projectId: 'letmeask-e9ab2',
    messagingSenderId: '1003465770184',
    appId: '1:1003465770184:web:1eea8bc99ad6f99c17d1fd'
};

// PRODUÇÃO
// export const FIREBASE_API = {
//     apiKey: 'AIzaSyC3EY_L-Ta9FE-NroYE99qjDtzLxZLDFDU',
//     authDomain: 'rastropopvteste.firebaseapp.com',
//     databaseURL: 'https://rastropopvteste.firebaseio.com',
//     projectId: 'rastropopvteste',
//     storageBucket: 'rastropopvteste.appspot.com',
//     messagingSenderId: '59973707510',
//     appId: '1:59973707510:web:42606446708c7af22beed7',
//     measurementId: 'G-Z1P6X79D2J'
// };

export const AUTH0_API = {
    client_id: 'M8fjEqNTnMCTkPn2XvQMxvfKi6yS46Bv',
    domain: 'dev-sa0l5fl9.us.auth0.com'
};

export const AWS_API = {
    poolId: 'us-east-1_AOfOTXLvD',
    appClientId: '3eau2osduslvb7vks3vsh9t7b0'
};

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
// like '/berry-material-react/react/default'
export const BASE_PATH = '';

export const DASHBOARD_PATH = '/dashboard';

const config: ConfigProps = {
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 8,
    outlinedFilled: true,
    navType: 'dark', // light, dark
    presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
    locale: 'pt', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
    rtlLayout: false,
    container: false
};

export default config;
