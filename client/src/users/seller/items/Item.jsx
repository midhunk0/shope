// @ts-nocheck
import React from "react";
import "./Item.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Item({ item, onClick }){
    const navigate=useNavigate();
    const apiUrl=import.meta.env.VITE_APP_API_URL;

    function updateItem(e, itemId){
        e.stopPropagation();
        navigate(`/seller/update/${itemId}`);
    }

    async function deleteItem(e, itemId){
        e.stopPropagation();
        try{
            const response=await fetch(`${apiUrl}/deleteSellItem/${itemId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const result=await response.json();
            if(response){
                toast.success(result.message);
                window.location.reload();
            }
            else{
                toast.error(result.message);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    return(
        <div className="seller-item" onClick={onClick}>
            <div className="seller-images">
                {item && item.imageUrls?.length>0 ? (
                    item.imageUrls.map((imageUrl, index)=>(
                        <img src={imageUrl} alt="img" key={index}/>
                    ))
                ):(
                    <></>
                )}
            </div>
                {item && (
                    <div className="seller-itemDetails">
                        <div className="seller-primary">
                            <h3>{item.name}</h3>
                            <p>{item.type}</p>
                        </div>
                        <div className="seller-secondary">
                            <h3>${item.price}</h3>
                            <div className="seller-buttons">
                                <button type="button" onClick={(e)=>updateItem(e, item._id)}>
                                    <img src="/icons/update.png" alt="img"/>
                                </button>
                                <button type="button" onClick={(e)=>deleteItem(e, item._id)}>
                                    <img src="/icons/delete.png" alt="img"/>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}