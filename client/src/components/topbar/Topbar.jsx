import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Topbar.css";

export function Topbar({ role }){
    const [closed, setClosed]=useState(true);
    const location=useLocation();

    function toggleDropdown(){
        setClosed(!closed);
    }

    return(
        <div className="topbar">
            <h4><Link to={`/${role}`} className={location.pathname===role ? "active" : ""}>Shope.</Link></h4>
            <div className="topbarOptions">
                <h6><Link to={`/${role}`} className={location.pathname===role ? "active" : ""}>Home</Link></h6>
                <h6><Link to={`/${role}/users`} className={location.pathname===`/${role}/users` ? "active" : ""}>Users</Link></h6>
                <h6><Link to={`/${role}/items`} className={location.pathname===`/${role}/items` ? "active" : ""}>Items</Link></h6>
                <h6><Link to={`/${role}/orders`} className={location.pathname===`/${role}/orders` ? "active" : ""}>Orders</Link></h6>
                <h6><Link to={`/${role}/account`} className={location.pathname===`/${role}/account` ? "active" : ""}>Account</Link></h6>
            </div>
            <div className="topbarDropdown" onClick={toggleDropdown}>
                <img src={closed ? "/icons/menu.png" : "/icons/close.png"} alt="img" onClick={toggleDropdown}/>
                {!closed ? (
                    <div className="dropdownOptions">
                        <h6><Link to={`/${role}`} className={location.pathname===role ? "active" : ""}>Home</Link></h6>
                        <h6><Link to={`/${role}/users`} className={location.pathname===`/${role}/users` ? "active" : ""}>Users</Link></h6>
                        <h6><Link to={`/${role}/items`} className={location.pathname===`/${role}/items` ? "active" : ""}>Items</Link></h6>
                        <h6><Link to={`/${role}/orders`} className={location.pathname===`/${role}/orders` ? "active" : ""}>Orders</Link></h6>
                        <h6><Link to={`/${role}/account`} className={location.pathname===`/${role}/account` ? "active" : ""}>Account</Link></h6>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
};
