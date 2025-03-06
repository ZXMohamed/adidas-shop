import { Link } from "react-router";
import ratecalculator from "../../productactions/ratecalculate";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getDownloadURL, listAll, ref as storageref } from "firebase/storage";
import { storage } from "../../storageconfig";
import { EmptyComments, ViewProduct } from "../../redux/events";





function Searchitem({ id, data }) { 
    
    const [photo, setphoto] = useState(null);

    const handle = useDispatch();


    useEffect(() => {
        const photoref = storageref(storage, "/productsphoto/" + id);
        listAll(photoref).then((photoref) => {
            const urls = [];
            for (const item of photoref.items) {
                urls.push(getDownloadURL(item));
            }
            Promise.all(urls).then((urls) => {
                setphoto(urls);
            })
        });
    }, [id])

    const selectproduct = () => {
        handle((dispatch) => {
            dispatch({ type: ViewProduct, payload: { id: id, data: data, photos: photo } });
            dispatch({ type: EmptyComments });
        });
    }

    return (
        <Link onClick={selectproduct} to={ { pathname: "/store/"+data.name+"/view", search: "?id="+id } } className="dropdown-item searchdropdownitem">
            <img alt="" width="76.11px" src={photo} />
            <div>
                <span>{data.name}</span>
                <span>price :
                    <span>{ data.price}$</span>
                </span>
                <Rate rate={parseInt(ratecalculator(data["sum-rate"],data["n-rate"]))}/>
            </div>
        </Link>
    )
}

export default memo(Searchitem);


const Rate = memo(({rate})=> { 
    return (
        <span>rate : { (rate < 1 ?"": "".repeat(rate))}</span>
    )
})