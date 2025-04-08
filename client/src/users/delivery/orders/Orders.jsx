// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import { trefoil } from "ldrs";
import "./Orders.css";
import React, { useEffect, useState } from "react";

export function Orders(){
    const [orders, setOrders]=useState({});
    const [loading, setLoading]=useState(true);
    const apiUrl=import.meta.env.VITE_APP_DEV_URL;
    trefoil.register();

    useEffect(()=>{
        async function fetchDeliveryOrders(){
            try{
                const response=await fetch(`${apiUrl}/fetchDeliveryOrders`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setOrders(result.deliveryOrders);
                    console.log(result);
                    setLoading(false);
                }
            }
            catch(error){
                console.log(error);
            }
        }
        fetchDeliveryOrders();
    }, []);

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
            <div className="delivery-orders">
                {orders.length>0 ? (
                    <div className="delivery-orders-details">
                        <h1>My Orders</h1>
                        {orders.map((order, index)=>(
                            <div key={index} className="delivery-order-details">
                                <p>{order._id}</p>
                                <p>{order.status}</p>
                                <p>{order.username}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="delivery-orders-empty">
                        <p>No Orders Found</p>
                    </div>
                )}
            </div>
        )
    )
}