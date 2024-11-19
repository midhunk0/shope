// @ts-nocheck
import React, { useState, useEffect } from "react";
import "./Transactions.css";

export function Transactions(){
    const [transactions, setTransactions]=useState({});
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    useEffect(()=>{
        async function fetchTransactions(){
            try{
                const response=await fetch(`${apiUrl}/fetchTransactions`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
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
        <div className="transactions">
            <h1>Transactions</h1>
            {transactions.length>0 ? (
                <table className="transactionDetails">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Item</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index)=>(
                            <tr key={index}>
                                <td>{transaction.user}</td>
                                <td>{transaction.item}</td>
                                <td>{transaction.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ):(
                <p>No transaction completed</p>
            )}
        </div>
    )
}