/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./ItemPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { Item } from "../Item";
import { toast } from "react-toastify";

export function ItemPage(){
    const [item, setItem]=useState(null);
    const navigate=useNavigate();
    const { itemId }=useParams();
    const apiUrl=import.meta.env.VITE_APP_API_URL;

    async function fetchSellItem(){
        try{
            const response=await fetch(`${apiUrl}/fetchItem/${itemId}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setItem(result);
                console.log(result);
                toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchSellItem();
    }, [itemId]);

    function goBack(){
        navigate(-1);
    }
    console.log(item);
    return(
        <div className="customer-itemPage">
            <div className="customer-itemPage-buttons">
                <button type="button" onClick={goBack}>Back</button>
            </div>
            <div className="customer-itemPage-item">
                {item ? (
                    <div className="customer-itemPage-item-details">
                        <Item item={item}/>
                        {item.reviews.length!==0 && 
                            <div className="customer-itemPage-item-reviews">
                                {item.reviews.map((review, index)=>(
                                    <div key={index} className="customer-itemPage-item-review">
                                        <p>{review.username}</p>
                                        <p>{review.review}</p>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                ):(
                    <></>
                )}
            </div>
        </div>
    )
}