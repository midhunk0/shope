/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Update.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export function Update(){
    const [item, setItem]=useState(null);
    const [updateData, setUpdateData]=useState({
        name: "",
        type: "",
        description: "",
        price: "",
        pieceLeft: ""
    })
    const { itemId }=useParams();
    const navigate=useNavigate();
    const apiUrl=import.meta.env.VITE_APP_DEV_URL;

    async function fetchSellItem(){
        try{
            const response=await fetch(`${apiUrl}/fetchSellItem/${itemId}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setItem(result);
                setUpdateData({
                    name: result.name,
                    type: result.type,
                    description: result.description,
                    price: result.price,
                    pieceLeft: result.pieceLeft
                })
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

    async function updateSellItem(e){
        e.preventDefault();
        try{    
            const response=await fetch(`${apiUrl}/updateSellItem/${itemId}`, {
                method: "PUT",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify(updateData),
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                toast.success(result.message);
                goBack();
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
        <div className="seller-updatePage">
            <form onSubmit={updateSellItem}>
                <div className="seller-updateButtons">
                    <button type="submit">Update</button>
                    <button type="button" onClick={goBack}>Back</button>
                </div>
                {item && (
                    <div className="seller-updateInputs">
                        <div className="seller-updateInputBlock">
                            <label htmlFor="name">Name</label>
                            <input type="text" value={updateData.name} id="name" onChange={(e)=>setUpdateData({...updateData, name: e.target.value})}/>
                        </div>
                        <div className="seller-updateInputBlock">
                            <label htmlFor="type">Type</label>
                            <input type="text" value={updateData.type} id="type" onChange={(e)=>setUpdateData({...updateData, type: e.target.value})}/>
                        </div>
                        <div className="seller-updateInputBlock">
                            <label htmlFor="description">Description</label>
                            <input type="text" value={updateData.description} id="description" onChange={(e)=>setUpdateData({...updateData, description: e.target.value})}/>
                        </div>
                        <div className="seller-updateInputBlock">
                            <label htmlFor="price">Price</label>
                            <input type="text" value={updateData.price} id="price" onChange={(e)=>setUpdateData({...updateData, price: e.target.value})}/>
                        </div>
                        <div className="seller-updateInputBlock">
                            <label htmlFor="pieceLeft">Piece Left</label>
                            <input type="text" value={updateData.pieceLeft} id="pieceLeft" onChange={(e)=>setUpdateData({...updateData, pieceLeft: e.target.value})}/>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}