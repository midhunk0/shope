// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./itemsPage.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Item } from "../Item";

export function ItemsPage(){
    const [items, setItems]=useState([]);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;
    const navigate=useNavigate();

    async function fetchSellItems(){
        try{
            const response=await fetch(`${apiUrl}/fetchSellItems`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setItems(result);
                toast.success(response.message);
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
        fetchSellItems();
    }, []);

    function viewItem(itemId){
        navigate("/dashboard/item", { state: { itemId }});
    }

    return(
        <div className="itemsPage">
            <div className="itemsSearch">
                <img src="/icons/search.png" alt="img"/>
                <input type="text" placeholder="Search"/>
            </div>
            <div className="items">
                {items.length>0 ? (
                    items.map((item, index)=>(
                        item ? (
                            <Item item={item} key={index} onClick={()=>viewItem(item._id)}/>
                        ):(
                            null
                        )
                    ))
                ):(
                    <p>No items</p>
                )}
            </div>
        </div>
    )
}