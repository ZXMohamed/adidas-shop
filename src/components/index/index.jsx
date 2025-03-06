import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";

import service_size from "../../photo/service/size.svg"
import service_materials from "../../photo/service/materials.svg"
import service_inspiration from "../../photo/service/inspiration.svg"
import newmodelarrowimg from "../../photo/newproduct/arrow.png"
import logo from "../../photo/logo/adidaslogo.png"

import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";

import { buttons, buttonsstyle, Shortbutton } from "../buttons/shortbuttons";
import Product from "../product/product";

import { useDispatch, useSelector } from "react-redux";
import { ToggleLoginForm, ToggleToast } from "../../redux/events";

import { useNavigate } from "react-router";

import { app } from "../../firebaseconfig";
import { get, getDatabase, limitToLast, orderByKey, query, ref } from "firebase/database";
import { getDownloadURL, listAll, ref as storageref } from "firebase/storage";
import { storage } from "../../storageconfig";
import { loginvalidat, onlogin } from "../../useractions/user";

import { Spinner } from "reactstrap";


const db = getDatabase(app);

function Index() {

    const [adds, setadds] = useState({});
    const [addsphotos, setaddsphotos] = useState([]);

    useEffect(() => {

        get(ref(db, "/adds")).then((adds) => {
            setadds(adds.val())
        })


        const getmedia = async () => {
            const newmodelphotoref = storageref(storage, "/adds/newmodel/photo");
            const photores = await listAll(newmodelphotoref);
            let urls = []
            for (const item of photores.items) {
                urls.push(getDownloadURL(item));
            }
            const newmodelvideoref = storageref(storage, "/adds/newmodel/video/video");
            const videores = await listAll(newmodelvideoref);
            for (const item of videores.items) {
                urls.push(getDownloadURL(item));
            }
            Promise.all(urls).then((urls) => {
                setaddsphotos(urls);
            })
        }
        getmedia();

    }, []);

    return (
        <Fragment>
            <Header adds={ addsphotos } />
            <Welcome />
            <About />
            <Ourservice />
            <Serviceaccordion />
            <Lastproducts />
            <Newproductsec adds={ adds } addsphotos={ addsphotos } />
            <Partenrsh />
            <Ourpartners />
        </Fragment>
    )
}

export default (Index);



