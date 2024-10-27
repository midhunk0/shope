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
        // "/images/apple-watch.jpg",
        // "/images/dji.jpg",
        // "/images/pocket-camera.jpg",
        // "/images/logi-mouse.jpg",
        // "/images/i-phone.jpg"
    ];
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

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
        <div className="homePage">
            <h1>Trending Now..</h1>
            <div className="homeImages">
                {images.map((image, index)=>(
                    <img key={index} src={image} alt="img"/>
                ))}
            </div>
                {items.length>0 && (
                    <>
                        <h1>Latest Items..</h1>
                        <div className="latestItems">
                            {items.slice(0, 6).map((item, index)=>(
                                <Item item={item} key={index}/>
                            ))}
                        </div>
                    </>
                )}
        </div>
    )
}