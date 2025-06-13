import React from "react";
import "./Landing.css";

export default function Landing(){
    return(
        <div className="landing">
            <div className="landing-page">
                <h1>Shope.</h1>
                <p>The all-in-one platform for shopping, selling, and managing your marketplace.</p>
            </div>
            <div className="landing-links">
                <div className="landing-customer">
                    <img src="/icons/customer.png" alt="customer"/>
                    <h3>customer</h3>
                    <p>Browse items, place and track orders</p>
                    <a href="/customer">login</a>
                </div>
                <div className="landing-seller">
                    <img src="/icons/seller.png" alt="seller"/>
                    <h3>seller</h3>
                    <p>Manage store, view sales, add products</p>
                    <a href="/seller">login</a>
                </div>
                <div className="landing-delivery">
                    <img src="/icons/delivery.png" alt="delivery"/>
                    <h3>delivery agent</h3>
                    <p>View orders, update status, manage trips</p>
                    <a href="/deliveryAgent">login</a>
                </div>
            </div>
        </div>
    )
}