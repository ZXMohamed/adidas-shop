import { memo, useEffect, useState } from "react";



function Accountinfo({ emailref, msg, msgcolor, value,show }) {
    const [color, setcolor] = useState("#94a8c4");
    useEffect(() => {
        if (msgcolor == "success") {
            setcolor("green")
        } else if (msgcolor == "error") { 
            setcolor("red")
        }
    },[msg,msgcolor])

    return (
        <main className="formaccount" style={ { display: show ? "flex" : "none" } }>
            <input ref={ emailref } defaultValue={value} type="email" id="email" className="form-control" placeholder="Email" />
            <span style={{color:color}}>{ msg }</span>
        </main>
    )
}


export default memo(Accountinfo);