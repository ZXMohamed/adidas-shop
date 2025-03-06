import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router";
import { EmptyComments } from "../../redux/events";
import { useDispatch, useSelector } from "react-redux";


function View() {

    const [search] = useSearchParams();
    const param = useParams();
    const goto = useNavigate();

    const [load, setload] = useState(false);
        
    useEffect(() => {
        if (search.get("id") != null && search.get("id") != "" && param.Productname != undefined) {
            setload(true);
        } else { 
            goto("/notfound");
        }
    }, [])
    
    return (
        <main className="productshowcon">
            <div className="productshow productshowanimat">
                {load&&<Outlet />}
            </div>
        </main>
    )
}

export default View;