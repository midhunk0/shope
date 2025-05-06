/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import { trefoil } from "ldrs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Order.css";

export function Order(){
    const [order, setOrder]=useState();
    const [loading, setLoading]=useState(true);
    const { orderId }=useParams();
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    trefoil.register();
    const navigate=useNavigate();

    useEffect(()=>{
        async function fetchOrder(){
            try{
                const response=await fetch(`${apiUrl}/fetchOrder/${orderId}`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response.ok){
                    setOrder(result);
                    setLoading(false);
                }
            }
            catch(error){
                console.log(error);
            }
        }
        fetchOrder();
    }, []);

    function gotoReview(orderId, itemId){
        navigate(`/customer/review/${orderId}/${itemId}`);
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
            <div className="customer-order">
                {order ? (
                    <div className="customer-order-details">
                        <div className="customer-order-items">
                            {order.itemDetails.map((item, index)=>(
                                <div key={index} className="customer-order-item">
                                    <div className="customer-order-item-images">
                                        {/* {item.imageUrls.length>0 ? (
                                            item.imageUrls.map((imageUrl, index)=>(
                                                <img key={index} src={imageUrl} alt="img"/>
                                            ))
                                        ):(<></>)} */}
                                    </div>
                                    <div className="customer-order-item-details">
                                        <div className="customer-order-item-first">
                                            <h3>{item.name}</h3>
                                            <h4>${item.price}</h4>
                                            <div className="customer-order-item-ratings">
                                                {Array.from({ length: item.rating }).map((_, index)=>(
                                                    <img key={index} src="/icons/star-filled.png" alt="img"/>
                                                ))}
                                                {Array.from({ length: 5-item.rating }).map((_, index)=>(
                                                    <img key={index} src="/icons/star.png" alt="img"/>
                                                ))}
                                            </div>
                                            {order.status==="completed" && (
                                                <div className="customer-order-item-add-review">
                                                    {item.reviewed ? (
                                                        <button onClick={()=>gotoReview(orderId, item._id)}>Edit review</button>
                                                    ):(
                                                        <button onClick={()=>gotoReview(orderId, item._id)}>Add review</button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="customer-order-item-second">
                                            <p>{item.type}</p>
                                            <p>Qty : {item.count}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="customer-order-other-details">
                            <p>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            {/* <p>{new Date(order.createdAt).toLocaleDateString()}</p> */}
                            <p className={`status-${order.status}`}>{order.status}</p>
                            <p>Total: <span>${order.total}</span></p>
                        </div>
                    </div>
                ) : (
                    <p>There is not order</p>
                )}
            </div>
        )
    )
}