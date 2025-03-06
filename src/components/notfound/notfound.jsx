function Notfound() { 

    return (
        <div className="d-flex justify-content-center align-items-center flex-column" style={ {
            fontFamily: "logofont",
            fontSize: "100px",
            height: "90vh"
        } }>
            <span className="text-center" style={ {
                textShadow: "-5px 10px 10px var(--mid), -10px 5px 10px var(--light)"
            } }>4O4</span>
            <span className="text-center" style={ {
                textShadow: "-5px 10px 10px var(--mid), -10px 5px 10px var(--light)"
            } }>Not Found</span>
        </div>
    )
}

export default Notfound;