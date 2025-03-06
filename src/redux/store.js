import { applyMiddleware, combineReducers, createStore } from "redux";
import {
    CommentRemove,
    CommentsNext,
    EmptyComments,
    EmptySaves,
    Login, Logout, NavNext, NavPrev, ResetFilter, SavesNext, SendComment, SetColors,
    SetGender, SetPrice, SetSize, SetupComments, SetupSaves, SetupStore,
    ToggleFilterMenu,
    ToggleLoginForm, ToggleSavesPage, ToggleToast, ToggleWaitPage, ViewProduct
} from "./events";
import { thunk } from "redux-thunk";


const uistate = {
    loginform: false,
    savespage: false,
    savespagetype: "loved",
    waitpage: false,
    toast: false,
    toasttext:"",
    toasttitle: "",
    filtermenu:true
};
const UIReducer = (state = uistate, action) => {
    switch (action.type) {
        case ToggleLoginForm:
            state.loginform = action.payload.value;
            return { ...state }
        case ToggleSavesPage:
            state.savespage = action.payload.value;
            state.savespagetype = action.payload.type;
            return { ...state }
        case ToggleWaitPage:
            state.waitpage = action.payload.value;
            return { ...state }
        case ToggleToast:
            state.toast = action.payload.value;
            state.toasttext = action.payload.text;
            state.toasttitle = action.payload.title;
            return {...state}
        case ToggleFilterMenu:
            state.filtermenu = action.payload.value;
            return {...state}
        default:
            return state
    }
}

const productstate = {
    id: null,
    photos: null,
    data: null
};
const ProductReducer = (state = productstate, action) => {
    switch (action.type) {
        case ViewProduct:
            return {
                id: action.payload.id,
                data: action.payload.data,
                photos: action.payload.photos
            }
            
        default:
            return state;
            
    }
}

const userstate = {
    id: null,
    photo: null,
    data: null
};
const UserReducer = (state = userstate, action) => {
    switch (action.type) {
        case Login:
            return {
                id: action.payload.id,
                data: action.payload.data,
                photo: action.payload.photo
            }
            
        case Logout:
            return {
                id: null,
                data: null,
                photos: null
            }
            
        default:
            return state;
            
    }
}

const storestate = {
    items: {},
    firstpos:"",
    lastpos: "",
    nextpos: "",
    prevpos:"",
    pos: "",
    quantity: 15
};
const StoreReducer = (state = storestate, action) => {
    switch (action.type) {
        case NavNext:
            state.items = action.payload.items;
            state.pos = state.nextpos;
            state.prevpos = state.nextpos;
            state.nextpos = Object.keys(action.payload.items).at(0);console.log(state);
            return {...state}
        case NavPrev:
            state.items = action.payload.items;
            state.pos = state.prevpos;
            state.nextpos = state.prevpos;
            state.prevpos = Object.keys(action.payload.items).at(-1); console.log(state);
            return { ...state }
        case SetupStore:
            state.items = {};
            state.lastpos = action.payload.lastpos;
            state.firstpos = action.payload.firstpos;
            state.pos = state.lastpos;
            state.prevpos = state.lastpos;
            state.nextpos = state.lastpos;
            return { ...state };
            
        default:
            return state;
            
    }
}

const filterstate = {
    gender: { men: true, women: true },
    size: { value: 30, allsize: true },
    price: { min: 0, max: 500 },
    colors: {
        red: true,
        white: true,
        blue: true,
        green: true,
        violet: true,
        black: true,
        yellow: true,
        blueviolet: true,
        brown: true,
        orangered: true
    }
};
const FilterReducer = (state = filterstate, action) => {
    switch (action.type) {
        case SetGender:
            state.gender = action.payload;
            return { ...state }
        case SetSize:
            state.size = action.payload;
            state.size.allsize = false;
            return { ...state }
        case SetPrice:
            state.price = action.payload;
            return { ...state }
        case SetColors:
            state.colors[action.payload.color] = action.payload.value;
            state.colors = {...state.colors}
            return { ...state }
        case ResetFilter:
            return {
                gender: { men: true, women: true },
                size: { value: 30, allsize: true },
                price: { min: 0, max: 500 },
                colors: {
                    red: true,
                    white: true,
                    blue: true,
                    green: true,
                    violet: true,
                    black: true,
                    yellow: true,
                    blueviolet: true,
                    brown: true,
                    orangered: true
                }
            };
        default:
            return state;
            
    }
}

const savesstate = {
    items: {},
    firstpos: "",
    lastpos: "",
    nextpos: "",
    prevpos: "",
    pos: "",
    quantity: 9
};
const SavesReducer = (state = savesstate, action) => {
    switch (action.type) {
        case SavesNext:
            state.items = { ...Object.assign(action.payload.items,state.items ) };
            state.pos = state.nextpos;
            state.prevpos = state.nextpos;
            state.nextpos = Object.keys(action.payload.items).at(0);
            return { ...state };
        case SetupSaves:
            state.items = {};
            state.lastpos = action.payload.lastpos;
            state.firstpos = action.payload.firstpos;
            state.pos = state.lastpos;
            state.prevpos = state.lastpos;
            state.nextpos = state.lastpos;
            return { ...state };
        case EmptySaves:
            return {
                items: {},
                firstpos: "",
                lastpos: "",
                nextpos: "",
                prevpos: "",
                pos: "",
                quantity: 9
            };
        default:
            return state;
            
    }
}

const commentsstate = {
    items: {},
    firstpos: "",
    lastpos: "",
    nextpos: "",
    prevpos: "",
    pos: "",
    quantity: 7
};
const CommentsReducer = (state = commentsstate, action) => {
    switch (action.type) {
        case CommentsNext:
            state.items = { ...Object.assign(action.payload.items, state.items) };
            state.pos = state.nextpos;
            state.prevpos = state.nextpos;
            state.nextpos = Object.keys(action.payload.items).at(0); console.log(state);
            return { ...state };
        case CommentRemove:
            delete state.items[action.payload.commentid];
            state.items = { ...state.items };
            return { ...state };
        case SendComment:
            state.items = { ...Object.assign(state.items, action.payload.items) };
            return {...state}
        case SetupComments:
            state.items = {};
            state.lastpos = action.payload.lastpos;
            state.firstpos = action.payload.firstpos;
            state.pos = state.lastpos;
            state.prevpos = state.lastpos;
            state.nextpos = state.lastpos;
            return { ...state };
        case EmptyComments:
            return {
                items: {},
                firstpos: "",
                lastpos: "",
                nextpos: "",
                prevpos: "",
                pos: "",
                quantity: 7
            };
        default:
            return state;
            
    }
}



export const store = createStore(combineReducers({
    ui: UIReducer,
    product: ProductReducer,
    user: UserReducer,
    store: StoreReducer,
    filter: FilterReducer,
    saves: SavesReducer,
    comment: CommentsReducer
}), applyMiddleware(thunk))