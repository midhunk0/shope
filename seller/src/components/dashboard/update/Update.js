import React from "react";
import "./Update.css";
import { useNavigate } from "react-router-dom";

export function Update(){
    const navigate=useNavigate();

    function goBack(){
        navigate(-1);
    }

    async function updateSellItem(){

    }

    return(
        <div className="updatePage">
            <form onSubmit={updateSellItem}>
                <div className="updateButtons">
                    <button type="submit">Update</button>
                    <button type="button" onClick={goBack}>Back</button>
                </div>
                <div className="updateInputs">
                    <div className="updateInputBlock">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name"/>
                    </div>
                    <div className="updateInputBlock">
                        <label htmlFor="type">Type</label>
                        <input type="text" id="type"/>
                    </div>
                    <div className="updateInputBlock">
                        <label htmlFor="description">Description</label>
                        <input type="text" id="description"/>
                    </div>
                    <div className="updateInputBlock">
                        <label htmlFor="price">Price</label>
                        <input type="text" id="price"/>
                    </div>
                    <div className="updateInputBlock">
                        <label htmlFor="pieceLeft">Piece Left</label>
                        <input type="text" id="pieceLeft"/>
                    </div>
                </div>
            </form>
        </div>
    )
}