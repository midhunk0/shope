/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./ItemsPage.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Item } from "../Item";
import { trefoil } from "ldrs";

export function ItemsPage(){
    trefoil.register();

    const [items, setItems]=useState([]);
    const [searchItem, setSearchItem]=useState("");
    const [filteredItems, setFilteredItems]=useState([]);
    const [loading, setLoading]=useState(true);
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const navigate=useNavigate();

    async function fetchSellItems(){
        try{
            const response=await fetch(`${apiUrl}/fetchSellItems`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setLoading(false);
                setItems(result);
                setFilteredItems(result);
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
        navigate("/seller/item", { state: { itemId }});
    }

    function searchItems(){
        if(searchItem!==""){
            const filteredItems=items.filter(item=>item.name.toLowerCase().includes(searchItem.toLowerCase()));
            setFilteredItems(filteredItems);
        }
        else{
            setFilteredItems(items);
        }
    }

    useEffect(()=>{
        searchItems();
    }, [searchItem]);

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

    if(filteredItems.length===0){
        return(
            <div className="seller-itemsPage-empty">
                <p>No items</p>
            </div>
        )
    }

    return(
        <div className="seller-itemsPage">
            <div className="seller-itemsSearch">
                <img src="/icons/search.png" alt="img"/>
                <input type="text" placeholder="Search" onChange={(e)=>setSearchItem(e.target.value)}/>
            </div>
            <div className="seller-items">
                {filteredItems.map((item, index)=>(
                    item ? 
                        <Item item={item} key={index} onClick={()=>viewItem(item._id)}/>
                    :
                        null
                ))}
            </div>
        </div>
    )
}