/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Items.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Items(){
    const [items, setItems]=useState([]);
    const [loading, setLoading]=useState(true);
    const [selected, setSelected]=useState(null);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;
    const navigate=useNavigate();

    async function fetchSellItems(){
        try{
            setLoading(true);
            const response=await fetch(`${apiUrl}/fetchSellItems`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setItems(result);
                toast.success(result.message);
            }
            else{
                toast.error(result.error);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchSellItems();
    }, []);

    function searchItems(){

    }

    function viewItem(itemId){
        navigate("/dashboard/item", { state: {itemId}});
    }

    function updateItem(){

    }

    function deleteItem(){

    }

    return(
        <div className="itemsPage">
            <div className="search">
                <img src="/icons/search.png" alt="img"/>
                <input type="text" placeholder="search" onChange={searchItems}/>
            </div>
            <div className="items">
                {items.length>0 ? (items.map((item, index)=>(
                    <div className="itemContainer" key={index}>
                    <div className="item">
                        <div className="images">
                            {item.imageUrls.map((imageUrl, index)=>(
                                <img src={imageUrl} alt="img" key={index} onClick={()=>viewItem(item._id)}/>
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
                        </div>
                    </div>
                    </div>
                    ))
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    )
}