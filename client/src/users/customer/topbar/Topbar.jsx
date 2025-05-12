import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Topbar.css";

export function Topbar() {
    const [closed, setClosed] = useState(true);
    const location = useLocation();

    function toggleDropdown() {
        setClosed(!closed);
    }

    return (
        <div className="topbar">
            <h4><Link to="/customer/home" className={location.pathname === "/customer/home" ? "active" : ""}>Shope.</Link></h4>
            <div className="topbar-options">                
                <h6><Link to="/customer/items" className={location.pathname==="/customer/items" || location.pathname==="/customer/item" ? "active" : ""}>Items</Link></h6>
                <h6><Link to="/customer/wishlist" className={location.pathname==="/customer/wishlist" ? "active" : ""}>Wishlist</Link></h6>
                <h6><Link to="/customer/cart" className={location.pathname==="/customer/cart" ? "active" : ""}>Cart</Link></h6>
                <h6><Link to="/customer/orders" className={location.pathname==="/customer/orders" || location.pathname==="/customer/order" ? "active" : ""}>Orders</Link></h6>
                <h6><Link to="/customer/account" className={location.pathname==="/customer/account" ? "active" : ""}>Account</Link></h6>
            </div>
            <div className="topbar-dropdown" onClick={toggleDropdown}>
                <img src={closed ? "/icons/menu.png" : "/icons/close.png"} alt="menu icon"/>
                {!closed && (
                    <div className="topbar-dropdown-options">                
                        <h6><Link to="/customer/items" className={location.pathname==="/customer/items" || location.pathname==="/customer/item" ? "active" : ""}>Items</Link></h6>
                        <h6><Link to="/customer/wishlist" className={location.pathname==="/customer/wishlist" ? "active" : ""}>Wishlist</Link></h6>
                        <h6><Link to="/customer/cart" className={location.pathname==="/customer/cart" ? "active" : ""}>Cart</Link></h6>
                        <h6><Link to="/customer/orders" className={location.pathname==="/customer/orders" || location.pathname.includes("/customer/order") ? "active" : ""}>Orders</Link></h6>
                        <h6><Link to="/customer/account" className={location.pathname==="/customer/account" ? "active" : ""}>Account</Link></h6>
                    </div>
                )}
            </div>
        </div>
    );
}
