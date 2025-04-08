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
            <h4><Link to="/seller/dashboard" className={location.pathname==="/seller/dashboard" ? "active" : ""}>Shope.</Link></h4>
            <div className="topbarOptions">
                <h6><Link to="/seller/dashboard" className={location.pathname==="/seller/dashboard/items" || location.pathname==="/dashboard/item" || location.pathname.startsWith("/seller/dashboard/update") ? "active" : ""}>All Items</Link></h6>
                <h6><Link to="/seller/dashboard/add" className={location.pathname==="/seller/dashboard/add" ? "active" : ""}>Add New</Link></h6>
                <h6><Link to="/seller/dashboard/transactions" className={location.pathname==="/seller/dashboard/transactions" ? "active" : ""}>Transactions</Link></h6>
                <h6><Link to="/seller/dashboard/account" className={location.pathname==="/seller/dashboard/account" ? "active" : ""}>Account</Link></h6>
            </div>
            <div className="topbarDropdown" onClick={toggleDropdown}>
                <img src={closed ? "/icons/menu.png" : "/icons/close.png"} alt="img" onClick={toggleDropdown}/>
                {!closed ? (
                    <div className="dropdownOptions">
                        <h6><Link to="/seller/dashboard" className={location.pathname==="/seller/dashboard/items" || location.pathname==="/dashboard/item" || location.pathname.startsWith("/seller/dashboard/update") ? "active" : ""}>All Items</Link></h6>
                        <h6><Link to="/seller/dashboard/add" className={location.pathname==="/seller/dashboard/add" ? "active" : ""}>Add New</Link></h6>
                        <h6><Link to="/seller/dashboard/transactions" className={location.pathname==="/seller/dashboard/transactions" ? "active" : ""}>Transactions</Link></h6>
                        <h6><Link to="/seller/dashboard/account" className={location.pathname==="/seller/dashboard/account" ? "active" : ""}>Account</Link></h6>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
};
