// @ts-nocheck
import { trefoil } from "ldrs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Order.css";

export function Order(){
    const [order, setOrder]=useState();
    const [loading, setLoading]=useState(true);
    const { orderId }=useParams();
    const apiUrl=process.env.REACT_APP_BACKEND_URL;
    trefoil.register();

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
            <div className="order">
                {order ? (
                    <div className="order-details">
                        <div className="order-items">
                            {order.itemDetails.map((item, index)=>(
                                <div key={index} className="order-item">
                                    <div className="order-item-images">
                                        {item.imageUrls.length>0 ? (
                                            item.imageUrls.map((imageUrl, index)=>(
                                                <img key={index} src={imageUrl} alt="img"/>
                                            ))
                                        ):(<></>)}
                                    </div>
                                    <div className="order-item-detail">
                                        <div className="order-item-first">
                                            <h3>{item.name}</h3>
                                            <h4>${item.price}</h4>
                                            <div className="order-item-ratings">
                                                {Array.from({ length: item.rating }).map((_, index)=>(
                                                    <img key={index} src="/icons/star-filled.png" alt="img"/>
                                                ))}
                                                {Array.from({ length: 5-item.rating }).map((_, index)=>(
                                                    <img key={index} src="/icons/star.png" alt="img"/>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="order-item-second">
                                            <p>{item.type}</p>
                                            <p>Qty : {item.count}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="order-other-details">
                            <p>{new Date(order.date).toLocaleDateString()}</p>
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