import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Topbar.css";

export function Topbar(){
    const [closed, setClosed]=useState(true);
    const location=useLocation();

    function toggleDropdown(){
        setClosed(!closed);
    }

    function logoutUser(){

    }

    return(
        <div className="topbar">
            <h4><Link to="/dashboard" className={location.pathname==="/dashboard" ? "active" : ""}>Shope.</Link></h4>
            <div className="topbarOptions">
                <h6><Link to="/dashboard" className={location.pathname==="/dashboard" ? "active" : ""}>Home</Link></h6>
                <h6><Link to="/dashboard/users" className={location.pathname==="/dashboard/users" ? "active" : ""}>Users</Link></h6>
                <h6><Link to="/dashboard/transactions" className={location.pathname==="/dashboard/transactions" ? "active" : ""}>Transactions</Link></h6>
                <h6><Link to="/dashboard/account" className={location.pathname==="/dashboard/account" ? "active" : ""}>Account</Link></h6>
            </div>
            <div className="topbarDropdown" onClick={toggleDropdown}>
                <img src={closed ? "/icons/menu.png" : "/icons/close.png"} alt="img" onClick={toggleDropdown}/>
                {!closed ? (
                    <div className="dropdownOptions">
                        <h6><Link to="/dashboard" className={location.pathname==="/dashboard" ? "active" : ""}>Home</Link></h6>
                        <h6><Link to="/dashboard/users" className={location.pathname==="/dashboard/users" ? "active" : ""}>Users</Link></h6>
                        <h6><Link to="/dashboard/transactions" className={location.pathname==="/dashboard/transactions" ? "active" : ""}>Transactions</Link></h6>
                        <h6><Link to="/dashboard/account" className={location.pathname==="/dashboard/account" ? "active" : ""}>Account</Link></h6>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
};
