// @ts-nocheck
import React, { useState } from "react";
import "./Create.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Create() {
    const [itemData, setItemData]=useState({
        name: "",
        type: "",
        description: "",
        price: "",
        pieceLeft: ""
    });
    const [imageList, setImageList]=useState([]);
    const [loading, setLoading]=useState(false);
    const navigate=useNavigate();
    const apiUrl=import.meta.env.VITE_APP_API_URL;

    function goBack(){
        navigate(-1);
    }

    function drop(e){
        e.preventDefault();
        const files=Array.from(e.dataTransfer.files);
        setImageList(prevImages=>[...prevImages, ...files]);
    }

    function drag(e){
        e.preventDefault();
    }

    function fileInput(e){
        const files=Array.from(e.target.files);
        setImageList(prevImages=>[...prevImages, ...files]);
    }

    function remove(index){
        const updatedList=imageList.filter((_, i)=>i!==index);
        setImageList(updatedList);
    }

    async function createSellItem(e){
        e.preventDefault();

        try{
            setLoading(true);
            const formData=new FormData();
            for(const key in itemData){
                formData.append(key, itemData[key]);
            }

            imageList.forEach(file=>{
                formData.append("images", file); 
            });

            const response=await fetch(`${apiUrl}/createSellItem`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const result=await response.json();
            if(response.ok){
                setLoading(false);
                toast.success(result.message);
                navigate("/seller/items");
            } 
            else{
                setLoading(false);
                toast.error(result.message);
            }
        } 
        catch(error){
            setLoading(false);
            console.error(error);
            toast.error("Something went wrong.");
        }
    }

    return (
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
            <div className="seller-create">
                <form onSubmit={createSellItem}>
                    <div className="seller-createButtons">
                        <button type="submit">Create</button>
                        <button type="button" onClick={goBack}>Back</button>
                    </div>
                    <div className="seller-createInputs">
                        <div className="seller-inputBlock">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" onChange={(e) => setItemData({ ...itemData, name: e.target.value })} />
                        </div>
                        <div className="seller-uploads">
                            <p>Upload the Images</p>
                            <div className="seller-dropArea" onDrop={drop} onDragOver={drag}>
                                <p>Drag and drop images here</p>
                                <input type="file" id="images" onChange={fileInput} multiple />
                                <label htmlFor="images">Browse Files</label>
                            </div>
                            {imageList.length > 0 && (
                                <div className="seller-fileList">
                                    {imageList.map((file, index) => (
                                        <div className="seller-fileItem" key={index}>
                                            <p>{file.name}</p>
                                            <img src="/icons/close.png" alt="img" onClick={() => remove(index)} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="seller-inputBlock">
                            <label htmlFor="typetype">Type</label>
                            <input type="text" id="type" onChange={(e) => setItemData({ ...itemData, type: e.target.value })} />
                        </div>
                        <div className="seller-inputBlock">
                            <label htmlFor="description">Description</label>
                            <input type="text" id="description" onChange={(e) => setItemData({ ...itemData, description: e.target.value })} />
                        </div>
                        <div className="seller-inputBlock">
                            <label htmlFor="price">Price</label>
                            <input type="text" id="price" onChange={(e) => setItemData({ ...itemData, price: e.target.value })} />
                        </div>
                        <div className="seller-inputBlock">
                            <label htmlFor="pieceLeft">Piece Left</label>
                            <input type="text" id="pieceLeft" onChange={(e) => setItemData({ ...itemData, pieceLeft: e.target.value })} />
                        </div>
                    </div>
                </form>
            </div>
        )
    )
}
