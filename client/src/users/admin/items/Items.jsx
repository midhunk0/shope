// @ts-nocheck
import React, { useEffect, useState } from "react";
import "./Items.css";
import { trefoil } from "ldrs";

export const Items=()=>{
    const [items, setItems]=useState([]);
    const [item, setItem]=useState();
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState();
    const apiUrl=import.meta.env.VITE_APP_API_URL;
    const [width, setWidth]=useState(window.innerWidth);
    const [showDetails, setShowDetails]=useState(false);
    
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    trefoil.register();

    useEffect(()=>{
        const fetchItems=async()=>{
            try{
                const response=await fetch(`${apiUrl}/admin/fetchItems`, {
                    method: "GET",
                    credentials: "include"
                });
                const result=await response.json();
                if(response){
                    setLoading(false);
                }
                if(response.ok){
                    setItems(result.items);
                }
                else{
                    setError(result.message);
                }
            }
            catch(error){
                console.log("Error fetching items: ", error);
            }
        };
        fetchItems();
    }, [apiUrl]);

    const fetchItem=async(itemId)=>{
        try{
            const response=await fetch(`${apiUrl}/admin/fetchItem/${itemId}`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            if(response.ok){
                setItem(result.item);
                if(width<1080) setShowDetails(true);
            }
        }
        catch(error){
            console.log("Error while fetching the item: ", error);
        }
    };

    const toggleVerifyItem=async({ sellerId, itemId })=>{
        try{
            const response=await fetch(`${apiUrl}/admin/toggleVerifyItem/${sellerId}/${itemId}`, {
                method: "PUT",
                credentials: "include"
            });
            // const result=await response.json();
            if(response.ok){
                setItems((prevItems)=>
                    prevItems.map((item)=>
                        item._id===itemId ? {
                            ...item, 
                            verified: !item.verified
                        } : item
                    )    
                );
                setItem({ ...item, verified: !item.verified });
            }
        }
        catch(error){
            console.log("Error while toggle verification: ", error);
        }
    };

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

    if(items.length===0){
        return(
            <div className="admin-items-empty">
                {error}
            </div>
        )
    }

    return(
        <div className="admin-items">
            <h1>Items</h1>
            <div className="admin-items-details">
            {(width>=1080 || !showDetails) && (
                <table className="admin-items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Seller</th>
                            <th>Pieces Left</th>
                            <th>Verified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item)=>(
                            <tr key={item._id} onClick={()=>fetchItem(item._id)}>
                                <td>{item.name}</td>
                                <td>{item.type}</td>
                                <td>{item.price}</td>
                                <td>{item.username}</td>
                                <td>{item.pieceLeft}</td>
                                <td>{item.verified ? <img src="/icons/check.png"/> : <img src="/icons/close.png"/>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {(width>=1080 || showDetails) && (
                item ? (
                    <div className="admin-item-details">
                        {width<1080 && (
                            <button onClick={() => setShowDetails(false)}>Back</button>
                        )}
                        <div className="admin-item-images">
                            {item && item.imageUrls?.length>0 ? (
                                item.imageUrls.map((imageUrl, index)=>(
                                    <img src={imageUrl} alt="img" key={index}/>
                                ))
                            ):(
                                <></>
                            )}
                        </div>
                        <p>{item.name}</p>
                        <p>{item.type}</p>
                        <p>{item.pieceLeft}</p>
                        <button className={item.verified ? "remove" : "verify"} onClick={()=>toggleVerifyItem({ sellerId: item.sellerId, itemId: item._id })}>
                            {item.verified ? "Remove" : "Verify"}
                        </button>
                    </div>
                ):(
                    <div className="admin-item-empty">
                        <p>Nothing selected</p>
                    </div>
                )
            )}
            </div>
        </div>
    )
}