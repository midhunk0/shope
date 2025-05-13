/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import { trefoil } from "ldrs";
import React, { useEffect, useState } from "react";
import "./Review.css";
import { useParams } from "react-router-dom";
import { Item } from "../Item";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function Review(){
    const [item, setItem]=useState();
    const [content, setContent]=useState({
        rating: 0,
        review: ""
    });
    const navigate=useNavigate();
    const [loading, setLoading]=useState(true);
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const { orderId, itemId }=useParams();
    trefoil.register();

    async function fetchOrderItem(){
        try{
            const response=await fetch(`${apiUrl}/fetchOrderItem/${orderId}/${itemId}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setLoading(false);
                setItem(result);
                setContent({ rating: result.myRating, review: result.myReview });
            }
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchOrderItem();
    }, []);

    async function addRatingAndReview(){
        try{
            const response=await fetch(`${apiUrl}/addRatingAndReview/${itemId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                navigate(-1);
                fetchOrderItem();
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async function updateRatingAndReview(){
        try{
            const response=await fetch(`${apiUrl}/updateRatingAndReview/${itemId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(content),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                fetchOrderItem();
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const handleRatingInput=(newRating)=>{
        setContent({ ...content, rating: newRating });
    }

    if(loading){
        return(
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
        )
    }

    return(
        item && (
            <div className="customer-review">
                {item.reviewed ? 
                    <h1>Edit Review</h1>
                :
                    <h1>Add Review</h1>
                }
                <div className="customer-review-details">
                    <div className="customer-review-item">
                        <div className="customer-review-item-images">
                            {item.imageUrls.length>0 ? (
                                item.imageUrls.map((imageUrl, index)=>(
                                    <img key={index} src={imageUrl} alt="img"/>
                                ))
                            ):(<></>)}
                        </div> 
                        <div className="customer-review-item-details">
                            <h3>{item.name}</h3>
                            <div className="customer-review-item-full-details">
                                <div className="customer-review-item-first">
                                    <h4>${item.price}</h4>
                                    <p>{item.type}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className="customer-review-form">
                        <div className="customer-review-form-rating">
                            <label>{item.reviewed ? "Update" : "Add"} Rating</label>
                            <div className="customer-review-form-rating-icons">
                                {Array.from({ length: 5 }).map((_, index)=>(
                                    <img
                                        key={index}
                                        src={index<content.rating ? "/icons/star-filled.png" : "/icons/star.png"}
                                        style={{ cursor: "pointer", width: "24px" }}
                                        onClick={()=>handleRatingInput(index+1)}
                                        alt="img"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="customer-review-form-review">
                            <label>{item.reviewed ? "Update" : "Add"} Review</label>
                            <textarea placeholder="Enter review..." value={content.review} onChange={(e)=>setContent({ ...content, review: e.target.value })}></textarea>
                        </div>
                        <button type="button" onClick={item.reviewed ? updateRatingAndReview : addRatingAndReview}>{item.reviewed ? "Update" : "Add"}</button>
                    </form>
                </div>
            </div>
        )
    )
}