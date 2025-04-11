// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import { trefoil } from "ldrs";
import "./Orders.css";
import React, { useEffect, useState } from "react";

export function Orders(){
    const [orders, setOrders]=useState({});
    const [order, setOrder]=useState();
    const [showMenu, setShowMenu]=useState(false);
    const [loading, setLoading]=useState(true);
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const [width, setWidth]=useState(window.innerWidth);
    const [showDetails, setShowDetails]=useState(false);
    
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    trefoil.register();

    useEffect(()=>{
        const fetchDeliveryOrders=async()=>{
            try{
                const response=await fetch(`${apiUrl}/fetchDeliveryOrders`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setOrders(result.deliveryOrders);
                    setLoading(false);
                }
            }
            catch(error){
                console.log(error);
            }
        }
        fetchDeliveryOrders();
    }, []);

    const fetchDeliveryOrder=(orderId)=>{
        if(orders.length>0){
            const order=orders.find((order)=>order._id===orderId);
            setOrder(order);
            if(width<992) setShowDetails(true);
        }
    }

    if(loading){
        return(
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
        )
    }

    if(orders.length===0){
        return(
            <div className="delivery-orders-empty">
                <p>No Orders Found</p>
            </div>
        )
    }

    return(
        <div className="delivery-orders">
            <h1>My Orders</h1>
            <div className="delivery-orders-details">
                {(width>=992 || !showDetails) && (
                <table className="delivery-orders-table">   
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index)=>(
                            <tr key={index} onClick={()=>fetchDeliveryOrder(order._id)}>
                                <td>{order.username}</td>
                                <td>{order.shippingAddress.phone}</td>
                                <td>{order.shippingAddress.address}</td>
                                <td>{order.total}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>)}
                {(width>=992 || showDetails) && (
                    order ? (
                        <div className="delivery-order-details">
                            {width<992 && (
                                <button className="delivery-order-back" onClick={() => setShowDetails(false)}>Back</button>
                            )}
                            <p>{order.username}</p>
                            <p>{order.shippingAddress.phone}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.total}</p>
                            <div className="delivery-order-status">
                                <button className="delivery-order-details-button" onClick={()=>setShowMenu(prev=>!prev)}>
                                    {order.status}
                                    <img src={showMenu ? "/icons/up.png" : "/icons/down.png"}/>
                                </button>
                                {showMenu && (
                                    <div className="delivery-order-status-menu">
                                        <p onClick={()=>setShowMenu(false)}>Delivered</p>
                                        <p onClick={()=>setShowMenu(false)}>Cancelled</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ):(
                        <div className="delivery-order-empty">
                            <p>Nothing selected</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}