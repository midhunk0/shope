// @ts-nocheck
import React, { useState, useEffect } from "react";
import "./Item.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Item({ item, onClick }){
    const [liked, setLiked]=useState(false);
    const [cart, setCart]=useState(false);
    const [refresh, setRefresh]=useState(false);
    const navigate=useNavigate();
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    function viewItem(itemId){
        navigate("/dashboard/item", { state: { itemId }});
    }

    async function inWishlist(){
        try{
            const response=await fetch(`${apiUrl}/inWishlist/${item._id}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setLiked(result.liked);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async function inCart(){
        try{
            const response=await fetch(`${apiUrl}/inCart/${item._id}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setCart(result.cart);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        inWishlist();
        inCart();
    }, [item, refresh]);

    async function toggleWishlist(e){
        e.stopPropagation();
        try{
            const response=await fetch(`${apiUrl}/toggleWishlist/${item._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                setRefresh(!refresh);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async function addToCart(e){
        e.stopPropagation();
        try{
            const response=await fetch(`${apiUrl}/addToCart/${item._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                setRefresh(!refresh);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async function removeFromCart(e){
        e.stopPropagation();
        try{
            const response=await fetch(`${apiUrl}/removeFromCart/${item._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                setRefresh(!refresh);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    function buyItem(e){

    }

    return(
        <div className="item" onClick={onClick}>
            <div className="images">
                {item && item.imageUrls?.length>0 ? (
                    item.imageUrls.map((imageUrl, index)=>(
                        <img src={imageUrl} alt="img" key={index} onClick={()=>viewItem(item._id)}/>
                    ))
                ):(
                    <></>
                )}
            </div>
                {item && (
                    <div className="itemDetails">
                        <div className="primary">
                            <h3>{item.name}</h3>
                            <p>{item.type}</p>
                        </div>
                        <div className="secondary">
                            <h3>${item.price}</h3>
                            <div className="buttons">
                                <button type="button" onClick={(e)=>toggleWishlist(e, item._id)}>
                                    <img src={liked ? "/icons/unlike.png" : "/icons/like.png"} alt="img"/>
                                </button>
                                <button type="button" onClick={cart ? (e)=>removeFromCart(e, item._id) : (e)=>addToCart(e, item._id)}>
                                    <img src={cart ? "/icons/cart.png" : "/icons/addToCart.png"} alt="img"/>
                                </button>
                                <button className="buyButton" type="button" onClick={(e)=>buyItem(e, item._id)}>
                                    <img src="/icons/buy.png" alt="img"/>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}