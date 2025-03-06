import logo from "../../photo/logo/adidaslogo.png";
import twiticon from "../../photo/sociallogo/twit.png";
import pinicon from "../../photo/sociallogo/pin.png";
import instaicon from "../../photo/sociallogo/insta.png";
import faceicon from "../../photo/sociallogo/face.png";
import { memo } from "react";


function Sitefooter() { 


    return (
        <footer className="footersec">
            <div className="row footerprandsocialrow">
                <section className="col-12 col-xl-3 footerprandsocial">
                    <div className="footerbrand w-100 d-flex justify-content-center align-items-center">
                        <img src={ logo } width="45%" alt="adidas logo"/>
                    </div>
                    <div
                        className="footersocial w-100 d-flex justify-content-center align-items-center">
                        <img src={ twiticon } width="5%" alt="twitter"/>
                        <img src={ pinicon } width="5%" alt="pinterest"/>
                        <img src={ instaicon } width="5%" alt="instagram"/>
                        <img src={ faceicon } width="5%" alt="facebook"/>
                    </div>
                </section>
                <section className="col-12 col-xl-9 order-xl-0" style={ { height: "100%", padding: "0px"} }>
                    <div className="row">
                        <section className="col-12 col-md-4 footerlinks h-100 ">
                            <span>Shop</span>
                            <ul type="none">
                                <li>Gift Guides</li>
                                <li>Fan Art</li>
                                <li>Blog</li>
                                <li>Login</li>
                                <li>Signup</li>
                                <li>About Us</li>
                            </ul>
                        </section>
                        <section className="col-12 col-md-4 footerlinks h-100">
                            <span>Business</span>
                            <ul type="none">
                                <li>Delivery</li>
                                <li>Returns</li>
                                <li>Help Center</li>
                                <li>Guidelines</li>
                                <li>Copyright</li>
                                <li>Investor Center</li>
                                <li>Contact Us</li>
                            </ul>
                        </section>
                        <section className="col-12 col-md-4 footerlinks h-100">
                            <span>Online store</span>
                            <ul type="none">
                                <li>Sell online</li>
                                <li>Features</li>
                                <li>Examples</li>
                                <li>Website editor</li>
                                <li>Online retail</li>
                                <li>E-commerce website</li>
                            </ul>
                        </section>
                    </div>
                </section>
            </div>
        </footer>
    )
}

export default memo(Sitefooter);