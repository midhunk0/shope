// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Item.css";
import { useNavigate, useLocation } from "react-router-dom";

export function Item(){
    const [item, setItem]=useState({});
    const navigate=useNavigate();
    const location=useLocation();
    const { itemId }=location.state;
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    async function fetchSellItem(){
        try{
            const response=await fetch(`${apiUrl}/fetchSellItem/${itemId}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setItem(result);
            }
            else{
                console.log(result.message);
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

    function updateItem(){

    }

    function deleteItem(){

    }

    return(
        <div className="itemPage">
            <div className="ItemButtons">
                <button type="button" onClick={goBack}>Back</button>
            </div>
            <div className="item">
                <div className="images">
                    {item.imageUrls?.length>0 && item.imageUrls.map((imageUrl, index)=>(
                        <img src={imageUrl} alt="img" key={index}/>
                    ))}
                </div>
                <div className="itemDetails">
                    <div className="primary">
                        <h3>{item.name}</h3>
                        <p>{item.type}</p>
                    </div>
                    <div className="secondary">
                        <h3>${item.price}</h3>
                        <div className="buttons">
                            <button type="button" onClick={updateItem}>
                                <img src="/icons/update.png" alt="img"/>
                            </button>
                            <button type="button" onClick={deleteItem}>
                                <img src="/icons/delete.png" alt="img"/>
                            </button>
                        </div>
                    </div>
                    <div className="tertiary">
                        <p>{item.description}</p>
                    </div>
                </div>
                <div className="transactions">
                    <h3>Transactions</h3>
                </div>
            </div>
        </div>
    )
}