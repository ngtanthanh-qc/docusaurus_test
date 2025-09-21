import React, { useEffect, useState } from "react";

import firebase from "firebase/compat/app";
import { onAuthStateChanged, signOut, getAuth,  } from 'firebase/auth';

import { Redirect, useLocation } from "@docusaurus/router";

import { firebaseConfig } from "../../config/firebase-config";
import { Login } from "../Login";
import Loading from "../Loading";
import { BASE, LOGOUT_PATH, LOGIN_PATH, PROTECTED_PATHS } from "../../utils/constants";

let auth = null;

try {
    if (firebaseConfig && firebaseConfig.apiKey) {
        firebase.initializeApp(firebaseConfig);
        auth = getAuth();
    }
} catch (error) {
    console.warn('Firebase initialization failed. Authentication will be disabled.', error);
}

export { auth };

export function AuthCheck({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setAuthLoading(false);
            return;
        }
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthLoading(false);
        });
        
        return () => unsubscribe();
    }, []);

    const location = useLocation();
    let from = location.pathname;

    if (authLoading) return <Loading />;
    
    if (!auth) {
        return children;
    }

    if (user?.email) {
        if (from === LOGOUT_PATH) {
            signOut(auth);
            return <Redirect to={BASE} from={LOGOUT_PATH} />;
        } else if (from === LOGIN_PATH) return <Redirect to={BASE} from={from} />;

        return children;
    } else {
        if (from === LOGOUT_PATH) return <Redirect to={BASE} from={from} />;
        else if (PROTECTED_PATHS.filter(x => from.includes(x)).length) return <Login />;
        else if (from === LOGIN_PATH) return <Login />;
        return children;
    }
};