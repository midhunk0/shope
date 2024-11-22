// @ts-nocheck
import React, { useState, useEffect } from "react";
import "./Transactions.css";
import { trefoil } from "ldrs";

export function Transactions(){
    const [transactions, setTransactions]=useState({});
    const [loading, setLoading]=useState(true);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;
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
    }, [])

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
            <div className="transactions">
                {transactions.length>0 ? (
                    <>
                    <h1>Transactions</h1>
                    <div className="tableContainer">
                        <table className="transactionDetails">
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
                    <div className="transactions-empty">
                        <p>No transaction completed</p>
                    </div>
                )}
            </div>
        )
    )
}