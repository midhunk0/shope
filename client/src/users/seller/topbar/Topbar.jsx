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
            <h4><Link to="/seller/home" className={location.pathname==="/seller/home" ? "active" : ""}>Shope.</Link></h4>
            <div className="topbarOptions">
                <h6><Link to="/seller/items" className={location.pathname==="/seller/items" || location.pathname==="/seller/item" || location.pathname.startsWith("/seller/update") ? "active" : ""}>All Items</Link></h6>
                <h6><Link to="/seller/add" className={location.pathname==="/seller/add" ? "active" : ""}>Add New</Link></h6>
                <h6><Link to="/seller/transactions" className={location.pathname==="/seller/transactions" ? "active" : ""}>Transactions</Link></h6>
                <h6><Link to="/seller/account" className={location.pathname==="/seller/account" ? "active" : ""}>Account</Link></h6>
            </div>
            <div className="topbarDropdown" onClick={toggleDropdown}>
                <img src={closed ? "/icons/menu.png" : "/icons/close.png"} alt="img" onClick={toggleDropdown}/>
                {!closed ? (
                    <div className="dropdownOptions">
                        <h6><Link to="/seller/items" className={location.pathname==="/seller/items" || location.pathname==="/seller/item" || location.pathname.startsWith("/seller/update") ? "active" : ""}>All Items</Link></h6>
                        <h6><Link to="/seller/add" className={location.pathname==="/seller/add" ? "active" : ""}>Add New</Link></h6>
                        <h6><Link to="/seller/transactions" className={location.pathname==="/seller/transactions" ? "active" : ""}>Transactions</Link></h6>
                        <h6><Link to="/seller/account" className={location.pathname==="/seller/account" ? "active" : ""}>Account</Link></h6>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
};
