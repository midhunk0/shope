// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import { trefoil } from "ldrs";
import "./Orders.css";
import React, { useEffect, useState } from "react";

export function Orders(){
    const [orders, setOrders]=useState({});
    const [order, setOrder]=useState();
    const [menu, setMenu]=useState(false);
    const [showMenu, setShowMenu]=useState(false);
    const [loading, setLoading]=useState(true);
    const apiUrl=import.meta.env.VITE_APP_API_URL;
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
        }
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
            <div className="delivery-orders">
                {orders && orders.length>0 ? (
                    <div className="delivery-orders-details">
                        <h1>My Orders</h1>
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
                        </table>
                        {order && (
                            <div className="delivery-order-details">
                                {console.log(order)}
                                <p>{order.username}</p>
                                <div className="delivery-order-items">
                                    <button onClick={()=>setMenu(prev=>!prev)}>Items<img src={menu ? "/icons/up.png" : "/icons/down.png"} alt=""/></button>
                                    {menu && order.items.map((item, index)=>(
                                        <div key={index} className="delivery-order-item-details">
                                            <p>{item.name}</p>
                                            <p>{item.price}</p>
                                        </div>
                                    ))}
                                </div>
                                <p>{order.shippingAddress.phone}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.total}</p>
                                <div className="delivery-order-status">
                                    <button onClick={()=>setShowMenu(prev=>!prev)}>
                                        {order.status}
                                        <img src={showMenu ? "/icons/up.png" : "/icons/down.png"}/>
                                    </button>
                                    {showMenu && (
                                        <div className="delivery-order-status-menu">
                                            <button onClick={()=>setShowMenu(false)}>Delivered</button>
                                            <button onClick={()=>setShowMenu(false)}>Cancelled</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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