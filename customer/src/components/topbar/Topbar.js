import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Topbar.css";

export function Topbar(){
    const [closed, setClosed]=useState(true);

    function toggleDropdown(){
        setClosed(!closed);
    }

    function logoutUser(){

    }

    return(
        <div className="topbar">
            <h4><Link to="/dashboard">Shope.</Link></h4>
            <div className="topbarOptions">
                <h6><Link to="/dashboard/items">Items</Link></h6>
                <h6><Link to="/dashboard/wishlist">Wishlist</Link></h6>
                <h6><Link to="/dashboard/cart">Cart</Link></h6>
                <h6><Link to="/dashboard/profile">Profile</Link></h6>
            </div>
            <div className="topbarDropdown" onClick={toggleDropdown}>
                <img src={closed ? "/icons/menu.png" : "/icons/close.png"} alt="img" onClick={toggleDropdown}/>
                {!closed ? (
                    <div className="dropdownOptions">
                        <h6><Link to="/dashboard/items">Items</Link></h6>
                        <h6><Link to="/dashboard/wishlist">Wishlist</Link></h6>
                        <h6><Link to="/dashboard/cart">Cart</Link></h6>
                        <h6><Link to="/dashboard/profile">Profile</Link></h6>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
};
