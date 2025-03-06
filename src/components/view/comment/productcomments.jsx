import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import Comment from "./comment";
import { useDispatch, useSelector } from "react-redux";
import { endAt, equalTo, get, getDatabase, limitToFirst, limitToLast, orderByKey, query, ref } from "firebase/database";
import { CommentsNext, EmptyComments, SendComment, SetupComments, ToggleToast, ViewProduct } from "../../../redux/events";
import { getDownloadURL, listAll, ref as storageref } from "firebase/storage";
import { storage } from "../../../storageconfig";
import { Spinner } from "reactstrap";
import { sendcomment } from "../../../productactions/comment";

const db = getDatabase();


function Productcomments() {
    const productname = useParams().Productname;
    const [search] = useSearchParams();

    const [comments, setcomments] = useState([]);

    const commentref = useRef();
    const commentpoolref = useRef();

    const product = useSelector(state=>state.product)
    const comment = useSelector(state => state.comment);
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
                loadedproduct.photos = photosurls;
                handle(async (dispatch) => {
                    dispatch({ type: EmptyComments });
                    dispatch({ type: ViewProduct, payload: loadedproduct });
                });
            }
        }
        loadproduct();
        
    },[])


    const next = async(dispatch) => {
        if (comment.firstpos != comment.nextpos) {
                const itemsref = query(ref(db, "/comments/"+product.id), orderByKey(), endAt(comment.nextpos), limitToLast(comment.quantity));
                const items = await get(itemsref);
                if (items.exists()) {
                    dispatch({ type: CommentsNext, payload: { items: items.val() } });
                }
        }
        
    }

    useEffect(() => {
        handle(async (dispatch) => {     
            if (product.id) {
                if (!Object.keys(comment.items).length) {
                    const lastposref = query(ref(db, "/comments/" + product.id), orderByKey(), limitToLast(1));
                    const lastpos = await get(lastposref);
                    const firstposref = query(ref(db, "/comments/" + product.id), orderByKey(), limitToFirst(1));
                    const firstpos = await get(firstposref)
                    if (firstpos.val() && lastpos.val()) {
                        dispatch({
                            type: SetupComments, payload: {
                                lastpos: Object.keys(lastpos.val())[0],
                                firstpos: Object.keys(firstpos.val())[0]
                            }
                        });
                        next(dispatch);
                    }
                }
            }
        })
    }, [product.id]);
    
    useEffect(() => {
        if (Object.keys(comment.items).length) {
            const commentsarr = []
            for (const id in comment.items) {
                commentsarr.push(<Comment key={ id } id={ id } data={ comment.items[id] } product={ product.id } />)
            }
        
            setcomments(commentsarr.reverse());
        }
    }, [comment.items]);

    const scrolldown = (e) => { 
        const max = parseInt(e.target.scrollHeight - e.target.getBoundingClientRect().height);
        if (e.target.scrollTop == max) {
            handle(next);
        }
    }


    const send = () => {
        if(user.id){
            sendcomment(user.id, product.id, commentref.current.value, (id, data, product) => { 
                handle((dispatch) => {
                    dispatch({ type: SendComment, payload: { items: { [id]: data } } });
                });
                commentref.current.value = "";
                commentpoolref.current.scrollTo(0, 0);

            })
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
        <Fragment>
            <div style={ { display: "flex", justifyContent: "space-between", alignItems: "center" } }>
                <Link to={ { pathname: "/store/" + productname + "/view", search: "?" + search.toString() } } className="sidebutton commbackbtn">&#xf022;</Link>
            </div>
            <div ref={ commentpoolref } id="commpool" className="commentslist msgpool" onScroll={ scrolldown }>
                {
                    comments.length <= 0 ?
                        <>
                            <span >No one comment here yet !</span>
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
                        </>
                        :
                        comments
                }
            </div>
            <div className="commentcontrols">
                <input ref={ commentref } id="comminput" placeholder="Write your comment here" type="text" className="form-control ps-4" />
                <button className="btn" onClick={send}>&#xf1d8;</button>
            </div>
        </Fragment>
    )
}
export default Productcomments;

