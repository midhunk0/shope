// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Orders.css";
import { useNavigate } from "react-router-dom";
import { trefoil } from "ldrs";

export function Orders(){
    const [orders, setOrders]=useState({});
    const [loading, setLoading]=useState(true);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;
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
            <div className="orders">
                <h1>My Orders</h1>
                {orders.length>0 ? (
                    <div className="orders-details">
                        {orders.map((order, index)=>(
                            <div key={index} className="orders-order-details" onClick={()=>gotoOrder(order.orderId)}>
                                <div className="orders-order-items">
                                    {order.items.map((item, index)=>(
                                        <div key={index} className="orders-order-item">
                                            <div className="orders-order-item-images">
                                                {item.imageUrls.length>0 ? (
                                                    item.imageUrls.map((imageUrl, index)=>(
                                                        <img key={index} src={imageUrl} alt="img"/>
                                                    ))
                                                ):(<></>)}
                                            </div>
                                            <div className="orders-order-item-details">
                                                <div className="orders-order-item-first">
                                                    <h3>{item.name}</h3>
                                                    <h4>${item.price}</h4>
                                                    <div className="orders-order-item-ratings">
                                                        {Array.from({ length: item.rating }).map((_, index)=>(
                                                            <img key={index} src="/icons/star-filled.png" alt="img"/>
                                                        ))}
                                                        {Array.from({ length: 5-item.rating }).map((_, index)=>(
                                                            <img key={index} src="/icons/star.png" alt="img"/>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="orders-order-item-second">
                                                    <p>{item.type}</p>
                                                    <p>Qty : {item.count}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="orders-order-other-details">
                                    <p>{new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                    <p className={`status-${order.status}`}>{order.status}</p>
                                    <p>Total: <span>${order.total}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nothing purchesed</p>
                )}
            </div>
        )
    )
}