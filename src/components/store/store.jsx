import { useState, Fragment, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filter from "./filter/filter";
import { buttons, buttonsstyle, Shortbutton } from "../buttons/shortbuttons";
import { Swiper,SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Navigation } from "swiper/modules";
import Product from "../product/product";
import { getDownloadURL, listAll, ref as storageref } from "firebase/storage";
import { storage } from "../../storageconfig";
import { endAt, get, getDatabase, limitToFirst, limitToLast, orderByKey, query, ref, startAt } from "firebase/database";
import { NavNext, NavPrev, SetupStore, ToggleFilterMenu } from "../../redux/events";
import { Spinner } from "reactstrap";


const db = getDatabase();

function Store() { 

    return (
        <Fragment>
            <Addsslider />
            <main className="storeproductscon">
                <Filter>
                    <Shortbutton apperance={ buttonsstyle.small } buttons={ { mode: buttons.mode, love: buttons.love, cart: buttons.cart, chat: buttons.chat } } />
                </Filter>
                <Productspage/>
            </main>
        </Fragment>
    )
}

export default memo(Store);


const Addsslider = memo(()=> {

    const [banners, setbanners] = useState([]);

    const ui = useSelector(state => state.ui);
    const handle = useDispatch();

    useEffect(() => {
        const bannerref = storageref(storage, "/adds/Banner");
        listAll(bannerref).then((banner) => {
            const urls = [];
            for (const url of banner.items) {
                urls.push(getDownloadURL(url))
            }
            Promise.all(urls).then((urls) => {
                const banners = [];
                urls.map((url,inx) => {
                    banners.push(
                        <SwiperSlide key={ inx }>
                            <img src={ url } alt={ "" } className="w-100" />
                        </SwiperSlide>
                    )
                })
                setbanners(banners);
            })
        })
    }, [])

    const togglemenu = () => { 
        handle((dispatch) => { dispatch({ type: ToggleFilterMenu, payload: { value: !ui.filtermenu } })})
    }

    return (
        <div className="storeheadersec">
            <button className="btn menubtn" onClick={togglemenu}>&#xf0c9;</button>
            { banners.length>0?<Swiper navigation={ true }
                loop={ true }
                autoplay={ {
                    delay: 5000,
                    disableOnInteraction: false,
                } }
                cssMode={ true }
                keyboard={ true }
                modules={ [Navigation, Keyboard, Autoplay] }
                className="mySwiper h-100 w-100">
                {banners}
            </Swiper>
                : 
            <div className="d-flex justify-content-center align-items-center flex-column mt-5">
                <span className="text-center">loading ...</span>
                <section>
                    <Spinner color="primary" className="m-5" type="grow">Loading...</Spinner>
                    <Spinner color="secondary" className="m-5" type="grow">Loading...</Spinner>
                    <Spinner color="success" className="m-5" type="grow">Loading...</Spinner>
                    <Spinner color="danger" className="m-5" type="grow">Loading...</Spinner>
                    <Spinner color="warning" className="m-5" type="grow">Loading...</Spinner>
                    <Spinner color="info" className="m-5" type="grow">Loading...</Spinner>
                    <Spinner color="light" className="m-5" type="grow">Loading...</Spinner>
                    <Spinner color="dark" className="m-5" type="grow">Loading...</Spinner>
                </section>
            </div>
            }
        </div>
    )
})

const Productspage = memo(() => {
    const [products, setproducts] = useState([]);
    
    const store = useSelector(state => state.store);
    const filter = useSelector(state => state.filter);

    useEffect(() => {
        createview();
    }, [store.items, filter]);

    const createview = () => { 
        const productsarr = []
        Object.keys(store.items).map((id) => {
            productsarr.push(<Product key={ id } id={ id } data={ store.items[id] } applyfilter />)
        })
        setproducts(productsarr.reverse());
    }

    return (
        <section style={ { width: "1460px", height: "100%" } }>
            <section className="storeproducts">
                { products }
            </section>
            <Navigator/>
        </section>
    )
})

const Navigator = memo(()=> {

    const store = useSelector(state => state.store);
    const handle = useDispatch();
    
    const next = async (dispatch) => {
        if (store.firstpos != store.nextpos) {
                const itemsref = query(ref(db, "/Products"), orderByKey(), endAt(store.nextpos), limitToLast(store.quantity));
                const items = await get(itemsref);
                if (items.exists()) {
                    window.scrollTo(0, 0);
                    dispatch({ type: NavNext, payload: { items: items.val() } });
                }
        }
        
    }
    const prev = async(dispatch) => {
        if (store.lastpos != store.prevpos) {
                const itemsref = query(ref(db, "/Products"), orderByKey(), startAt(store.prevpos), limitToFirst(store.quantity));
                const items = await get(itemsref);
                if (items.exists()) {
                    window.scrollTo(0, 0);
                    dispatch({ type: NavPrev, payload: { items: items.val() } });
                }
        }
        
    }
    useEffect(() => {
        if (!Object.keys(store.items).length) {
            handle(async (dispatch) => {
                const lastposref = query(ref(db, "/Products"), orderByKey(), limitToLast(1));
                const lastpos = await get(lastposref);
                const firstposref = query(ref(db, "/Products"), orderByKey(), limitToFirst(1));
                const firstpos = await get(firstposref);
                if (firstpos.val() && lastpos.val()) {
                    dispatch({
                        type: SetupStore, payload: {
                            lastpos: Object.keys(lastpos.val())[0],
                            firstpos: Object.keys(firstpos.val())[0]
                        }
                    });
                    next(dispatch);
                }
            })
        }
        
    }, [])

    return (
        <section className="navigator">
            <button  onClick={()=>handle(prev)}>&#xf104;</button>
            <button  onClick={()=>handle(next)}>&#xf105;</button>
        </section>
    )
})

