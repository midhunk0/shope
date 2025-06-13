// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Orders.css";
import { trefoil } from "ldrs";

export const Orders=()=>{
    const [orders, setOrders]=useState([]);
    const [order, setOrder]=useState(null);
    const [loading, setLoading]=useState(true);
    const [expandMenu, setExpandMenu]=useState(false);
    const [deliveryAgents, setDeliveryAgents]=useState([]);
    const [showMenu, setShowMenu]=useState(false);
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const [width, setWidth]=useState(window.innerWidth);
    const [showDetails, setShowDetails]=useState(false);
    
    useEffect(()=>{
        const handleResize=()=>setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    }, []);

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
            }
            catch(error){
                console.log("Error fetching transactions:", error);
            };
        };
        fetchOrders();
    }, [apiUrl]);

    const fetchOrder=async({ customerId, orderId })=>{
        try{
            const response=await fetch(`${apiUrl}/admin/fetchOrder/${customerId}/${orderId}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            setLoading(false);
            if(response.ok){
                setOrder(result)
                if(width<1080){
                    setShowDetails(true);
                }
            }
        }
        catch(error){
            console.log("Error fetching transactions:", error);
        };
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
                        deliveryAgentId: deliveryAgentId
                    }
                });
                setOrders(prev=>{
                    return prev.map(order=>{
                        if(order._id===orderId){
                            return {
                                ...order,
                                status: result.status,
                                deliveryAgentId: deliveryAgentId
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

    if(orders.length===0){
        return(
            <div className="admin-orders-empty">
                <p>No orders</p>
            </div>
        )
    }

    return(
        <div className="admin-orders">
            <h1>Orders</h1>
            <div className="admin-orders-details">
                {(width>=1080 || !showDetails) && (
                    <table className="admin-orders-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order)=>(
                                <tr key={order._id} onClick={()=>fetchOrder({ customerId: order.customerId, orderId: order._id})}>
                                    <td>{order.username}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString("en-IN", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </td>
                                    <td>{order.total}</td>
                                    <td>{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {(width>=1080 || showDetails) && (
                    order ? (
                        <div className="admin-order-details">
                            {width<1080 && (
                                <button className="admin-order-back" onClick={() => setShowDetails(false)}>Back</button>
                            )}
                            <p>{order.username}</p>
                            <div className="admin-order-items">
                                <button className="admin-order-details-button" onClick={toggleExpandMenu}>Items<img src={expandMenu ? "/icons/up.png" : "/icons/down.png"} alt=""/></button>
                                {expandMenu && order.items.map((item)=>(
                                    <div className="admin-order-item-details" key={item._id}>
                                        <p>{item.name}</p>
                                        <p>{item.price}</p>
                                    </div>
                                ))}
                            </div>
                            <p>{order.total}</p>
                            <div className="admin-order-status">
                                <button className="admin-order-details-button" onClick={()=>setShowMenu(prev=>!prev)}>
                                    {order.deliveryAgentId ? fetchDeliveryAgent({ deliveryAgentId: order.deliveryAgentId }) : "Select delivery agent"}
                                    {!order.deliveryAgentId && <img src={showMenu ? "/icons/up.png" : "/icons/down.png"} alt=""/>}
                                </button>
                                {showMenu && !order.deliveryAgentId && (
                                    <div className="admin-order-status-menu">
                                        {deliveryAgents.map((deliveryAgent)=>(
                                            <p key={deliveryAgent._id} onClick={()=>{handleAssignDeliveryAgent({ customerId: order.customerId, orderId: order.orderId, deliveryAgentId: deliveryAgent._id}), setShowMenu(false)}}>{deliveryAgent.username}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ):(
                        <div className="admin-order-empty">
                            <p>Nothing selected</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}