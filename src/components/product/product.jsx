import { memo, useEffect, useState } from "react";
import { storage } from "../../storageconfig";
import { getDownloadURL, listAll, ref as storageref } from "firebase/storage";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { EmptyComments, ToggleToast, ViewProduct } from "../../redux/events";
import ratecalculator from "../../productactions/ratecalculate";
import { get, getDatabase,ref } from "firebase/database";
import { cart, love, removecart, removelove } from "../../productactions/product";

const db = getDatabase();

function Product({ id, data, applyfilter, onClick }) {
    
    const [photo, setphoto] = useState(null);
    const [productdata, setproductdata] = useState(data);

    const goto = useNavigate();
    
    const user = useSelector(state => state.user);
    const filter = useSelector(state => state.filter);
    const handle = useDispatch();
    
    const checkfilter=()=>{ 
        if (applyfilter) {
            if (!filter.gender[productdata["category"]]) {
                return false;
            }
            if (filter.size.allsize) { 

            }
            else if(!Object.values(productdata["size"]).includes(parseInt(filter.size.value))) { 
                return false;
            }
            if (!(productdata["price"] >= filter.price.min && productdata["price"] <= filter.price.max)) { 
                return false;
            }

            let colorval = false;
            for (const color of Object.values(productdata["color"])) { 
                colorval = colorval || filter.colors[color];
            }
            if (!colorval) { 
                return false;
            }
            return true;
        } else { 
            return true;
        }
    }
    

    useEffect(() => {
        const photoref = storageref(storage, "/productsphoto/"+ id);
        listAll(photoref).then((photoref) => {
            const urls = [];
            for (const item of photoref.items) {
                urls.push(getDownloadURL(item));
            }
            Promise.all(urls).then((urls) => {
                setphoto(urls);
            })

        });

        if (productdata === true) { 
            const productdataref = ref(db, "/Products/" + id);
            get(productdataref).then((data) => { 
                if (data.exists()) {
                    setproductdata(data.val());
                }
            })
        }

    },[id])
    

    
    const selectproduct = (e) => {
        onClick && onClick();
        handle((dispatch) => {
            dispatch({ type: ViewProduct, payload: { id: id, data: productdata, photos: photo } });
            dispatch({ type: EmptyComments });
        });

        goto({ pathname: "/store/" + productdata["name"].replaceAll(" ","_") + "/view", search: "?id=" + id });
    }
    
    return (
        <div onClick={ () => { (productdata !== true && productdata["stock"] >= 1) && selectproduct() } } className={ "productbox " + (productdata["stock"] < 1 || !checkfilter() || productdata === true ? "inactive":"")} >
            <img width="100%" alt="" src={ photo?photo[0]:" " } />
            { productdata !== true ? <div className="ratebox">{ parseFloat(ratecalculator(productdata["sum-rate"], productdata["n-rate"])) }</div> : <></>}
            <section className="lovecartcon">
                { productdata["stock"] >= 1 ?
                    <>
                        <Lovebutton id={ id } user={ user.id } />
                        <Cartbutton id={ id } user={ user.id } />
                    </>
                        :
                    <>
                    </>
                }
            </section>
            <section className="namepricecon">
                <div className="namebox">{ productdata["name"] ? productdata["name"] : "Not Found"}</div>
                <div className="pricebox">{ productdata["price"] ? productdata["price"] + "$" : "!" }</div>
            </section>
        </div>
    )
    
}

export default memo(Product);


const Lovebutton = memo(({ id, user })=> {
    
    const [loved, setloved] = useState(false);

    const handle = useDispatch();

    useEffect(() => {
        if (user) {
            const isloveref = ref(db, "/love/" + id + "/" + user);
            get(isloveref).then((snapshot) => {
                if (snapshot.exists()) {
                    setloved(true);
                } else {
                    setloved(false);
                }
            })
        } else { 
            setloved(false);
        }
    }, [id, user])
    
    const togglelove = (e) => {
        e.stopPropagation();
        if (user) {
            if (loved) {
                removelove(id, user, () => { setloved(false); });
            } else {
                love(id, user, () => { setloved(true); });
            }
        } else { 
            handle((dispatch) => {
                dispatch({
                type: ToggleToast,
                payload: {
                    value: true,
                    text: "You Need to Login or Signup",
                    title: "Account"
                }
                })
            })
        }
    }
    
    return (
        <div onClick={ togglelove }
            className={ "lovebox " + (loved && "loved") }></div>
    )
})

const Cartbutton = memo(({ id, user })=> { 

    const [carted, setcarted] = useState(false);

    const handle = useDispatch();

    useEffect(() => {
        if (user) {
            const iscartref = ref(db, "/users/" + user + "/cart/" + id);
            get(iscartref).then((snapshot) => {
                if (snapshot.exists()) {
                    setcarted(true);
                } else {
                    setcarted(false);
                }
            })
        } else {
            setcarted(false);
        }
    }, [id, user])

    const togglecart = (e) => {
        e.stopPropagation();
        if (user) {
            if (carted) {
                removecart(id, user, () => { setcarted(false); });
            } else {
                cart(id, user, () => { setcarted(true); });
            }
        } else { 
            handle((dispatch) => {
                dispatch({
                    type: ToggleToast,
                    payload: {
                        value: true,
                        text: "You Need to Login or Signup",
                        title: "Account"
                    }
                })
            })
        }
    }

    return (
        <div onClick={ togglecart }
            className={ "cartbox " + (carted && "carted") }></div>
    )
})


