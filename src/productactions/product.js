import { getDatabase, increment, ref, remove, update } from "firebase/database"


const db = getDatabase();

export function love(id, user, success) {
    const requests = [];
    let rbody = {}

    rbody[user] = true
    requests.push(update(ref(db, "love/" + id), rbody));

    rbody[id] = true
    requests.push(update(ref(db, "users/" + user + "/love"), rbody));

    requests.push(update(ref(db, "Products/" + id + ""), { loved: increment(+1) }));

    Promise.all(requests).then(() => {
        success();
    })
}
export function removelove(id, user, success) {
    const requests = [];
    requests.push(remove(ref(db, "love/" + id + "/" + user)));
    requests.push(remove(ref(db, "users/" + user + "/love/" + id)));
    requests.push(update(ref(db, "Products/" + id + ""), { loved: increment(-1) }));
    Promise.all(requests).then(() => {
        success();
    })
}



export function cart(id, user, success) { 
    const requests = [];
    let rbody = {}
    rbody[id] = true
    requests.push(update(ref(db, "users/" + user + "/cart"), rbody));
    Promise.all(requests).then(() => {
        success();
    })
}
export function removecart(id, user, success) { 
    const requests = [];
    requests.push(remove(ref(db, "users/" + user + "/cart/" + id)));
    Promise.all(requests).then(() => {
        success();
    })
}



export function rate(id, user, rate, success) { 
    const requests = [];
    let rbody = {}
    rbody[user] = rate
    requests.push(update(ref(db, "rate/" + id), rbody));
    requests.push(update(ref(db, "Products/" + id + ""), { "n-rate": increment(+1) }));
    requests.push(update(ref(db, "Products/" + id + ""), { "sum-rate": increment(+rate) }));
    Promise.all(requests).then(() => {
        success();
    })
}
export function updaterate(id, user, last, rate, success) {
    const requests = [];
    let rbody = {}
    rbody[user] = rate
    requests.push(update(ref(db, "rate/" + id), rbody));
    requests.push(update(ref(db, "Products/" + id + ""), { "sum-rate": increment(-last) }));
    requests.push(update(ref(db, "Products/" + id + ""), { "sum-rate": increment(+rate) }));
    Promise.all(requests).then(() => {
        success();
    })
}
export function removerate(id, user, last, success) { 
    const requests = [];
    requests.push(remove(ref(db, "rate/" + id + "/" + user)));
    requests.push(update(ref(db, "Products/" + id + ""), { "n-rate": increment(-1) }));
    requests.push(update(ref(db, "Products/" + id + ""), { "sum-rate": increment(-last) }));
    Promise.all(requests).then(() => {
        success();
    })
}