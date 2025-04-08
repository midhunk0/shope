/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./ItemPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Item } from "../Item";
import { toast } from "react-toastify";
import { trefoil } from "ldrs";

export function ItemPage(){
    trefoil.register();

    const [item, setItem]=useState(null);
    const [loading, setLoading]=useState(true);
    const navigate=useNavigate();
    const location=useLocation();
    const { itemId }=location.state;
    const apiUrl=import.meta.env.VITE_APP_API_URL;

    async function fetchSellItem(){
        try{
            const response=await fetch(`${apiUrl}/fetchSellItem/${itemId}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setLoading(false);
                setItem(result);
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
            <div className="seller-itemPage">
                <div className="seller-itemButtons">
                    <button type="button" onClick={goBack}>Back</button>
                </div>
                <div className="seller-itemContainer">
                    {item ? (
                        <Item item={item}/>
                    ):(
                        <></>
                    )}
                </div>
            </div>
        )
    )
}