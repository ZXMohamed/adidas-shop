import { memo, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { EmptySaves, SavesNext, SetupSaves, ToggleSavesPage, ToggleToast } from "../../redux/events";
import { endAt, get, getDatabase, limitToFirst, limitToLast, orderByKey, query, ref } from "firebase/database";
import Product from "../product/product";
import { Spinner } from "reactstrap";


const db = getDatabase();

function Saves({ title, type }) {

    const [products, setproducts] = useState([]);

    const saves = useSelector(state => state.saves);
    const user = useSelector(state => state.user);
    const handle = useDispatch();

    const targetnode = type == "Wish_list" ? "love" : "cart";

    const next = async (dispatch) => {
        if (saves.firstpos != saves.nextpos && user.id) {
            const itemsref = query(ref(db, "/users/" + user.id + "/" + targetnode), orderByKey(), endAt(saves.nextpos), limitToLast(saves.quantity));
            const items = await get(itemsref);
            if (items.exists()) {
                dispatch({ type: SavesNext, payload: { items: items.val() } });
            }
        }

    }

    useEffect(() => {
        if (user.id) {
            if (!Object.keys(saves.items).length) {
                handle(async (dispatch) => {
                    //$get last
                    const lastposref = query(ref(db, "/users/" + user.id + "/" + targetnode), orderByKey(), limitToLast(1));
                    const lastpos = await get(lastposref);
                    //$get first
                    const firstposref = query(ref(db, "/users/" + user.id + "/" + targetnode), orderByKey(), limitToFirst(1));
                    const firstpos = await get(firstposref);
                    if (firstpos.val() && lastpos.val()) {
                        dispatch({
                            type: SetupSaves, payload: {
                                lastpos: Object.keys(lastpos.val())[0],
                                firstpos: Object.keys(firstpos.val())[0]
                            }
                        });
                        next(dispatch);
                    }

                })
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
    }, [type, user.id]);

    useEffect(() => {
        if (user.id) {
            const productsarr = []
            Object.keys(saves.items).map((id) => {
                console.log(id);
                productsarr.push(<Product key={ id } id={ id } data={ saves.items[id] } onClick={ () => { handle((dispatch) => { dispatch({ type: ToggleSavesPage, payload: { value: false } }) }) } } />)
            })
            setproducts(productsarr.reverse());
        } else { 
            setproducts([]);
        }
    }, [saves.items,user.id]);

    const scrolldown = (e) => {
        const max = parseInt(e.target.scrollHeight - e.target.getBoundingClientRect().height);
        if (e.target.scrollTop == max) {
            handle(next);
        }
    }

    const close = () => {
        handle((dispatch) => {
            dispatch({ type: EmptySaves });
            dispatch({ type: ToggleSavesPage, payload: { value: false } })
        });
    }

    return (
        <main className="savescon">
            <header className="savesheadercon">
                <aside className="savesheadersec1">
                    <span className="savesheadertitle">{ title }</span>
                    <hr className="savesstyleline" />
                    <button 
                        className="btn btn-light closefloatpage" onClick={ close }>&#xf00d;</button>
                </aside>
            </header>
            <section  className="savesproducts" onScroll={ scrolldown }>
                {
                    products.length <= 0 ?
                        <div className="savesproductsempty d-flex align-items-center flex-column">
                            <span className="text-center ">No thing here!</span>
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
                        :
                        products
                }
                <aside className="position-fixed bottom-0 right-0 p-3"
                    style={ { zIndex: "100", position: "absolute", right: "0", bottom: "0" } }></aside>
            </section>

            <footer className="savesfooter">
                <hr className="savesstyleline" />
            </footer>
        </main>
    )
}

export default memo(Saves);