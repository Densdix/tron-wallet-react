import React from "react";
import { NavLink } from "react-router-dom";
import style from './FooterNavBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseUser, faCrown, faPeopleGroup, faWallet, faUser } from '@fortawesome/free-solid-svg-icons'

const FooterNavBar = () => {
    return (
        <div className={style.footerArea}>
            <ul className="h-full flex items-center justify-between pl-0">
                <li className={style.item}><NavLink to="/"
                    className={({ isActive }) => isActive ? style.activeLink : style.unselected}>
                    <FontAwesomeIcon icon={faHouseUser} />
                    <span>Home</span>
                </NavLink>
                </li>
                <li className={style.item}><NavLink to="/vip"
                    className={({ isActive }) => isActive ? style.activeLink : style.unselected}>
                    <FontAwesomeIcon icon={faCrown} />
                    <span>VIP</span>
                </NavLink>
                </li>
                <li className={style.item}><NavLink to="/team"
                    className={({ isActive }) => isActive ? style.activeLink : style.unselected}>
                    <FontAwesomeIcon icon={faPeopleGroup} />
                    <span>Team</span>
                </NavLink>
                </li>
                <li className={style.item}><NavLink to="/wallet"
                    className={({ isActive }) => isActive ? style.activeLink : style.unselected}>
                    <FontAwesomeIcon icon={faWallet} />
                    <span>Wallet</span>
                </NavLink>
                </li>
                <li className={style.item}><NavLink to="/profile"
                    className={({ isActive }) => isActive ? style.activeLink : style.unselected}>
                    <FontAwesomeIcon icon={faUser} />
                    <span>Profile</span>
                </NavLink>
                </li>
            </ul>

        </div>
    )
}

export default FooterNavBar;