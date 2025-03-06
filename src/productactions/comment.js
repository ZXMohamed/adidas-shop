import { child, getDatabase, increment, push, ref, remove, set, update } from "firebase/database"


const db = getDatabase();

export function love(id, user, product ,success) {
    const requests = [];
    let rbody = {}

    rbody[user] = true
    requests.push(update(ref(db, "lovedcomments/" + product +"/" + id), rbody));

    requests.push(update(ref(db, "comments/" + product + "/" + id + ""), { loved: increment(+1) }));

    Promise.all(requests).then(() => {
        success();
    })
}
export function removelove(id, user, product, success) {
    const requests = [];
    requests.push(remove(ref(db, "lovedcomments/" + product + "/" + id + "/" + user)));
    requests.push(update(ref(db, "comments/" + product + "/" + id + ""), { loved: increment(-1) }));
    Promise.all(requests).then(() => {
        success();
    })
}

export function removecomment(id, user, product, success) {
    const requests = [];
    requests.push(remove(ref(db, "comments/" + product + "/" + id)));
    requests.push(remove(ref(db, "lovedcomments/" + product + "/" + id)));
    Promise.all(requests).then(() => {
        success();
    })
}


export function sendcomment(user,product,text,success) { console.log(text);

    const cid = push(child(ref(db), "comments/" + product)).key;
 
    const data={
        uid: user,
        pid: product,
        loved: 0,
        text: text,
    }
    set(ref(db, "comments/" + product + "/" + cid), data).then(() => { 
        success(cid, data, product);
    })
}