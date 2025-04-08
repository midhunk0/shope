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
    const [deliveryAgents, setDeliveryAgents]=useState([]);
    const [showMenu, setShowMenu]=useState(false);
    const apiUrl=import.meta.env.VITE_APP_API_URL;

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

    const fetchOrder=async({ orderId })=>{
        const order=orders.find(order=>order._id===orderId);
        setOrder(order);
    }

    useEffect(()=>{     
        const fetchDeliveryAgents=async()=>{
            try{    
                const response=await fetch(`${apiUrl}/admin/fetchDeliveryAgents`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setDeliveryAgents(result.deliveryAgents);
                }
            }
            catch(error){
                console.log("Error while fetching delivery agents: ", error);
            }
        }
        fetchDeliveryAgents();
    }, [apiUrl]);


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
            <div className="admin-orders-empty">
                <p>{error}</p>
            </div>
        )
    }

    const handleAssignDeliveryAgent=async({ customerId, orderId, deliveryAgentId })=>{
        try{
            const response=await fetch(`${apiUrl}/admin/assignDeliveryAgent/${customerId}/${orderId}/${deliveryAgentId}`, {
                method: "POST",
                credentials: "include",
                headers:{ "Content-Type": "application/json" },
            });
            const result=await response.json();
            if(response.ok){
                setOrder(prev=>{
                    return {
                        ...prev,
                        deliveryAgentId: result.deliveryAgentId
                    }
                });
                setOrders(prev=>{
                    return prev.map(order=>{
                        if(order._id===orderId){
                            return {
                                ...order,
                                deliveryAgentId: result.deliveryAgentId
                            }
                        }
                        return order;
                    })
                });
            }
        }
        catch(error){
            console.log("Error while assigning delivery agent: ", error);
        }
    }

    const fetchDeliveryAgent=({ deliveryAgentId })=>{
        const deliveryAgent=deliveryAgents.find(deliveryAgent=>deliveryAgent._id===deliveryAgentId);
        if(deliveryAgent){
            return deliveryAgent.username;
        }
        return "Select delivery agent";
    }

    return(
        <div className="admin-orders">
            <h1>Orders</h1>
            <div className="admin-orders-details">
                <table className="admin-orders-table">
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
                            <tr key={order._id} onClick={()=>fetchOrder({ orderId: order._id})}>
                                <td>{order.username}</td>
                                <td>{order._id}</td>
                                <td>{order.total}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {order ? (
                    <div className="admin-order-details">
                        <p>{order.username}</p>
                        <div className="admin-order-items">
                            <button onClick={toggleExpandMenu}>Items<img src={expandMenu ? "/icons/up.png" : "/icons/down.png"} alt=""/></button>
                            {expandMenu && order.items.map((item)=>(
                                <div className="admin-order-item-details" key={item._id}>
                                    <p>{item.name}</p>
                                    <p>{item.price}</p>
                                </div>
                            ))}
                        </div>
                        <p>{order.total}</p>
                        <div className="admin-order-status">
                            <button onClick={()=>setShowMenu(prev=>!prev)}>
                                {order.deliveryAgentId ? fetchDeliveryAgent({ deliveryAgentId: order.deliveryAgentId }) : "Select delivery agent"}
                                {!order.deliveryAgentId && <img src={showMenu ? "/icons/up.png" : "/icons/down.png"} alt=""/>}
                            </button>
                            {showMenu && !order.deliveryAgentId && (
                                <div className="admin-order-status-menu">
                                    {deliveryAgents.map((deliveryAgent)=>(
                                        <p key={deliveryAgent._id} onClick={()=>{handleAssignDeliveryAgent({ customerId: order.customerId, orderId: order._id, deliveryAgentId: deliveryAgent._id}), setShowMenu(false)}}>{deliveryAgent.username}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ):(
                    <div className="admin-order-empty">
                        <p>Nothing selected</p>
                    </div>
                )}
            </div>
        </div>
    )
}