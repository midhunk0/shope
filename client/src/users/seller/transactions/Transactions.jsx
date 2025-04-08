// @ts-nocheck
import React, { useState, useEffect } from "react";
import "./Transactions.css";
import { trefoil } from "ldrs";

export function Transactions(){
    const [transactions, setTransactions]=useState({});
    const [loading, setLoading]=useState(true);
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    trefoil.register();

    useEffect(()=>{
        async function fetchTransactions(){
            try{
                const response=await fetch(`${apiUrl}/fetchTransactions`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setLoading(false);
                    setTransactions(result);
                }
            }
            catch(error){
                console.log(error);
            }
        }
        fetchTransactions();
    }, [apiUrl])

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
        ) : (
            <div className="seller-transactions">
                {transactions.length>0 ? (
                    <>
                    <h1>Transactions</h1>
                    <div className="seller-tableContainer">
                        <table className="seller-transactionDetails">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Item</th>
                                    <th>Count</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index)=>(
                                    <tr key={index}>
                                        <td>{new Date(transaction.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                        <td>{transaction.user}</td>
                                        <td>{transaction.item}</td>
                                        <td>{transaction.count}</td>
                                        <td>{transaction.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </>
                ):(
                    <div className="seller-transactions-empty">
                        <p>No transaction completed</p>
                    </div>
                )}
            </div>
        )
    )
}