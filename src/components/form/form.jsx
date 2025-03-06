import react from "react";
import { memo, useEffect, useRef, useState } from "react"



export const Form = memo(({ title, children }) => {

    return (
        <main className="midsigncontainer d-flex justify-content-center align-items-center">
            <div className="midsigncontainerbg">
            </div>
            <div className="signupcon">
                <div className="signupconheader d-flex justify-content-center align-items-center">
                    <span>{ title }</span>
                </div>
                <div className="row signform">
                    { children }
                </div>
            </div>
        </main>
    )
});

export const Section1=memo(({children})=> { 

    return (
        <div className="col-6 signupsecl">
            <div className="signupwithsec">
                {children}
            </div>
        </div>
    )
})

export const Section2 = memo(({ steps, submitbuttontitle, children, onsubmit }) => {

    const [stepscircle, setstepscircle] = useState([]);
    const [currentstep, setcurrentstep] = useState(1);
    
    const submit = useRef();
    
    useEffect(() => {
        let stepsarr = []
        for (let i = 1; i <= steps; i++) {
            const opacity = i <= currentstep ? "opacity(100%)" : "opacity(50%)";
            stepsarr.push(<div key={ i } style={ { filter: opacity } }>
                <div style={ { filter: opacity } }>
                    <div style={ { filter: opacity } }>
                        { i }
                    </div>
                </div>
            </div>);
        }
        setstepscircle(stepsarr);
    }, [currentstep])

    const nextstep = () => {
        currentstep == steps && onsubmit();
        currentstep < steps && setcurrentstep(currentstep + 1);
        currentstep + 1 == steps && (submit.current.innerText = submitbuttontitle);
    }
    const prevstep = () => {
        currentstep > 1 && setcurrentstep(currentstep - 1);
        currentstep + 1 <= steps && (submit.current.innerText = "Next");
    }

    return (
        <div className="col-12 col-xxl-6 d-flex justify-content-center align-items-center signupsec2">
            <div className="filldatasec">
                <div className="stepscon d-flex justify-content-around align-items-center position-relative">
                    <section>
                        <div className="stepsbar h-100" style={ { width: (currentstep - 1) * 32 + "%" } }></div>
                    </section>
                    { stepscircle }
                </div>
                <div className="datainputcon w-100">
                    <form className="datainput" autoComplete="on">
                        {
                            !Array.isArray(children) ?
                                
                                react.cloneElement(children, { key: 0, show: 0 == currentstep - 1 ? true : false })
                                :
                                children.map((child, index) => {
                                    return react.cloneElement(child, { key: index, show: index == currentstep - 1 ? true : false });
                                })
                        }
                    </form>
                    <div className="controlbuttoncon">
                        { steps != 1 && <button className="controlbutton" onClick={ prevstep }>Previous</button> }
                        <button ref={ submit } className="controlbutton" onClick={ nextstep }>{ currentstep == steps ? submitbuttontitle : "Next" }</button>
                    </div>
                </div>
            </div>
        </div>
    )
});