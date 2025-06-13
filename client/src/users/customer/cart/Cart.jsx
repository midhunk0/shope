/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import "./Cart.css";
import { Item } from "../items/Item";
import { trefoil } from 'ldrs'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Cart(){
    trefoil.register()
    const [loading, setLoading]=useState(true);
    const [cartItems, setCartItems]=useState([]);
    const [details, setDetails]=useState({
        name: "",
        phone: "",
        email: "",
        address: "",
    })
    const [cost, setCost]=useState(0);
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const navigate=useNavigate();

    useEffect(()=>{
        async function fetchProfile(){
            try{
                const response=await fetch(`${apiUrl}/getProfile`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setDetails({
                        name: result.user.name || "", 
                        email: result.user.email || "",
                        phone: result.user.phone || "",
                        address: result.user.address || ""
                    })
                }
            }
            catch(error){
                console.log(error);
            }
        }
        fetchProfile();
    }, [apiUrl]);

    async function fetchCartItems(){
        try{
            const response=await fetch(`${apiUrl}/fetchCart`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            const filteredResult=result.cartItems.filter(item=>item!==null && item.pieceLeft>0);
            if(response.ok){
                setCost(result.cost);
                setLoading(false);
                setCartItems(filteredResult);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchCartItems();
    }, []);

    async function changeCount(itemId, op){
        try{
            const response=await fetch(`${apiUrl}/changeCount`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ itemId, op })
            });
            const result=await response.json();
            if(response.ok){
                setCartItems(prevItems=>
                    prevItems.map(item=>
                        item.itemId===itemId ? { ...item, count: result.item.count } : item
                    )
                )
                fetchCartItems();
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async function submitCart(){
        try{
            const response=await fetch(`${apiUrl}/makeOrder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(details)
            })
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                navigate("/customer/orders");
            }
        }
        catch(error){
            console.log(error);
        }
    }
    
    function handleItemRemoved(){
        fetchCartItems();
    }
    
    function handleChangeInput(e){
        setDetails({ ...details, [e.target.name]: e.target.value });
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
        ) : (
            cartItems.length>0 ? (
                <div className="customer-cart">
                    <div className="customer-cart-items">
                        {cartItems.map((item, index)=>(
                            item ? (
                                <div key={index} className="customer-cart-item-details">
                                    <Item item={item} onItemsChanged={handleItemRemoved}/>
                                    <div className="customer-cart-item-counter">
                                        <button onClick={()=>changeCount(item._id, '-')}><img src="/icons/minus.png" alt="img"/></button>
                                        <p>{item.count}</p>
                                        <button onClick={()=>changeCount(item._id, '+')}><img src="/icons/add.png" alt="img"/></button>
                                    </div>
                                </div>
                            ):(
                                null
                            )
                        ))}
                    </div>
                    <div className="customer-cart-submit">
                        <form>
                            <h2>Shipping Details</h2>
                            <input type="text" required placeholder="Name" value={details.name} name="name" onChange={handleChangeInput}/>
                            <input type="text" required placeholder="Phone" value={details.phone} name="phone" onChange={handleChangeInput}/>
                            <input type="email" required placeholder="Email" value={details.email} name="email" onChange={handleChangeInput}/>
                            <input type="text" required placeholder="Address" value={details.address} name="address" onChange={handleChangeInput}/>
                            <div className="customer-cart-summary">
                                <p>Summary</p>
                                <hr/>
                                <div className="customer-cart-cost">
                                    <p>Total cost</p>
                                    <p>{cost}</p>
                                </div>
                            </div>
                            <button type="button" onClick={submitCart}>SEND</button>
                        </form>
                    </div>
                </div>
            ):(
                <div className="customer-cart-empty">
                    <p>Nothing in the cart</p>
                </div>
            )
        )
    )
}