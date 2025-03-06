import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { ToggleSavesPage } from "../../redux/events";
import { memo } from "react";
import { Ntheme } from "../../theme/theme";

export const buttons = {
    love: true,
    cart: true,
    mode: true,
    chat: true,
    store: true
}
export const buttonsstyle = {
    small: 0,
    big: 1
}

export const Shortbutton = memo(({ apperance, buttons }) =>{

    const handle = useDispatch();

    const loved = () => {
        handle((dispatch) => { dispatch({ type: ToggleSavesPage, payload: { value: true, type: "Wish_list" } }) });
    }
    const cart = () => {
        handle((dispatch) => { dispatch({ type: ToggleSavesPage, payload: { value: true, type: "Cart" } }) });
    }

    return (
        <section className={ "floatbuttons " + (buttonsstyle.small == apperance ? "floatbuttons-small" : "floatbuttons-big") }>
            { buttons.mode && <div onClick={()=>Ntheme.next()}>&#xf042;</div> }
            { buttons.love && <div  onClick={loved}>&#xf004;</div> }
            { buttons.cart && <div  onClick={cart}>&#xf217;</div> }
            { buttons.chat && <div>&#xf4ad;</div> }
            { buttons.store && <div><Link to={"/store"}>&#xf468;</Link></div> }
        </section>
    )
});


