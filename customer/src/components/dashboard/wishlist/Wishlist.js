// @ts-nocheck
import React, { useState, useEffect } from "react";
import "./Wishlist.css";
import { Item } from "../items/Item";

export function Wishlist(){
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
    }, [wishlistItems]);

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

    return(
        <div className="wishlistPage">
            {filteredItems.length>0 && (
                <div className="wishlistSearch">
                    <img src="/icons/search.png" alt="img"/>
                    <input type="text" placeholder="Search" onChange={(e)=>setSearchItem(e.target.value)}/>
                </div>
            )}
            <div className="wishlistItems">
                {filteredItems.length>0 ? (
                    filteredItems.map((item, index)=>(
                        item ? (
                            <Item item={item} key={index}/>
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