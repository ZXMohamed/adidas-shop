import {
    browserLocalPersistence, browserSessionPersistence,
    createUserWithEmailAndPassword, getAuth, onAuthStateChanged,
    sendEmailVerification, sendPasswordResetEmail, setPersistence,
    signInWithEmailAndPassword, signOut, updateProfile
} from "firebase/auth";
import { app } from "../firebaseconfig";
import { useDispatch } from "react-redux";
import { Login, Logout } from "../redux/events";
import { getDatabase, ref, set } from "firebase/database";
import { getDownloadURL, ref as storageref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../storageconfig";
import { useNavigate } from "react-router";
import { useEffect } from "react";


const emailpattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passpattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

const auth = getAuth(app);
const db = getDatabase(app);

export const Authchanges=()=> { 
    const handle = useDispatch();
    const goto = useNavigate();
    useEffect(() => { 
        handle((dispatch) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {//$render hill
                    dispatch({
                        type: Login,
                        payload: {
                            id: user.uid,
                            data: user,
                            photo: ""
                        }
                    });
                    if (!user.emailVerified) { 
                        goto("/manage_account/verify_email", { replace: true });
                    }
                } else { 
                    //$get user photo
                    dispatch({ type: Logout });   
                }
            })
        })
    },[])
}



export const onlogin = (email, password, remember,onsuccess) => {
    setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence).then(() => {
        signInWithEmailAndPassword(auth, email, password).then((user) => {
            onsuccess();
        }).catch(() => { 

        })
    })
}

export const onlogout=()=>{ 
    signOut(auth).then((user) => {
        console.log(user);
    })
}

export const onsignup = (userdata, onuploaddata,onsuccess,onerror) => { 
        
    createUserWithEmailAndPassword(auth, userdata.email, userdata.password)
        .then(() => {
            const uploads = [];
            onuploaddata();

            uploads.push(set(ref(db, "users/" + auth.currentUser.uid), {
                age: userdata.age,
                gender: userdata.gender === "0" ? "" : userdata.gender,
                country: userdata.country === "0" ? "" : userdata.country,
                city: userdata.city === "0" ? "" : userdata.city,
                name: userdata.firstname + " " + userdata.lastname
            }).then(() => {

            }).catch((error) => { console.log(error); }));

            if (userdata.photo) {
                const storageRef = storageref(storage, "/customerphoto/" + auth.currentUser.uid + "/photo/" + userdata.photo.name);
                const uploadTask = uploadBytesResumable(storageRef, userdata.photo);
                uploads.push(uploadTask);
                uploadTask.on('state_changed',
                    (snapshot) => {

                    },
                    (error) => {
                        console.log(error);
                    },
                    (op) => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {


                            //*unnecessary
                            updateProfile(auth.currentUser, {
                                displayName: userdata.firstname + " " + userdata.lastname,
                                photoURL: downloadURL
                            }).then(() => {

                            }).catch((error) => {
                                console.log(error);
                            });
                        });
                    }
                );
            }
            else {

            }
            Promise.all(uploads).then(() => {

            }).catch((e) => { console.log(e); })
        })
        .catch((error) => {
            console.log(error);
            alert(error);
 
            onerror();
        });
            
    
}


export const onpasswordresetemail = (email,onssuccess) => {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            onssuccess()
        })
        .catch((error) => {
            //$handle error
            const errorCode = error;
            // console.log(errorCode);
        }
        );
}

export const onemailverification = (onssuccess) => {
    sendEmailVerification(auth.currentUser)
        .then(() => {
            onssuccess()
        }).catch((error) => {
            //$handle error
            const errorCode = error;
            // console.log(errorCode);
        });
}






export function loginvalidat(userdata) {
    if (confirmedemail(userdata.email) && userdata.password.match(passpattern) && userdata.password != null && userdata.password.trim() != "") {
        return true;
    }
    else {
        return false;
    }
}
export function confirmedemail(email) {
    if (email.match(emailpattern)) {
        return true;
    }
    else {
        return false;
    }
}
export function confirmedpass(password, confirmpassword) {
    if (password == confirmpassword && password.match(passpattern)) {
        return true;
    }
    else if (password.trim() == "") {
        return false;
    }
    return false;
}
export function signupvalidat(form) {
    if (!(form.firstname != null && form.lastname != null && form.firstname.trim() != "" && form.lastname.trim() != "")) { return 1; }
    if (!confirmedemail(form.email)){ return 2; }
    if (!confirmedpass(form.password, form.confirmpassword)){ return 3; }
    return true;
}
