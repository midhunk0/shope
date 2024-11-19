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
    const apiUrl=process.env.REACT_APP_BACKEND_URL;
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
            const filteredResult = result.cartItems.filter(item => item !== null);
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
                navigate("/dashboard/account");
            }
        }
        catch(error){
            console.log(error);
        }
    }
    
    function handleItemRemoved(){
        fetchCartItems();
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
                <div className="cartPage">
                    <div className="cartItems">
                        {cartItems.map((item, index)=>(
                            item ? (
                                <div key={index} className="cartItemDetails">
                                    <Item item={item} onItemsChanged={handleItemRemoved}/>
                                    <div className="counter">
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
                    <div className="cartSubmit">
                        <form>
                            <h2>Shipping Details</h2>
                            <input type="text" required placeholder="Name" value={details.name} onChange={(e)=>setDetails({...details, name: e.target.value})}/>
                            <input type="text" required placeholder="Phone" value={details.phone} onChange={(e)=>setDetails({...details, phone: e.target.value})}/>
                            <input type="email" required placeholder="Email" value={details.email} onChange={(e)=>setDetails({...details, email: e.target.value})}/>
                            <input type="text" required placeholder="Address" value={details.address} onChange={(e)=>setDetails({...details, address: e.target.value})}/>
                            <div className="summary">
                                <p>Summary</p>
                                <hr/>
                                <div className="cost">
                                    <p>Total cost</p>
                                    <p>{cost}</p>
                                </div>
                            </div>
                            <button type="button" onClick={submitCart}>SEND</button>
                        </form>
                    </div>
                </div>
            ):(
                <div className="emptyCart">
                    <p>Cart is empty</p>
                </div>
            )
        )
    )
}