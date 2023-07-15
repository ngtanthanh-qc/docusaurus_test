const functions = require("firebase-functions");

/* eslint-disable no-tabs */
/* eslint-disable indent */

exports.beforeCreate = functions.auth.user().beforeCreate((user) => {
    let isAllowed = false;

    // Only users of a specific domain can sign up.
    const WHITELISTED_DOMAINS = ["terralogic.com"];
    try {
        if (user.email === undefined) {
            throw new functions.auth.HttpsError("invalid-argument", "Email address cannot be empty.");
        }

        for (const item of WHITELISTED_DOMAINS) {
            if (user.email.lastIndexOf(item) !== -1) {
                isAllowed = true;
                break;
            }
        }

        if (!isAllowed) throw new functions.auth.HttpsError("invalid-argument", `Unauthorized email "${user.email}"`);
    } catch (error) {
        throw new functions.auth.HttpsError("invalid-argument", `Unauthorized email "${user.email}"`);
    }
});