// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Orders.css";
import { trefoil } from "ldrs";

export const Orders=()=>{
    const [orders, setOrders]=useState([]);
    const [order, setOrder]=useState(null);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(null);
    const [expandMenu, setExpandMenu]=useState(false);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    trefoil.register();

    useEffect(()=>{
        const fetchOrders=async()=>{
            try{
                const response=await fetch(`${apiUrl}/admin/fetchOrders`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                setLoading(false);
                if(response.ok){
                    setOrders(result.orders);
                }
                else{
                    setError(result.message);
                }
            }
            catch(error){
                console.log("Error fetching transactions:", error);
            };
        };
        fetchOrders();
    }, [apiUrl]);

    const fetchOrder=async({ userId, orderId })=>{
        try{
            const response=await fetch(`${apiUrl}/admin/fetchOrder/${userId}/${orderId}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setOrder(result);
            }
        }
        catch(error){
            console.log("Error while fetchin order: ", error);
        }
    }

    const toggleExpandMenu=()=>{
        setExpandMenu(!expandMenu);
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
            <div className="orders-empty">
                <p>{error}</p>
            </div>
        )
    }

    return(
        <div className="orders">
            <h1>Orders</h1>
            <div className="orders-details">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Order ID</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order)=>(
                            <tr key={order._id} onClick={()=>fetchOrder({ userId: order.userId, orderId: order._id})}>
                                <td>{order.username}</td>
                                <td>{order._id}</td>
                                <td>{order.total}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {order ? (
                    <div className="order-details">
                        <p>{order.username}</p>
                        <div className="order-items">
                            <button onClick={toggleExpandMenu}>Items<img src={expandMenu ? "/icons/up.png" : "/icons/down.png"} alt=""/></button>
                            {expandMenu && order.items.map((item)=>(
                                <div className="order-item-details" key={item._id}>
                                    <p>{item.name}</p>
                                    <p>{item.price}</p>
                                </div>
                            ))}
                        </div>
                        <p>{order.total}</p>
                        <p>{order.status}</p>
                    </div>
                ):(
                    <div className="order-empty">
                        <p>Nothing selected</p>
                    </div>
                )}
            </div>
        </div>
    )
}