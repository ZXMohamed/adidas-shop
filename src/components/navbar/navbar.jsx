import React, { memo, useEffect, useState } from 'react';
import { Link,NavLink, useMatch, useNavigate } from 'react-router';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle
} from 'reactstrap';
import Searchitem from './searchitem';
import { useDispatch, useSelector } from 'react-redux';
import { ToggleLoginForm } from '../../redux/events';
import { storage } from '../../storageconfig';
import { getDownloadURL, listAll, ref as storageref } from 'firebase/storage';
import { getDatabase,ref,get,query, orderByChild, startAt, endAt } from 'firebase/database';
import { onlogout } from '../../useractions/user';
import { Ntheme } from '../../theme/theme';

const db = getDatabase();

function Sitenavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const togglenav = () => setIsOpen(!isOpen);

    const ui = useSelector(state => state.ui);
    const user = useSelector(state => state.user);
    const handle = useDispatch();

    const goto = useNavigate();
    const path = useMatch("/");


    const login = () => {
        handle((dispatch) => { 
            if (!path) {
                goto("/")
                dispatch({ type: ToggleLoginForm, payload: { value: true } });
            } else {
                dispatch({ type: ToggleLoginForm, payload: { value: ui.loginform ? false : true } });
            }
        })
    }
    const signup = () => {
        handle((dispatch) => { dispatch({ type: ToggleLoginForm, payload: { value: false } }); })
        goto("/signup")
    }

    const onlogoutaction = () => {
        onlogout()
    }

    return (
        <Navbar expand={"xxl"} container>
            <NavbarBrand tag={ "div" }>
                <Link to={ "/" }>adidas</Link>
            </NavbarBrand>
            <NavbarToggler onClick={ togglenav } />
            <Collapse isOpen={ isOpen } navbar className='navcoll'>
                <Nav className="me-auto w-100" navbar>
                    <Search/>
                    
                    <NavItem>
                        <NavLink to="/store">Store</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/mobile">Mobile</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/contact">Contact</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/about">About</NavLink>
                    </NavItem>
                    <NavItem className='nav-item-mode'>
                        <button type="button" className='btn navmode' onClick={ () => { Ntheme.next() } }>&#xf042;</button>
                    </NavItem>
                    <NavItem className='logsignsec'>
                        { 
                            !user.id ?
                                <>
                                    <button type="button" className='btn login' onClick={login}></button>
                                    <button type="button" className='btn signup' onClick={signup}></button>
                                </>
                                    :
                                <>
                                    <Userphoto user={ user } />
                                    <button type="button" className='btn logout' onClick={ onlogoutaction }>&#xf2f5;</button>
                                </>
                            
                        }
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default memo(Sitenavbar);


const Userphoto = memo(({ user }) =>{ 

    const [photo, setphoto] = useState("");

    useEffect(() => {
        const userphotoref = storageref(storage, "/customerphoto/" + user.id + "/photo");
        listAll(userphotoref).then((userphoto) => {
            if (userphoto.items[0]) {
                Promise.all([getDownloadURL(userphoto.items[0])]).then((url) => {
                    if(url)
                    setphoto(url);
                })
            }
        })

    },[user])

    return (
        <div type="button" className='userphoto' style={ { backgroundImage: "url('" + photo + "')" } }></div>
    )
})

const Search = memo(()=> { 
    const [filterdropdownOpen, setfilterDropdownOpen] = useState(false);
    const togglesearchfilter = () => setfilterDropdownOpen((prevState) => !prevState);

    const [searchdropdownOpen, setsearchDropdownOpen] = useState(false);
    const togglesearchresult = () => setsearchDropdownOpen((prevState) => !prevState);

    const [filter , setfilter] = useState("name");

    const [result, setresult] = useState(<DropdownItem className="dropdown-item searchdropdownnoitem searchdropdownitem"><span>Search by : {filter}</span></DropdownItem>);
    
    const getresults = async (e) => {
        if (e.currentTarget.value.trim() != "") {
            const searchquery = query(ref(db, "/Products"), orderByChild(filter), startAt(e.currentTarget.value.toString()), endAt(e.currentTarget.value.toString() + "\uf8ff"))
            const resultdata = await get(searchquery);
            if (resultdata.val()) {
                let resultarr = [];
                for (const id in resultdata.val()) {
                    resultarr.push(
                        <DropdownItem className="dropdown-item" value={id}>
                            <Searchitem key={ id } id={ id } data={ resultdata.val()[id] } />
                        </DropdownItem>
                    );
                }
                setresult(resultarr);
            } else { 
                setresult(
                    <>
                        <DropdownItem className="dropdown-item searchdropdownnoitem searchdropdownitem"><span>Search by : {filter}</span></DropdownItem>
                        <div className="dropdown-divider"></div>
                        <DropdownItem className="dropdown-item searchdropdownnoitem searchdropdownitem"><span>No Thing Here !</span></DropdownItem>
                    </>
                )
            }
        } else { 
            setresult(<DropdownItem className="dropdown-item searchdropdownnoitem searchdropdownitem"><span>Search by : { filter }</span></DropdownItem>);
        }
        
    }


    return (
        <div className="searchsec me-5">

            <Dropdown isOpen={ searchdropdownOpen } direction='down' toggle={ togglesearchresult } className='searchdropdown h-100 w-100'>
                <input type="search" placeholder="Search" onChange={getresults} />
                <DropdownMenu end className='searchdropdownlist'>
                        {result}
                </DropdownMenu>
                <DropdownToggle className="searchbutton" tag={ "button" }>&#xf002;</DropdownToggle>
            </Dropdown>

            <Dropdown isOpen={ filterdropdownOpen } toggle={ togglesearchfilter } direction={ "down" } className='filterdropdown'>
                <DropdownToggle tag={ "button" } className='searchbutton'>&#xf1de;</DropdownToggle>
                <DropdownMenu className='filterdropdownlist'>
                    <DropdownItem className="dropdown-item" value="Name" onClick={ () => { setfilter("name"); }}>Search by : Name</DropdownItem>
                </DropdownMenu>
            </Dropdown>

        </div>
    )
})