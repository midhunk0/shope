// @ts-nocheck
import React, { useState, useEffect } from "react";
import "./Wishlist.css";
import { Item } from "../items/Item";
import { trefoil } from 'ldrs'

export function Wishlist(){
    trefoil.register()
    const [loading, setLoading]=useState(true);
    const [wishlistItems, setWishlistItems]=useState([]);
    const [searchItem, setSearchItem]=useState("");
    const [filteredItems, setFilteredItems]=useState([]);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    async function fetchWishlistItems(){
        try{
            const response=await fetch(`${apiUrl}/fetchWishlist`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setLoading(false);
                setWishlistItems(result);
                setFilteredItems(result);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchWishlistItems();
    }, []);

    function searchItems(){
        if(searchItem!==""){
            const filteredItems=wishlistItems.filter(item=>item.name.toLowerCase().includes(searchItem.toLowerCase()));
            setFilteredItems(filteredItems);
        }
        else{
            setFilteredItems(wishlistItems);
        }
    }

    useEffect(()=>{
        searchItems();
    }, [searchItem]);

    function handleItemRemoved(){
        fetchWishlistItems();
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
            filteredItems.length>0 ? (
                <div className="whishlist">
                    <div className="wishlist-search">
                            <img src="/icons/search.png" alt="img"/>
                            <input type="text" placeholder="Search" onChange={(e)=>setSearchItem(e.target.value)}/>
                        </div>
                    <div className="wishlist-items">
                        {filteredItems.map((item, index)=>(
                            <Item item={item} key={index} onItemsChanged={handleItemRemoved}/>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="wishlist-empty">
                    <p>No items</p>
                </div>
            )
        )
    )
}