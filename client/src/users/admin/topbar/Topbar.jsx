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
            <h4><Link to="/admin/dashboard" className={location.pathname==="/admin/dashboard" ? "active" : ""}>Shope.</Link></h4>
            <div className="topbarOptions">
                <h6><Link to="/admin/dashboard" className={location.pathname==="/admin/dashboard/home" ? "active" : ""}>Home</Link></h6>
                <h6><Link to="/admin/dashboard/users" className={location.pathname==="/admin/dashboard/users" ? "active" : ""}>Users</Link></h6>
                <h6><Link to="/admin/dashboard/items" className={location.pathname==="/admin/dashboard/items" ? "active" : ""}>Items</Link></h6>
                <h6><Link to="/admin/dashboard/orders" className={location.pathname==="/admin/dashboard/orders" ? "active" : ""}>Orders</Link></h6>
                <h6><Link to="/admin/dashboard/account" className={location.pathname==="/admin/dashboard/account" ? "active" : ""}>Account</Link></h6>
            </div>
            <div className="topbarDropdown" onClick={toggleDropdown}>
                <img src={closed ? "/icons/menu.png" : "/icons/close.png"} alt="img" onClick={toggleDropdown}/>
                {!closed ? (
                    <div className="dropdownOptions">
                        <h6><Link to="/admin/dashboard" className={location.pathname==="/admin/dashboard" ? "active" : ""}>Home</Link></h6>
                        <h6><Link to="/admin/dashboard/users" className={location.pathname==="/admin/dashboard/users" ? "active" : ""}>Users</Link></h6>
                        <h6><Link to="/admin/dashboard/items" className={location.pathname==="/admin/dashboard/items" ? "active" : ""}>Items</Link></h6>
                        <h6><Link to="/admin/dashboard/orders" className={location.pathname==="/admin/dashboard/orders" ? "active" : ""}>Orders</Link></h6>
                        <h6><Link to="/admin/dashboard/account" className={location.pathname==="/admin/dashboard/account" ? "active" : ""}>Account</Link></h6>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
};
