import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Topbar.css";

export function Topbar() {
    const [closed, setClosed] = useState(true);
    const location = useLocation();

    const topbarItems = [
        { path: "/customer/items", label: "Items" },
        { path: "/customer/wishlist", label: "Wishlist" },
        { path: "/customer/cart", label: "Cart" },
        { path: "/customer/orders", label: "Orders" },
        { path: "/customer/account", label: "Account" },
    ];

    function toggleDropdown() {
        setClosed(!closed);
    }

    return (
        <div className="topbar">
            <h4><Link to="/customer/home" className={location.pathname === "/customer/home" ? "active" : ""}>Shope.</Link></h4>
            <div className="topbar-options">
                {topbarItems.map((item) => (
                    <h6 key={item.path}>
                        <Link
                            to={item.path}
                            className={location.pathname === item.path ? "active" : ""}
                        >
                            {item.label}
                        </Link>
                    </h6>
                ))}
            </div>
            <div className="topbar-dropdown" onClick={toggleDropdown}>
                <img src={closed ? "/icons/menu.png" : "/icons/close.png"} alt="menu icon"/>
                {!closed && (
                    <div className="topbar-dropdown-options">
                        {topbarItems.map((item) => (
                            <h6 key={item.path}>
                                <Link
                                    to={item.path}
                                    className={location.pathname === item.path ? "active" : ""}
                                >
                                    {item.label}
                                </Link>
                            </h6>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
