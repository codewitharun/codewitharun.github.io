import { getMessaging, getToken } from "firebase/messaging";

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging();
getToken(messaging, { vapidKey: 'BE1M0Bsfq6MgVZU2hXhSMNKnpEQX2Dbg7sI1gOa-XBRwW5mk_OBNYp0WBS3IThndGGYR45RYIpoMfh18p6vuOic' }).then((currentToken) => {
    if (currentToken) {
        console.log("🚀 ~ getToken ~ currentToken:", currentToken)
        // Send the token to your server and update the UI if necessary
        // ...
    } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
});