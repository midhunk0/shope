// @ts-nocheck
import React, { useState, useEffect } from "react";
import "./Cart.css";
import { Item } from "../items/Item";

export function Cart(){
    const [cartItems, setCartItems]=useState([]);
    const [count, setCount]=useState([]);
    const [details, setDetails]=useState({
        name: "",
        phone: "",
        email: "",
        address: "",
    })
    const [cost, setCost]=useState(0);
    const apiUrl=process.env.REACT_APP_BACKEND_URL;

    async function fetchCartItems(){
        try{
            const response=await fetch(`${apiUrl}/fetchCart`, {
                method: "GET",
                credentials: "include"
            });
            const result=await response.json();
            const filteredResult = result.filter(item => item !== null);
            if(response.ok){
                setCartItems(filteredResult);
                setCount(filteredResult.map(()=>1));
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchCartItems();
    }, []);

    function changeCount(index, op){
        setCount(prevCount=>prevCount.map((count, i)=>{
            if(i===index){
                if(op==='+' && count<cartItems[i].pieceLeft){
                    return count+1;
                }
                else if(op==='-' && count>1){
                    return count-1;
                }
            }
            return count;
        }))
    }

    function updateCost() {
        let total=0;
        cartItems.map((item, index)=>{
            total+=item.price*count[index];
        })
        setCost(total);
    }

    useEffect(() => {
        updateCost();
    }, [count, cartItems]);

    function handleItemRemoved(){
        fetchCartItems();
    }

    function submitCart(){

    }

    return(
        <div className="cartPage">
            <div className="cartItems">
                {cartItems.length>0 ? (
                    cartItems.map((item, index)=>(
                        item ? (
                            <div key={index} className="cartItemDetails">
                                <Item item={item} onItemRemoved={handleItemRemoved}/>
                                <div className="counter">
                                    <button onClick={()=>changeCount(index, '-')}><img src="/icons/minus.png" alt="img"/></button>
                                    <p>{count[index]}</p>
                                    <button onClick={()=>changeCount(index, '+')}><img src="/icons/add.png" alt="img"/></button>
                                </div>
                            </div>
                        ):(
                            null
                        )
                    ))
                ):(
                    <p>No items</p>
                )}
            </div>
            <div className="cartSubmit">
                <form onSubmit={submitCart}>
                    <h2>Shipping Details</h2>
                    <input type="text" placeholder="Name" onChange={(e)=>setDetails({...details, name: e.target.value})}/>
                    <input type="text" placeholder="Phone" onChange={(e)=>setDetails({...details, phone: e.target.value})}/>
                    <input type="text" placeholder="Email" onChange={(e)=>setDetails({...details, email: e.target.value})}/>
                    <input type="text" placeholder="Address" onChange={(e)=>setDetails({...details, address: e.target.value})}/>
                    <div className="summary">
                        <p>Summary</p>
                        <hr/>
                        <div className="cost">
                            <p>Total cost</p>
                            <p>{cost}</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}