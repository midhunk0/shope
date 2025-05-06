import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Topbar.css";

export function Topbar(){
    const [closed, setClosed]=useState(true);
    const location=useLocation();

    function toggleDropdown(){
        setClosed(!closed);
    }

    return(
        <div className="topbar">
            <h4><Link to="/admin/home" className={location.pathname==="/admin/home" ? "active" : ""}>Shope.</Link></h4>
            <div className="topbarOptions">
                <h6><Link to="/admin/home" className={location.pathname==="/admin/home" ? "active" : ""}>Home</Link></h6>
                <h6><Link to="/admin/users" className={location.pathname==="/admin/users" ? "active" : ""}>Users</Link></h6>
                <h6><Link to="/admin/items" className={location.pathname==="/admin/items" ? "active" : ""}>Items</Link></h6>
                <h6><Link to="/admin/orders" className={location.pathname==="/admin/orders" ? "active" : ""}>Orders</Link></h6>
                <h6><Link to="/admin/account" className={location.pathname==="/admin/account" ? "active" : ""}>Account</Link></h6>
            </div>
            <div className="topbarDropdown" onClick={toggleDropdown}>
                <img src={closed ? "/icons/menu.png" : "/icons/close.png"} alt="img" onClick={toggleDropdown}/>
                {!closed ? (
                    <div className="dropdownOptions">
                        <h6><Link to="/admin/home" className={location.pathname==="/admin/home" ? "active" : ""}>Home</Link></h6>
                        <h6><Link to="/admin/users" className={location.pathname==="/admin/users" ? "active" : ""}>Users</Link></h6>
                        <h6><Link to="/admin/items" className={location.pathname==="/admin/items" ? "active" : ""}>Items</Link></h6>
                        <h6><Link to="/admin/orders" className={location.pathname==="/admin/orders" ? "active" : ""}>Orders</Link></h6>
                        <h6><Link to="/admin/account" className={location.pathname==="/admin/account" ? "active" : ""}>Account</Link></h6>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
};
