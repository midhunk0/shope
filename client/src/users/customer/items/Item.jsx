/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import "./Item.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Item({ item, onClick, onItemsChanged }){
    const [liked, setLiked]=useState(false);
    const [cart, setCart]=useState(false);
    const [refresh, setRefresh]=useState(false);
    const navigate=useNavigate();
    const apiUrl=import.meta.env.VITE_APP_API_URL;

    function viewItem(itemId){
        navigate(`/dashboard/item/${itemId}`);
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
                onItemsChanged()
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
                onItemsChanged();
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async function buyItem(e){
        e.stopPropagation();
        await addToCart(e);
        navigate("/dashboard/cart");
    }

    return(
        <div className="customer-item" onClick={onClick}>
            <div className="customer-item-images">
                {item && item.imageUrls?.length>0 ? 
                    item.imageUrls.map((imageUrl, index)=>(
                        <img src={imageUrl} alt="img" key={index} onClick={()=>viewItem(item._id)}/>
                    ))
                :
                    <></>
                }
            </div>
                {item && (
                    <div className="customer-item-details">
                        <div className="customer-item-details-primary">
                            <h3>{item.name}</h3>
                            <p>{item.type}</p>
                        </div>
                        <div className="customer-item-details-secondary">
                            <h3>${item.price}</h3>
                            <div className="customer-item-details-buttons">
                                <button type="button" onClick={(e)=>toggleWishlist(e)}>
                                    <img src={liked ? "/icons/unlike.png" : "/icons/like.png"} alt="img"/>
                                </button>
                                <button type="button" onClick={cart ? (e)=>removeFromCart(e) : (e)=>addToCart(e, item._id)}>
                                    <img src={cart ? "/icons/cart.png" : "/icons/addToCart.png"} alt="img"/>
                                </button>
                                <button className="buyButton" type="button" onClick={(e)=>buyItem(e)}>
                                    <img src="/icons/buy.png" alt="img"/>
                                </button>
                            </div>
                        </div>
                        <div className="customer-item-details-tertiary">
                            {Array.from({ length: item.rating }).map((_, index)=>(
                                <img key={index} src="/icons/star-filled.png" alt="img"/>
                            ))}
                            {Array.from({ length: 5-item.rating }).map((_, index)=>(
                                <img key={index} src="/icons/star.png" alt="img"/>
                            ))}
                        </div>
                    </div>
                )}
        </div>
    )
}