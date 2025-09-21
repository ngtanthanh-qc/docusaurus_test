import React, { useEffect, useState } from "react";

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../components/Auth';

import { useThemeConfig } from '@docusaurus/theme-common';

import { LOGIN_BUTTON, LOGIN_PATH, LOGOUT_BUTTON, LOGOUT_PATH } from "./constants";

export function useNavbarItems() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!auth) {
            return;
        }
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        
        return () => unsubscribe();
    }, []);

    let label, to;
    if (user) {
        label = LOGOUT_BUTTON;
        to = LOGOUT_PATH;
    } else {
        label = LOGIN_BUTTON;
        to = LOGIN_PATH;
    }

    // TODO temporary casting until ThemeConfig type is improved
    // return useThemeConfig().navbar.items;
    let items = useThemeConfig().navbar.items;
    items.push({
        label: label,
        position: "right",
        to: to
    });

    // remove irrelevant items
    if (user) items = items.filter(x => x.label !== LOGIN_BUTTON);
    else items = items.filter(x => x.label !== LOGOUT_BUTTON);

    const uniqueItems = [...new Map(items.map(x => [x.label, x])).values()];

    return uniqueItems;
}