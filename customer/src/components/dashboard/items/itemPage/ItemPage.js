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
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    async function fetchSellItem(){
        try{
            const response=await fetch(`${apiUrl}/fetchItem/${itemId}`, {
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
            <div className="itemPage-buttons">
                <button type="button" onClick={goBack}>Back</button>
            </div>
            <div className="itemPage-item">
                {item ? (
                    <Item item={item}/>
                ):(
                    <></>
                )}
            </div>
        </div>
    )
}