import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useMatch, useNavigate } from "react-router";
import { ToggleToast } from "../../redux/events";

const Pathlistener = () => {


    const { pathname } = useLocation();
    const path = useMatch("/manage_account/verify_email");
    const goto = useNavigate();

    const user = useSelector(state => state.user);
    const handle = useDispatch();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user.id && path) {
            if (!user.data.emailVerified) {
                goto("/manage_account/verify_email", { replace: true });
                handle((dispatch) => {
                    dispatch({
                        type: ToggleToast,
                        payload: {
                            value: true,
                            text: "Please verify your account email",
                            title: "Account"
                        }
                    })
                })
            }
        }
    }, [pathname]);

    return (null);
}

export default Pathlistener;