import { getDownloadURL, listAll, ref as storageref } from "firebase/storage";
import { memo, useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { storage } from "../../../storageconfig";
import { get, getDatabase, ref } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { love, removecomment, removelove } from "../../../productactions/comment";
import { CommentRemove, ToggleToast } from "../../../redux/events";

const db = getDatabase();

function Comment({ id, data, product }) {
    
    const [sender, setsender] = useState(null);

    const user = useSelector(state => state.user);

    useEffect(() => {
        if (data["uid"]) {
            const getsenderdata = async () => {
                const photoref = storageref(storage, "/customerphoto/" + data["uid"] + "/photo/");
                const photo = await listAll(photoref);
                const senderdata = [];
                for (const item of photo.items) {
                    senderdata.push(getDownloadURL(item));
                }
                const nameref = ref(db, "/users/" + data["uid"]);
                const name = await get(nameref);
                senderdata.push(name)
                Promise.all(senderdata).then((data) => {
                    if (data.length == 2 && data[1]?.val()) {
                        setsender({ photo: data[0], name: data[1].val().name });
                    } else { 
                        setsender(null);
                    }
                })
            }
            getsenderdata();
        } else {
            setsender(null);
        }
    }, [id])

    return (<>{sender && <div className="media mb-2" >
            <img className="me-3" alt="..." src={ sender.photo } style={ { width: "52.875px" } } />
            <div className="media-body">
                <h6>{ sender.name }</h6>
                <p style={ { width: "97%", fontSize: "14px" } }>
                    { data["text"] }
                </p>
                <div className="commentbuttons">
                    <Love id={ id } user={ user.id } product={ product } count={ data["loved"] } />
                   
                    { user.id == data["uid"] && user.id != null && data["uid"] != null && <Commentmenu id={ id } user={ user.id } product={ product } /> }
                </div>
               
            </div>
        </div>}</>)
    
}


export default memo(Comment);


const Love=memo(({ id, user, product, count })=> { 

    const [loved, setloved] = useState(false);
    const [countvalue, setcountvalue] = useState(count);

    const handle = useDispatch();

    useEffect(() => {
        if (user) {
            const isloveref = ref(db, "/lovedcomments/" + product +"/"+ id + "/" + user);
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
                removelove(id, user, product, () => { setloved(false); });
                setcountvalue(countvalue - 1);
            } else { 
                love(id, user, product, () => { setloved(true); });
                setcountvalue(countvalue + 1);
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
        <span onClick={ togglelove  }
            className={ "commentlove " + (loved && "loved") + " me-3" }
            style={ { cursor: "pointer" } }> { countvalue?countvalue:0 }</span>
    )
})

const Commentmenu=memo(({ id, user, product }) =>{ 
    

    const [Commentmenuopen, setCommentmenuopen] = useState(false);

    const handle = useDispatch();

    const toggle = () => setCommentmenuopen((prevState) => !prevState);

    const remove = () => { 
        if (user) {
            removecomment(id, user, product, () => { handle((dispatch) => { dispatch({ type: CommentRemove, payload: { commentid: id } }) }) })
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
        <Dropdown isOpen={ Commentmenuopen } toggle={ toggle } className="msgmenu">
            <DropdownToggle className="commentmenu"></DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={remove}> delete</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
})