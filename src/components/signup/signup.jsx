import { useNavigate } from "react-router";
import { Form, Section1, Section2 } from "../form/form";
import Accountinfo from "../form/steps/account";
import Accountphoto from "../form/steps/account photo";
import Password from "../form/steps/password";
import Personalinfo from "../form/steps/personal";
import { useDispatch, useSelector } from "react-redux";
import { ToggleLoginForm, ToggleToast, ToggleWaitPage } from "../../redux/events";
import { useRef, useState } from "react";
import { onsignup, signupvalidat } from "../../useractions/user";



function Signup() { 

    const goto = useNavigate();

    const ui = useSelector(state => state.ui);
    const handle = useDispatch();

    const login = () => {
        handle((dispatch) => { dispatch({ type: ToggleLoginForm, payload: { value: true } })})
        goto("/");
    }

    const [accountstepmsg, setaccountstepmsg] = useState({ text: 'you will need this email to login' ,color:"normal"})
    const [passwordstepmsg, setpasswordstepmsg] = useState({text: 'the password length shouldn\'t be less than 6 letters contains at last 1 upper case character and number' ,color:"normal"})
    const [confirmpasswordstepmsg, setconfirmpasswordstepmsg] = useState({ text: 'repeat the password here' ,color:"normal"})

    const firstname = useRef();
    const lastname = useRef();
    const age = useRef();
    const gender = useRef();
    const country = useRef();
    const city = useRef();
    const email = useRef();
    const password = useRef();
    const confirmpassword = useRef();
    const photo = useRef();

    const onsubmit = () => { 
        const form = {
            firstname: firstname.current.value,
            lastname: lastname.current.value,
            age: age.current.value,
            gender: gender.current.value,
            country: country.current.value,
            city: city.current.value,
            email: email.current.value,
            password: password.current.value,
            confirmpassword: confirmpassword.current.value,
            photo: photo.current.files[0]
        };
        const validationresult = signupvalidat(form);
        if (validationresult === 1) {
            handle((dispatch) => {
                dispatch({
                type: ToggleToast,
                payload: {
                    value: true,
                    text: "Personal info required *",
                    title: "Signup"
                }
                })
            })
        } else if (validationresult === 2) {
            setaccountstepmsg({ text: "email not valid!", color: "error" });
            handle((dispatch) => {
                dispatch({
                    type: ToggleToast,
                    payload: {
                        value: true,
                        text: "Email not valid",
                        title: "Signup"
                    }
                })
            })
        } else if (validationresult === 3) {
            setaccountstepmsg({ text: "email valid!", color: "success" });
            setpasswordstepmsg({ text: "password not valid!", color: "error" });
            setconfirmpasswordstepmsg({ text: "password not valid!", color: "error" });
            handle((dispatch) => {
                dispatch({
                    type: ToggleToast,
                    payload: {
                        value: true,
                        text: "Password not valid",
                        title: "Signup"
                    }
                })
            })
        } else if (validationresult === true) {
            onsignup(form
             , () => { 
                handle((dispatch) => { dispatch({ type: ToggleWaitPage, payload: { value: true } }) })
            }, () => {
                handle((dispatch) => { dispatch({ type: ToggleWaitPage, payload: { value: false } }) })
                goto("/");
            }, () => { 
                handle((dispatch) => { dispatch({ type: ToggleWaitPage, payload: { value: false } }) })
                handle((dispatch) => {
                    dispatch({
                        type: ToggleToast,
                        payload: {
                            value: true,
                            text: "Signup failed please try again",
                            title: "Signup"
                        }
                    })
                })
            });
        }
    }

    return (
    <>
        {ui.waitpage && <section id = "wating" class="waiting" > please waite ...</section >}
        <Form title={"Signup"} >
            <Section1>
                <span className="signupwith">
                    Signup with your email<br />
                     If you don't have an account<br /> 
                     or if you have an account click the link below<br />
                     to login to your account</span>
                <span id="gologin" className="gologin" onClick={login}>I have an account</span>
            </Section1>
            <Section2 steps={ 4 } submitbuttontitle={ "Signup" } onsubmit={ onsubmit }>
                <Personalinfo firstnameref={ firstname } lastnameref={ lastname } ageref={ age } genderref={ gender } countryref={ country} cityref={city} /> 
                <Accountinfo emailref={ email } msg={ accountstepmsg.text } msgcolor={ accountstepmsg.color } value={ "" } />
                <Password passwordref={ password } confirmpasswordref={ confirmpassword } msg={ passwordstepmsg.text } msgcolor={ passwordstepmsg.color } msgconfirm={ confirmpasswordstepmsg.text } msgconfirmcolor={confirmpasswordstepmsg.color} />
                <Accountphoto photoref={ photo }  />
            </Section2>
        </Form>
    </>
    )
}


export default Signup;