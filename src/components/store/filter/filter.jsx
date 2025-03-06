import MultiRangeSlider from "multi-range-slider-react";
import { useDispatch, useSelector } from "react-redux";
import { ResetFilter, SetColors, SetGender, SetPrice, SetSize } from "../../../redux/events";
import { memo } from "react";

function Filter({ children }) {
    
    const filter = useSelector(state => state.filter);
    const ui = useSelector(state => state.ui);
    const handle = useDispatch();



    return (
        <section className="filtermenucon" style={ { display: ui.filtermenu ? "block":"none"} }>
            <div className="filtermenu">
                <Gfilter mencheck={filter.gender.men} womencheck={ filter.gender.women } />
                <Sizefilter init={ filter.size.value } min={ 16 } max={ 55 } />
                <Pricefilter from={ filter.price.min  } to={ filter.price.max } min={ 0 } max={ 500 } currencysign={"$"} />
                <Colorfilter colors={ filter.colors  } />
                <section className="resetfilter">
                    <button  onClick={ () => { handle((dispatch) => { dispatch({ type: ResetFilter }) }); }} className="btn btn-light" style={ { width: "80%" } }>Reset</button>
                </section>
                { children }
            </div>
        </section>
    )
}

export default memo(Filter);

const Gfilter=memo(({mencheck,womencheck})=> { 

    const handle = useDispatch();

    const menselection=() => {
        handle((dispatch) => dispatch({ type: SetGender, payload: { men: !mencheck, women: womencheck } }));
    }

    const womenselection = () => {
        handle((dispatch) => dispatch({ type: SetGender, payload: { men: mencheck, women: !womencheck } }));
    }

    return (
        <section className="gfilter">
            <input type="checkbox" checked={ mencheck } onChange={ menselection }/>
            <label htmlFor="gfiltermen">Men</label>
            <br /><br />
            <input  type="checkbox" checked={ womencheck } onChange={ womenselection }/>
            <label htmlFor="gfilterwomen">Women</label>
        </section>
    )
})

const Sizefilter=memo(({ init, min, max }) =>{
    
    const handle = useDispatch();

    const sizechange = (e) => {
        handle((dispatch) => { dispatch({ type: SetSize, payload: { value: e.currentTarget.value } }) });
    }

    return (
        <section className="sizefilter">
            <label htmlFor={ "sizefilter" }>Size (EU) : </label>
            <input  type="number" value={init} onChange={sizechange} minLength={min} maxLength={max} max={max} min={min} />
        </section>
    )
})

const Pricefilter=memo(({ from, to, min, max, currencysign })=> {

    const handle = useDispatch();

    const handleInput = (e) => {
        handle((dispatch) => { dispatch({ type: SetPrice, payload: { min: e.minValue, max: e.maxValue } }) });
    };

    return (
        <section className="pricefilter">
            <label>Price : </label>
            <br />
            <div className="App">
                <MultiRangeSlider
                    className="storepricerange"
                    barInnerColor="var(--mid)"
                    barRightColor="var(--midlight)"
                    barLeftColor="var(--midlight)"
                    thumbLeftColor="var(--light)"
                    thumbRightColor="var(--light)"
                    canMinMaxValueSame={true}
                    label={ false }
                    labels={ false }
                    ruler={ false }
                    min={ min }
                    max={ max }
                    minValue={ from }
                    maxValue={ to }
                    step={ 1 }
                    onChange={ (e) => { handleInput(e); } }
                />
            </div>
            <div className="pricefilterrangetext">
                <span >{ from }{ currencysign }</span>
                <span >{ to }{ currencysign }</span>
            </div>
        </section>
    )
})

const Colorfilter=memo(({ colors })=> {
    
    const handle = useDispatch();

    const colorselection = (color, value) => { 
        handle((dispatch) => { dispatch({ type: SetColors, payload: { color: color, value: value } }) });
    }

    return (
        <section className="colorfilter">
            <label>Color :</label>
            <div id="colorfilterpeeker" className="colorfilterpeeker">
                <div className={ !colors.red ? "dropcolor" : " " } style={ { backgroundColor: "red" } } onClick={ colorselection.bind(null, "red", !colors.red) } value="red"></div>
                <div className={ !colors.white ? "dropcolor" : " " } style={ { backgroundColor: "white" } } onClick={ colorselection.bind(null, "white", !colors.white) } value="white"></div>
                <div className={ !colors.blue ? "dropcolor" : " " } style={ { backgroundColor: "blue" } } onClick={ colorselection.bind(null, "blue", !colors.blue) } value="blue"></div>
                <div className={ !colors.green ? "dropcolor":" " } style={ { backgroundColor: "green" } }  onClick={ colorselection.bind(null, "green", !colors.green) } value="green"></div>
                <div className={ !colors.violet ? "dropcolor":" " } style={ { backgroundColor: "violet" } }  onClick={ colorselection.bind(null, "violet", !colors.violet) } value="violet"></div>
                <div className={ !colors.black ? "dropcolor":" " } style={ { backgroundColor: "black" } }  onClick={ colorselection.bind(null, "black", !colors.black) } value="black"></div>
                <div className={ !colors.yellow ? "dropcolor":" " } style={ { backgroundColor: "yellow" } }  onClick={ colorselection.bind(null, "yellow", !colors.yellow) } value="yellow"></div>
                <div className={ !colors.blueviolet ? "dropcolor":" " } style={ { backgroundColor: "blueviolet" } }  onClick={ colorselection.bind(null, "blueviolet", !colors.blueviolet) } value="blueviolet"></div>
                <div className={ !colors.brown ? "dropcolor":" " } style={ { backgroundColor: "brown" } }  onClick={ colorselection.bind(null, "brown", !colors.brown) } value="brown"></div>
                <div className={ !colors.orangered ? "dropcolor":" " } style={ { backgroundColor: "orangered" } }  onClick={ colorselection.bind(null, "orangered", !colors.orangered) } value="orangered"></div>
            </div>
        </section>
    )
})