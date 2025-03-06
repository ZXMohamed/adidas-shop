import { memo, useEffect, useState } from "react";

function Password({ passwordref, msg, msgcolor, msgconfirm, msgconfirmcolor, confirmpasswordref,show}) {
    const [color, setcolor] = useState("#94a8c4");
    const [confirmcolor, setconfirmcolor] = useState("#94a8c4");
    const [showpassword, setshowpassword] = useState(true);
    const [showconfirmpassword, setshowconfirmpassword] = useState(true);

    useEffect(() => {
        if (msgcolor == "success") {
            setcolor("green")
        } else if (msgcolor == "error") {
            setcolor("red")
        }
        if (msgconfirmcolor == "success") {
            setconfirmcolor("green")
        } else if (msgconfirmcolor == "error") {
            setconfirmcolor("red")
        }
    }, [msg, msgcolor, msgconfirm, msgconfirmcolor])

    return (
        <main className="formpassword" style={ { display: show ? "flex" : "none" } }>
            <div className="formshowpass">
                <i onClick={ () => { setshowpassword(!showpassword) } }>{ showpassword ? <>&#xf070;</> : <>&#xf06e;</> }</i>
                <input ref={ passwordref } type={ showpassword ? "password" : "text" } className="form-control" placeholder="Password" />
            </div>
            <span style={ { color: color } }>{ msg }</span>
            <div className="formshowpass">
                <i onClick={ () => { setshowconfirmpassword(!showconfirmpassword) } }>{ showconfirmpassword ? <>&#xf070;</> : <>&#xf06e;</> }</i>
                <input ref={ confirmpasswordref } type={ showconfirmpassword ? "password" : "text" } className="form-control" placeholder="Confirm password" />
            </div>
            <span style={ { color: confirmcolor } }>{ msgconfirm }</span>
        </main>
    )
}


export default memo(Password);