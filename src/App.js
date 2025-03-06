import { BrowserRouter, Route, Routes } from "react-router";
import Sitenavbar from "./components/navbar/navbar";
import Sitefooter from "./components/footer/footer";
import Index from "./components/index";
import Store from "./components/store/store";
import View from "./components/view/view";
import Productview from "./components/view/productview";
import Productcomments from "./components/view/comment/productcomments";
import Signup from "./components/signup/signup";
import Manageaccount from "./components/manageaccount/manageaccount";
import Saves from "./components/float/saves";
import { useDispatch, useSelector } from "react-redux";
import { Authchanges } from "./useractions/user";
import Notfound from "./components/notfound/notfound";
import Pathlistener from "./components/listener/pathlistener";
import { Toast,ToastBody,ToastHeader } from "reactstrap";
import { ToggleToast } from "./redux/events";


function App() {
  const ui = useSelector(store => store.ui);
  const handle = useDispatch();

  const closetoast = () => {
    handle((dispatch) => {
      dispatch({
        type: ToggleToast,
        payload: {
          value: false,
          text: "",
          title: ""
        }
      })
    })
  }

  return (
      <BrowserRouter>
        <Sitenavbar />
        <Authchanges/>
        {ui.savespage && <Saves title={ui.savespagetype} type={ui.savespagetype}/> }
        <Pathlistener/>
        <Toast isOpen={ ui.toast } style={{position:"fixed",top:"0px",right:"0",zIndex:"100"}}>
          <ToastHeader icon="secondary" toggle={ closetoast }>
          { ui.toasttitle }
          </ToastHeader>
          <ToastBody>
          { ui.toasttext }
          </ToastBody>
        </Toast>
        <Routes>
          <Route path="/" element={<Index/>}/>
          <Route path="/store" element={<Store/>}/>
          <Route path="/store/:Productname" element={<View/>}>
            <Route index element={<Productview/>}/>
            <Route path="view" element={<Productview/>}/>
            <Route path="comments" element={<Productcomments/>}/>
          </Route>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/manage_account/:pagefunction" element={<Manageaccount/>}/>
          <Route path="/mobile" element={<h1>mobile page</h1>}/>
          <Route path="/contact" element={<h1>contact page</h1>}/>
          <Route path="/about" element={<h1>about page</h1>}/>
          <Route path="*" element={<Notfound/>}/>
        </Routes>
        <Sitefooter/>
      </BrowserRouter>
  );
}

export default App;
