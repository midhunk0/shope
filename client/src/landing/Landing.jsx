import React, { useMemo } from "react";
import "./Landing.css";

export default function Landing(){
    const images=useMemo(()=>[
        "/images/pocket-camera.jpg",
        "/images/dji.jpg",
        "/images/i-phone.jpg",
        "/images/logi-mouse.jpg",
        "/images/bose.jpg",
        "/images/apple-watch.jpg",
    ], []);

    return(
        <div className="landing">
            <div className="landing-links">
                <div className="landing-customer">
                    <img src="/images/customer.png" alt="customer"/>
                    <h3>customer</h3>
                    <p>Browse items, place and track orders</p>
                    <a href="/">login now</a>
                </div>
                <div className="landing-seller">
                    <img src="/images/seller.png" alt="seller"/>
                    <h3>seller</h3>
                    <p>Manage store, view sales, add products</p>
                    <a href="/">login now</a>
                </div>
                <div className="landing-delivery">
                    <img src="/images/delivery.png" alt="delivery"/>
                    <h3>delivery agent</h3>
                    <p>View orders, update status, manage trips</p>
                    <a href="/">login now</a>
                </div>
            </div>
            <div className="landing-images">
                {images.map((image, index)=>(
                    <img key={index} src={image} alt="img"/>
                ))}
                <div className="landing-logo">
                    <h3>Shope.</h3>
                    <hr/>
                </div>
            </div>
        </div>
    )
}