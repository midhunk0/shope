/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Orders.css";
import { useNavigate } from "react-router-dom";
import { trefoil } from "ldrs";

export function Orders(){
    const [orders, setOrders]=useState({});
    const [loading, setLoading]=useState(true);
    const apiUrl=import.meta.env.VITE_APP_DEV_URL;
    const navigate=useNavigate();
    trefoil.register();

    useEffect(()=>{
        async function fetchOrders(){
            try{
                const response=await fetch(`${apiUrl}/fetchOrders`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setOrders(result);
                    setLoading(false);
                }
            }
            catch(error){
                console.log(error);
            }
        }
        fetchOrders();
    }, []);

    function gotoOrder(orderId){
        navigate(`/dashboard/order/${orderId}`);
    }

    return(
        loading ? (
            <div className="loading">
                <l-trefoil
                    size="50"
                    stroke="5"
                    stroke-length="0.15"
                    bg-opacity="0.1"
                    speed="1.4" 
                    color="var(--red)"
                ></l-trefoil>
            </div>
        ):(
            <div className="customer-orders">
                {orders.length>0 ? (
                    <div className="customer-orders-details">
                        <h1>My Orders</h1>
                        {orders.map((order, index)=>(
                            <div key={index} className="customer-orders-order-details" onClick={()=>gotoOrder(order.orderId)}>
                                <div className="customer-orders-order-items">
                                    {order.items.map((item, index)=>(
                                        <div key={index} className="customer-orders-order-item">
                                            {/* <div className="customer-orders-order-item-images">
                                                {item.imageUrls.length>0 ? (
                                                    item.imageUrls.map((imageUrl, index)=>(
                                                        <img key={index} src={imageUrl} alt="img"/>
                                                    ))
                                                ):(<></>)}
                                            </div> */}
                                            <div className="customer-orders-order-item-details">
                                                <div className="customer-orders-order-item-first">
                                                    <h3>{item.name}</h3>
                                                    <h4>${item.price}</h4>
                                                    <div className="customer-orders-order-item-ratings">
                                                        {Array.from({ length: item.rating }).map((_, index)=>(
                                                            <img key={index} src="/icons/star-filled.png" alt="img"/>
                                                        ))}
                                                        {Array.from({ length: 5-item.rating }).map((_, index)=>(
                                                            <img key={index} src="/icons/star.png" alt="img"/>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="customer-orders-order-item-second">
                                                    <p>{item.type}</p>
                                                    <p>Qty : {item.count}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="customer-orders-order-other-details">
                                    <p>{new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                    <p className={`status-${order.status}`}>{order.status}</p>
                                    <p>Total: <span>${order.total}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="customer-orders-empty">
                        <p>Nothing purchesed</p>
                    </div>
                )}
            </div>
        )
    )
}