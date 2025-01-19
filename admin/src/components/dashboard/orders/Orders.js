// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Orders.css";
import { trefoil } from "ldrs";

export const Orders=()=>{
    const [orders, setOrders]=useState([]);
    const [loading, setLoading]=useState(true);
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
                if(response.ok){
                    setLoading(false);
                    setOrders(result.orders);
                };
            }
            catch(error){
                console.log("Error fetching transactions:", error);
            };
        };
        fetchOrders();
    }, []);

    return loading ? (
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
    ) : (
        <div className="orders">
            {orders.length>0 ? (
                <>
                    <h1>Orders</h1>
                    <div className="orders-tableContainer">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(transaction=>(
                                    <tr key={transaction.orderId}>
                                        <td>{transaction.username}</td>
                                        <td>{transaction.orderId}</td>
                                        <td>{transaction.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ):( 
                <div className="orders-empty">
                    <p>No orders</p>
                </div>
            )}
        </div>
    )
}