// @ts-nocheck
import React, { useState, useEffect } from "react";
import "./Cart.css";
import { Item } from "../items/Item";

export function Cart(){
    const [cartItems, setCartItems]=useState([]);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    async function fetchCartItems(){
        try{
            const response=await fetch(`${apiUrl}/fetchCart`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setCartItems(result);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchCartItems();
    }, [cartItems]);

    return(
        <div className="cartPage">
            <div className="cartItems">
                {cartItems.length>0 ? (
                    cartItems.map((item, index)=>(
                        item ? (
                            <Item item={item} key={index}/>
                        ):(
                            null
                        )
                    ))
                ):(
                    <p>No items</p>
                )}
            </div>
        </div>
    )
}