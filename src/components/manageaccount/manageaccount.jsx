import { useNavigate, useParams } from "react-router";
import { Form, Section1, Section2 } from "../form/form";
import Accountinfo from "../form/steps/account";
import { useEffect, useRef, useState } from "react";
import { confirmedemail, onemailverification, onpasswordresetemail } from "../../useractions/user";
import { useDispatch, useSelector } from "react-redux";
import { ToggleToast } from "../../redux/events";


function Manageaccount() {

    const [title, settitle] = useState('')
    const [sec1, setsec1] = useState(<></>)
    const [accountstepvalue, setaccountstepvalue] = useState('')
    const [accountstepmsg, setaccountstepmsg] = useState({ text: 'click Verify button to receive the link via this Email' ,color:"normal"})
    const [onsubmit, setonsubmit] = useState({ action: () => { } })

    const goto = useNavigate();
    
    const user = useSelector(state => state.user);
    const handle = useDispatch();

    const emailref = useRef();

    const { pagefunction } = useParams();

    
    useEffect(() => {
        switch (pagefunction) { 
            case "forget_password":
                if (user?.id) { goto("/")}
                settitle("Forget Password");
                setsec1(<span className="signupwith">you can rest your password but first verify your email so please enter your email</span>)       
                setonsubmit({
                    action: () => {
                        if (confirmedemail(emailref.current.value)) {
                            onpasswordresetemail(emailref.current.value, () => {
                                setaccountstepmsg({ text: "Email sent!", color: "success" });
                                Cookies.setcookies({ sitetype: { value: "react", expires: "Thu, 18 Dec 2030 12:00:00 UTC" } });
                            });
                        } else {
                            handle((dispatch) => {
                                dispatch({
                                    type: ToggleToast,
                                    payload: {
                                        value: true,
                                        text: "Email not valid",
                                        title: "Forget password"
                                    }
                                })
                            })
                        }
                    }
                });
                break;
            case "verify_email":
                if (!user.id) {
                    goto("/");
                } else {
                    if (user.data.emailVerified) {
                        goto("/");
                    } else {
                        settitle("verify Email");
                        setsec1(<span id="signupwith" className="signupwith">
                            Please verify your <br />
                            email address :
                            {/* //!get user email */ }
                            <i><u>{ user.data.email }</u></i> <br />
                            by clicking Verify then click the link sent to your <br />
                            email address.</span>)
                        setaccountstepvalue(user.data.email);
                        setonsubmit({
                            action: () => {
                                onemailverification(() => {
                                    setaccountstepmsg({ text: "Email sent!", color: "success" });
                                    Cookies.setcookies({ sitetype: { value: "react", expires: "Thu, 18 Dec 2030 12:00:00 UTC" } });
                                });
                            }
                        });
                    }
                }
                break;
            default:
                break;
        }
    }, [user.id])

    return (
        <Form title={title}>
            <Section1>
                {sec1}
            </Section1>
            <Section2 steps={ 1 } submitbuttontitle="Verify" onsubmit={ onsubmit.action }>
                <Accountinfo emailref={ emailref } msg={ accountstepmsg.text } msgcolor={ accountstepmsg.color }  value={ accountstepvalue } />
            </Section2>
        </Form>
    )
}

export default Manageaccount;
