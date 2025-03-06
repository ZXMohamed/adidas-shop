import { Fragment, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router";
import { Autoplay, Keyboard, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ratecalculator from "../../productactions/ratecalculate";
import { EmptyComments, ToggleToast, ViewProduct } from "../../redux/events";
import { equalTo, get, getDatabase, orderByKey, query, ref } from "firebase/database";
import { storage } from "../../storageconfig";
import { getDownloadURL, listAll, ref as storageref } from "firebase/storage";
import { cart, love, rate, removecart, removelove, removerate, updaterate } from "../../productactions/product";
import { Ntheme } from "../../theme/theme";
import { Spinner } from "reactstrap";


const db = getDatabase();


function Productview() { 

    const productname = useParams().Productname;
    const [search] = useSearchParams();

    const product = useSelector(state => state.product);
    const user = useSelector(state => state.user);
    const handle = useDispatch();

    useEffect(() => {
        const loadproduct = async () => {
            if (!product.id || !product.data || !product.photos || product.id != search.get("id")) {
                const loadedproduct = { id: search.get("id") };
                const lastproductsref = query(ref(db, "/Products"), orderByKey(), equalTo(loadedproduct.id));
                const data = await get(lastproductsref);
                loadedproduct.data = data.val()[search.get("id")];
                const photoref = storageref(storage, "/productsphoto/" + loadedproduct.id);
                const photos = await listAll(photoref);
                const urls = [];
                for (const item of photos.items) {
                    urls.push(getDownloadURL(item));
                }
                const photosurls = await Promise.all(urls);
                loadedproduct.photos = photosurls
                console.log(loadedproduct);
                handle((dispatch) => {
                    dispatch({ type: ViewProduct, payload: loadedproduct });
                    dispatch({ type: EmptyComments });
                    
                });
            }
        }
        loadproduct();
    },[])

    return (
        <Fragment>
            <div className="w-100" style={ { height: "85%" } }>

                <div  className="w-100" style={ { height: "85%" } }>
                    <div className="content row">
                        <div className="productphotos col-12 col-xl-5 d-flex justify-content-center align-items-center">
                            
                            <Productphotos photos={ product?.photos } />

                        </div>
                    <div className="productdata col-12 col-xl-7 position-relative">
                        <span  className="productname">{product.data?.name}</span>
                        <span className="productprice">Price : <span className="productpricevalue">{product.data?.price}</span>$</span>
                        <div className="ratelovecon">
                                <span  className="productrate"> x { parseFloat(ratecalculator(product.data?.["sum-rate"], product.data?.["n-rate"])) }</span>
                            <span className="productlove"> x {product.data?.loved}</span>
                        </div>
                            <span  className="productdiscription">{ product.data?.description }</span>
                        <div className="control">
                                <span className="productstock">
                                    Stock : <span  className="productstockvalue">{product.data?.stock}</span>
                                </span>
                                <div className="color">
                                    { product.data && Object.values(product.data.color).map((color,inx) => {
                                        return <div key={inx} style={ { backgroundColor: color } }></div>
                                    })}
                                </div>
                                <div className="size">(EU)
                                    { product.data && Object.values(product.data.size).map((size,inx) => {
                                        return <div key={ inx }> : { size }</div>
                                    })}
                                </div>
                            </div>
                            <div className="sidebuttonscon">
                                <button className="sidebutton mode" onClick={()=>Ntheme.next()}></button>
                                <Lovesidebutton id={product.id} user={user.id} />
                                { product.data ?.stock>0 && <Cartsidebutton id={ product.id } user={ user.id } /> }
                                <Ratesidebutton id={product.id} user={user.id} />
                                <Link to={ { pathname: "/store/" + productname + "/comments", search: "?" + search.toString() } } className="sidebutton"></Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="buttoncon">
                <button className="buybutton">&#xf155; buy</button>
            </div>
        </Fragment>
    )
}
export default memo(Productview);







const Productphotos=memo(({ photos })=> {
    
    const [slides, setslides] = useState([]);

    useEffect(() => {
        if (photos) {
            const slides = [];
            photos.map((url, inx) => {
                slides.push(
                    <SwiperSlide key={ inx }>
                        <img src={ url } alt={ '' } className="w-100" />
                    </SwiperSlide>
                )
            })
            setslides(slides);
        }
    }, [photos])
    
    return (
        <Fragment>
            { slides.length>0? <Swiper
                loop={ true }
                autoplay={ {
                    delay: 2500,
                    disableOnInteraction: true,
                } }
                cssMode={ true }
                navigation={ true }
                keyboard={ true }
                modules={ [Navigation, Keyboard, Autoplay] }
                className="mySwiper"
            >
                { slides }
            </Swiper>
                :
                <>
                    <Spinner color="primary" className="m-3" type="grow">Loading...</Spinner>
                    <Spinner color="warning" className="m-3" type="grow">Loading...</Spinner>
                    <Spinner color="danger" className="m-3" type="grow">Loading...</Spinner>
                </>
            }
        </Fragment>
    );
})



const Ratesidebutton=memo(({ id, user }) =>{

    const [ratestate, setratestate] = useState({
        rated: 0,
        rateopen: false
    });

    const handle = useDispatch();

    useEffect(() => { 
        if (user) {
            const isloveref = ref(db, "/rate/" + id + "/" + user);
            get(isloveref).then((snapshot) => {
                if (snapshot.exists()) {
                    setratestate({ rateopen: ratestate.rateopen, rated: snapshot.val() })
                } else {
                    setratestate({ rateopen: ratestate.rateopen, rated: 0 })
                }
            })
        } else {
            setratestate({ rateopen: ratestate.rateopen, rated: 0 });
        }
    }, [id, user]);

    const openrate = (e) => {
        e.stopPropagation()
        setratestate({ rateopen: true, rated: ratestate.rated });
    }
    const closerate = (e) => {
        e.stopPropagation()
        setratestate({ rateopen: false, rated: ratestate.rated });
    }

    const rateproduct = (value, e) => {
        e.stopPropagation();
        if (user) {
            if (ratestate.rated == 0) {
                rate(id, user, value, () => { setratestate({ rateopen: false, rated: value }); });
            } else { 
                updaterate(id, user, ratestate.rated, value, () => { setratestate({ rateopen: false, rated: value }); })
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
    const removerateproduct = (e) => {
        e.stopPropagation()
        if (user) {
            removerate(id, user, ratestate.rated, () => { setratestate({ rateopen: false, rated: 0 }); });
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
        <div className={ "sidebutton " + (ratestate.rateopen && "openrate") } onFocus={closerate} onClick={ openrate }>
            <span key={ 5 } onClick={ !ratestate.rateopen ?openrate:rateproduct.bind(null, 5) } className={ "rate " + ((ratestate.rated && !ratestate.rateopen) && "rated")}></span>
            <span key={ 4 } onClick={ rateproduct.bind(null, 4) } className="rate" style={ { display: ratestate.rateopen?"inline":"none" } }></span>
            <span key={ 3 } onClick={ rateproduct.bind(null, 3) } className="rate" style={ { display: ratestate.rateopen?"inline":"none"} }></span>
            <span key={ 2 } onClick={rateproduct.bind(null,2)} className="rate" style={ { display: ratestate.rateopen?"inline":"none"} }></span>
            <span key={ 1 } onClick={rateproduct.bind(null,1)} className="rate" style={ { display: ratestate.rateopen?"inline":"none"} }></span>
            <span key={ 0 } onClick={ removerateproduct } className="delrate" style={ { display: ratestate.rateopen?"inline":"none"} }></span>
            <span key={ -1 } onClick={ closerate } className="closerate" style={ { display: ratestate.rateopen ? "inline" : "none" } }>&#xf057;</span>
        </div>
    )
})

const Lovesidebutton=memo(({ id, user })=>{

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
        <button onClick={ togglelove }
            className={ "sidebutton love " + (loved && "loved") }></button>
    )
})

const Cartsidebutton=memo(({ id, user }) =>{

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
        <button onClick={ togglecart }
            className={ "sidebutton cart " + (carted && "carted") }></button>
    )
})