const Header = memo(({ adds }) => {

    const [showpassword, setshowpassword] = useState(true);

    const goto = useNavigate();

    const ui = useSelector(store => store.ui);
    const handle = useDispatch();

    const email = useRef();
    const password = useRef();
    const remember = useRef();

    const forgetpassword = () => {
        handle((dispatch) => { dispatch({ type: ToggleLoginForm, payload: { value: false } }) });
        goto("/manage_account/forget_password");
    }
    const signup = () => {
        handle((dispatch) => { dispatch({ type: ToggleLoginForm, payload: { value: false } }) })
        goto("/signup");
    }

    const onloginaction = () => {
        if (loginvalidat({ email: email.current.value, password: password.current.value })) {
            onlogin(email.current.value, password.current.value, remember.current.checked, () => {
                handle((dispatch) => { dispatch({ type: ToggleLoginForm, payload: { value: false } }) });
                email.current.value = "";
                password.current.value = "";
            })
        } else {
            handle((dispatch) => {
                dispatch({
                    type: ToggleToast,
                    payload: {
                        value: true,
                        text: "Email or Password not valid",
                        title: "Login"
                    }
                })
            })
        }
    }

    return (
        <Fragment>
            <header className={ "indexheadersec " + (ui.loginform && "onheaderseclog") }>
                <div className={ "headerbackphoto w-100 " + (ui.loginform && "onheaderbackphotolog") }>
                    <div className="brandimg">
                        <img src={ logo } width="100%" alt='adidas logo' />
                    </div>
                    <div id="newmodel" className="newmodel" style={ { backgroundImage: "url('" + (adds ? adds[0] : "") + "')" } }>

                    </div>
                </div>
            </header>
            <main className="logsign w-100">
                <div className="position-relative h-100 w-100">
                    <section className="loginsec d-flex justify-content-center align-items-center h-100 w-100">
                        <div className="loginform">
                            <span className="loginformheader">Login</span>
                            <br /><br />
                            <input ref={ email }  type="email" className="loginemail" placeholder="email" autoComplete="email" />
                            <div className="loginshowpass">
                                <i onClick={ () => { setshowpassword(!showpassword) } }>{ showpassword ? <>&#xf070;</> : <>&#xf06e;</> }</i>
                                <input ref={ password }  type={ showpassword ? "password" : "text" } className="loginpassword" placeholder="Password" />
                            </div>
                            <div className="loginbuttoncon justify-content-between">
                                <label htmlFor="rememberme" className="text-white" style={ { fontSize: "16px" } }>
                                    <input ref={ remember } type="checkbox" className="me-2" id="rememberme" />
                                    Remember Me
                                </label>
                                <button className="loginbutton" onClick={ onloginaction }>Login</button>
                            </div>
                            <div className="forgetpasswordcon">
                                <button className="Forgetpasswordbutton" onClick={ forgetpassword }>Forget password</button>
                            </div>
                            <div className="gosigncon">
                                <span className="gosignbutton" onClick={ signup }>I don't have account</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </Fragment>
    )
});

const Welcome = memo(() => {
    return (
        <div className="welcometxt">
            Welcome to adidas fashion Shoes
        </div>
    )
})

const About = memo(() => {
    return (
        <main className="aboutsitesec d-flex justify-content-center align-items-center">
            <div className="aboutsite row">
                <aside className="col-12 col-xl-5 aboutimg"></aside>
                <aside
                    className="col-12 col-xl-7 abouttxt d-flex justify-content-center align-items-center">
                    <div className="abouttxtcon">
                        <header className="abouttxtheader">Fashion Shoes</header>
                        <br />
                        <p className="abouttext1">
                            your new style can be more attractive you can try to
                            buy one of our product and we sure you will love It
                            because we use
                            best material and best price.
                        </p>
                        <p className="abouttext2">
                            Here you can know about the new styles of Shoes from
                            adidas and buy the suitable Shoes for you
                            <span className="abouttext2stylepart">(Best value Best
                                choose)</span>.
                        </p>
                        <p className="abouttext3">
                            Now no more <span className="abouttext3stylepart">big size
                                problem</span> we offer all sizes and you can
                            get this in any country.
                        </p>
                    </div>
                </aside>
            </div>
        </main>
    )
})

const Ourservice = memo(() => {
    return (
        <main className="ourservicesec d-flex justify-content-center align-items-lg-end">
            <div className="ourservice row">
                <section className="col-4">
                    <div className="service1">
                        <header className="service1header">
                            <img src={ service_size } width="30%" alt='about adidas shose size' />
                            <span>Size</span>
                        </header>
                        <div className="service1txt">
                            We support all sizes and the biggest sizes with
                            comfortable design
                        </div>
                    </div>
                </section>
                <section className="col-4">
                    <div className="service2">
                        <header className="service2header">
                            <img src={ service_materials } width="28%" alt='about adidas shose Materials' />
                            <span>Materials</span>
                        </header>
                        <div className="service2txt">
                            We always use Environmentally friendly materials
                        </div>
                    </div>
                </section>
                <section className="col-4">
                    <div className="service3">
                        <header className="service3header">
                            <img src={ service_inspiration } width="27%" alt='about adidas inspiration' />
                            <span>Inspiration</span>
                        </header>
                        <div className="service3txt">
                            We inspire our product all over the world
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
})

const Lastproducts = memo(() => {

    const [products, setproducts] = useState([]);

    const shortbuttonsfunctions = useMemo(() => ({ store: buttons.store, love: buttons.love, cart: buttons.cart }), []);
    useEffect(() => {
        const lastproducts = [];
        const lastproductsref = query(ref(db, "/Products"), orderByKey(), limitToLast(9));
        get(lastproductsref).then((products) => {
            Object.keys(products.val()).map((id, inx) => {
                lastproducts.push(
                    <Product key={ inx } data={ products.val()[id] } id={ id } applyfilter={ false } />
                )
            })
            lastproducts.reverse();
            setproducts(lastproducts);
        })
    }, [])


    return (
        <main className="productsec">
            <div className="productcon">
                <header className="productheadercon">
                    <aside className="productheadertxt">
                        <span className="productheader">Last styles from adidas</span>
                        <span className="productsubtxt">This styles from 2020</span>
                    </aside>
                    <Shortbutton apperance={ buttonsstyle.big } buttons={ shortbuttonsfunctions } />
                </header>
                <section className="indexlastproducts w-100">
                    {
                        products.length <= 0 ?
                            <section className=" mb-auto">
                                <Spinner color="primary" className="m-5" type="grow">Loading...</Spinner>
                                <Spinner color="secondary" className="m-5" type="grow">Loading...</Spinner>
                                <Spinner color="success" className="m-5" type="grow">Loading...</Spinner>
                                <Spinner color="danger" className="m-5" type="grow">Loading...</Spinner>
                                <Spinner color="warning" className="m-5" type="grow">Loading...</Spinner>
                                <Spinner color="info" className="m-5" type="grow">Loading...</Spinner>
                                <Spinner color="light" className="m-5" type="grow">Loading...</Spinner>
                                <Spinner color="dark" className="m-5" type="grow">Loading...</Spinner>

                            </section>
                            :
                            products
                    }
                </section>
            </div>
        </main>
    )
})

const Newproductsec = memo(({ adds, addsphotos }) => {

    const [isaddsvideomuted, setisaddsvideomuted] = useState(true);
    const [statistics, setstatistics] = useState(true);

    const video = useRef()

    useEffect(() => {
        if (adds.newmodel) {
            const statistics = [];
            Object.keys(adds.newmodel.Statistics).map((val, inx) => {
                statistics.push(
                    <div key={ inx }>
                        <div>
                            <div>
                                <div>{ adds.newmodel.Statistics[val] }</div>
                            </div>
                        </div>
                        <span>{ val }</span>
                    </div>
                )
            })
            setstatistics(statistics);
        }
        video.current.play().catch(() => { });
    }, [adds, addsphotos])

    return (
        <main className="newproductsec">
            <video ref={ video } preload="metadata" src={ addsphotos[1] } id="newmodelvideo" loop muted={ isaddsvideomuted }></video>
            <div className="newproduct">
                <section className="newproductheader">
                    <div className="newproducttitle">{ adds?.newmodel?.name }</div>
                    <div className="newproductaudio">
                        <hr size="5px" style={ { backgroundColor: "white!important" } } />
                        <button id="videomutebtn" onClick={ () => { setisaddsvideomuted(!isaddsvideomuted) } }>{ isaddsvideomuted ? <>&#xf028;</> : <>&#xf6a9;</> }</button>
                    </div>
                </section>
                <section id="newmodelstat" className="newproductstatics">
                    { statistics }
                    <aside></aside>
                </section>
                <section className="newproductdes2">
                    <span  className="des1">{ adds?.newmodel?.description?.des1 }</span>
                    <img  className="des1arrow" src={ newmodelarrowimg } alt='adidas arrow img' width="4%" />
                    <span className="des2">{ adds?.newmodel?.description?.des2 }</span>
                    <img  className="des2arrow" src={ newmodelarrowimg } alt='adidas arrow img' width="4%" />
                    <div className="newproductw">
                        <div className="newproductp" style={ { backgroundImage: "url('" + addsphotos[0] + "')" } }></div>
                        <div className="newproductss"></div>
                    </div>
                    <img className="des3arrow" src={ newmodelarrowimg } alt='adidas arrow img' width="4%" />
                    <span className="des3">{ adds?.newmodel?.description?.des3 }</span>
                </section>
                <section className="newproductseemore">
                    <Link to={ {
                        pathname: "/store/" + adds?.newmodel?.name.replaceAll(" ", "_") + "/view",
                        search: "?id=" + adds?.newmodel?.pid
                    } } >See More</Link>
                </section>
            </div>
        </main>
    )
})

const Serviceaccordion = memo(() => {

    const [openservice, setOpenservice] = useState('');
    const toggle = (id) => {
        if (openservice === id) {
            setOpenservice();
        } else {
            setOpenservice(id);
        }
    };

    return (
        <Accordion className="d-none" flush open={ openservice } toggle={ toggle }>
            <AccordionItem>
                <AccordionHeader targetId="1" className="serveccollapsebutton">
                    <img src={ service_size } width="10%" alt='about adidas shose size' />
                    <span>Size</span>
                </AccordionHeader>
                <AccordionBody accordionId="1">
                    - We support all sizes and the biggest
                    sizes with comfortable design
                    - your new style can be more attractive you can try to buy one of our product and we sure you will love It because we use best material and best price.

                    Here you can know about the new styles of Shoes from adidas and buy the suitable Shoes for you (Best value Best choose).

                    Now no more big size problem we offer all sizes and you can get this in any country.
                    - your new style can be more attractive you can try to buy one of our product and we sure you will love It because we use best material and best price.

                    Here you can know about the new styles of Shoes from adidas and buy the suitable Shoes for you (Best value Best choose).

                    Now no more big size problem we offer all sizes and you can get this in any country.
                    - your new style can be more attractive you can try to buy one of our product and we sure you will love It because we use best material and best price.

                    Here you can know about the new styles of Shoes from adidas and buy the suitable Shoes for you (Best value Best choose).

                    Now no more big size problem we offer all sizes and you can get this in any country.
                    - your new style can be more attractive you can try to buy one of our product and we sure you will love It because we use best material and best price.

                    Here you can know about the new styles of Shoes from adidas and buy the suitable Shoes for you (Best value Best choose).

                    Now no more big size problem we offer all sizes and you can get this in any country.
                </AccordionBody>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader targetId="2" className="serveccollapsebutton">
                    <img src={ service_materials } width="8%" alt='about adidas shose materials' />
                    <span>Materials</span>
                </AccordionHeader>
                <AccordionBody accordionId="2">
                    - We always use Environmentally friendly materials
                    - your new style can be more attractive you can try to buy one of our product and we sure you will love It because we use best material and best price.

                    Here you can know about the new styles of Shoes from adidas and buy the suitable Shoes for you (Best value Best choose).

                    Now no more big size problem we offer all sizes and you can get this in any country.
                </AccordionBody>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader targetId="3" className="serveccollapsebutton">
                    <img src={ service_inspiration } width="7%" alt="about adidas inspiration" />
                    <span>Inspiration</span>
                </AccordionHeader>
                <AccordionBody accordionId="3">
                    - We inspire our product all over the world
                    - your new style can be more attractive you can try to buy one of our product and we sure you will love It because we use best material and best price.

                    Here you can know about the new styles of Shoes from adidas and buy the suitable Shoes for you (Best value Best choose).

                    Now no more big size problem we offer all sizes and you can get this in any country.
                    - your new style can be more attractive you can try to buy one of our product and we sure you will love It because we use best material and best price.

                    Here you can know about the new styles of Shoes from adidas and buy the suitable Shoes for you (Best value Best choose).

                    Now no more big size problem we offer all sizes and you can get this in any country.
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    )
})

const Partenrsh = memo(() => {
    return (
        <div className="Partenrsh">
            Our Partners
        </div>
    )
})

const Ourpartners = memo(() => {
    const [parteners, setparteners] = useState([]);

    useEffect(() => {
        get(ref(db, "/Partners")).then((parteners) => {
            const partenersphotourls = [];
            const geturls = async () => {
                for (const partener in parteners.val()) {
                    const partenersphotos = [];
                    const partenerref = storageref(storage, "/partners/" + partener);
                    const content = await listAll(partenerref)
                    for (const item of content.items) {
                        partenersphotos.push(getDownloadURL(item));
                    }
                    const urls = await Promise.all(partenersphotos)
                    urls.map((photo) => {
                        partenersphotourls.push(photo);
                    })
                }
                console.log(partenersphotourls);
                const partenersbox = [];
                partenersphotourls.map((photo, inx) => {
                    partenersbox.push(
                        <div key={ inx } className="d-flex justify-content-center align-items-center">
                            <img src={ photo } alt={ '' } style={ { width: "100%" } } />
                        </div>
                    )
                })
                setparteners(partenersbox);
            }
            geturls()
        })
    }, [])

    return (
        <main className="ourpartnerssec">
            <div className="ourpartnersbg w-100 h-100"></div>
            <div className="ourpartnerscontentland w-100 h-100">
                <div className="ourpartnerscontent h-100 w-100">
                    <div className="stylebar w-100"></div>
                    <div className="ourpartnersheader">
                        <span>Our Partners</span>
                    </div>
                    <div id="ourpartners" className="ourpartners">
                        { parteners }
                    </div>
                </div>
            </div>
        </main>
    )
})