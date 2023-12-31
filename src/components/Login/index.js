import React from "react";
import { auth } from "../Auth";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './styles.css';

// Configure FirebaseUI.
export const uiConfig = {
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID, // Add Google sign-in option
    ],
    signInFlow: 'popup', // Use pop-up sign-in flow
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false,
    },
};
export function Login() {
    return <div className="auth-wrapper">
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>;
};