import {
    getAuth,
    signOut
} from 'firebase/auth';
import {
    initializeApp
} from 'firebase/app';
import {
    fireConf
} from './config';

/**
 *
 */
function SignOut() {
    const fireApp = initializeApp(fireConf);
    const fireAut = getAuth(fireApp);
    signOut(fireAut).then(() => {
        document.location.replace('/');
    }).catch((error) => {
        document.write(error);
    });
}

window.onload = SignOut;
