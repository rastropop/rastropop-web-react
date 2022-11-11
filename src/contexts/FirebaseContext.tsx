/* eslint-disable consistent-return */
import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// action - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import { FIREBASE_API } from 'config';
import { FirebaseContextType, InitialLoginContextProps } from 'types/auth';
import { UserProfile } from 'types/user-profile';

// firebase initialize
if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_API);
}

// const
const initialState: InitialLoginContextProps = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

// ==============================|| FIREBASE CONTEXT & PROVIDER ||============================== //

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    const getUser = async (id: string) => {
        const docRef: UserProfile | firebase.firestore.DocumentData | undefined = (
            await firebase.firestore().collection('users').doc('vPkG66E9iKba6N9w5TGK8iVvKgW2').get()
        ).data();

        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user: {
                    id: docRef?.id,
                    email: docRef?.email,
                    name: docRef?.name,
                    cpf: docRef?.cpf || '',
                    address: docRef?.address,
                    cnpj: docRef?.cnpj || '',
                    rg: docRef?.rg || '',
                    phone: docRef?.phone || '',
                    created_at: docRef?.created_at
                }
            }
        });
    };

    useEffect(
        () =>
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    getUser(user.uid);
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch]
    );

    const firebaseEmailPasswordSignIn = (email: string, password: string) => firebase.auth().signInWithEmailAndPassword(email, password);

    const firebaseGoogleSignIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider();

        return firebase.auth().signInWithPopup(provider);
    };

    const firebaseRegister = async (email: string, password: string) => firebase.auth().createUserWithEmailAndPassword(email, password);

    const logout = () => firebase.auth().signOut();

    const resetPassword = async (email: string) => {
        await firebase.auth().sendPasswordResetEmail(email);
    };

    const updateProfile = () => {};
    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <FirebaseContext.Provider
            value={{
                ...state,
                firebaseRegister,
                firebaseEmailPasswordSignIn,
                login: () => {},
                firebaseGoogleSignIn,
                logout,
                resetPassword,
                updateProfile
            }}
        >
            {children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseContext;
