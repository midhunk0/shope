// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./ItemPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Item } from "../Item";
import { toast } from "react-toastify";

export function ItemPage(){
    const [item, setItem]=useState(null);
    const navigate=useNavigate();
    const location=useLocation();
    const { itemId }=location.state;
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    async function fetchSellItem(){
        try{
            const response=await fetch(`${apiUrl}/fetchSellItem/${itemId}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
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
        <div className="itemPage">
            <div className="itemButtons">
                <button type="button" onClick={goBack}>Back</button>
            </div>
            <div className="itemContainer">
                {item ? (
                    <Item item={item}/>
                ):(
                    <></>
                )}
            </div>
        </div>
    )
}