/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Home.css";
import { toast } from "react-toastify";
import { Item } from "../items/Item";

export function Home(){
    const [items, setItems]=useState([]);
    const images=[
        "/images/apple.jpg",
        "/images/sony.jpg",
        "/images/samsung.jpg",
        "/images/meta.jpg",
        "/images/google.jpg",
        "/images/nothing.jpeg",
    ];
    const apiUrl=import.meta.env.VITE_APP_API_URL;

    async function fetchItems(){
        try{
            const response=await fetch(`${apiUrl}/fetchItems`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setItems(result);
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
        fetchItems();
    }, []);

    return(
        <div className="customer-home">
            <h1>Trending Now..</h1>
            <div className="customer-home-images">
                {images.map((image, index)=>(
                    <img key={index} src={image} alt="img"/>
                ))}
            </div>
                {items.length>0 && (
                    <>
                        <h1>Latest Items..</h1>
                        <div className="customer-home-latest-items">
                            {items.slice(0, 6).map((item, index)=>(
                                <Item item={item} key={index}/>
                            ))}
                        </div>
                    </>
                )}
        </div>
    )
}