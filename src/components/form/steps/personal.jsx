import { memo, useEffect, useMemo, useState } from "react";

import locationlist from "../../../json/countries+states";

function Personalinfo({ firstnameref, lastnameref, ageref, genderref, countryref, cityref, show }) { 
    
    const [location, setlocation] = useState({});
    const [country, setcountry] = useState([]);
    const [city, setcity] = useState([]);

    useEffect(() => { 
        const countryarr = [];
        const locationarr = {};
        for (const i of locationlist) {
            locationarr[i.name] = i.states;
            countryarr.push(<option key={ i["numeric_code"]} value={ i.name }>{ i.name }</option>);
        }
        setlocation(locationarr);
        setcountry(countryarr);
            
    },[])

    const selectcountry = (e) => {
        if (location[e.target.value]) {
            const cityarr = [];
            for (const i of location[e.target.value]) {
                cityarr.push(<option key={ i.id } value={ i.name }>{ i.name }</option>);
            }
            setcity(cityarr);
        }
    }

    return (
        <main className="formpersonal" style={{display:show?"flex":"none"}}>
            <input ref={ firstnameref} type="text"  className="form-control" placeholder="First name" />
            <input ref={ lastnameref}  type="text"  className="form-control" placeholder="Last name" />
            <input ref={ageref} type="number"  className="form-control" pattern="" placeholder="Age (optional)" />
            <select ref={ genderref }  className="form-control" defaultValue={ 0 }>
                <option value="0" disabled hidden>Gender (optional)</option>
                <option value="male">male</option>
                <option value="female">female</option>
            </select>
            <select ref={ countryref } id="country" className="form-control" defaultValue={ 0 } onChange={ selectcountry}>
                <option key={ 0 } value="0" disabled hidden>Country (optional)</option>
                {country}
            </select>
            <select ref={cityref} id="city" className="form-control" defaultValue={0}>
                <option key={0} value="0" disabled hidden>City (optional)</option>
                {city}
            </select>
        </main>
    )
}


export default memo(Personalinfo);