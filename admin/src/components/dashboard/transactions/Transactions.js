// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Transactions.css";
import { trefoil } from "ldrs";

export const Transactions=()=>{
    const [transactions, setTransactions]=useState([]);
    const [loading, setLoading]=useState(true);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    trefoil.register();

    useEffect(()=>{
        const fetchTransactions=async()=>{
            try{
                const response=await fetch(`${apiUrl}/admin/fetchTransactions`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setLoading(false);
                    setTransactions(result.transactions);
                };
            }
            catch(error){
                console.log("Error fetching transactions:", error);
            };
        };
        fetchTransactions();
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
        <div className="transactions">
            {transactions.length>0 ? (
                <>
                    <h1>Transactions</h1>
                    <div className="transactions-tableContainer">
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(transaction=>(
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
                <div className="transactions-empty">
                    <p>No transactions</p>
                </div>
            )}
        </div>
    )
}